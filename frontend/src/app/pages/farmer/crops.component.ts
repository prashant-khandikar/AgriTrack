import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CropService, ActivityService, ExpenseService } from '../../services/api.service';
import { Crop, Activity, Expense } from '../../models/models';
import { ToastService } from '../../services/toast.service';

type ModalType = 'addCrop' | 'harvest' | 'activity' | 'expense' | null;

@Component({
  selector: 'app-crops',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">My Crops 🌱</h1>
      <p class="page-subtitle">Manage all your crops, activities and expenses</p>
    </div>
    <div class="page-body">
      <div class="toolbar">
        <div class="search-bar">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input [(ngModel)]="search" placeholder="Search crops..." />
        </div>
        <button class="btn btn-primary" (click)="openModal('addCrop')">
          <i class="fa-solid fa-plus"></i> Add Crop
        </button>
      </div>

      <!-- Crops Grid -->
      <div *ngIf="loading" class="spinner-overlay"><div class="spinner"></div></div>

      <div *ngIf="!loading && filteredCrops.length === 0" class="empty-state">
        <i class="fa-solid fa-seedling"></i>
        <p>No crops found. Add your first crop!</p>
      </div>

      <div class="crops-grid" *ngIf="!loading">
        <div class="crop-card" *ngFor="let c of filteredCrops">
          <div class="crop-card-header" [class]="'crop-header-' + (c.status || '').toLowerCase()">
            <div class="crop-card-emoji">{{ getCropEmoji(c.name) }}</div>
            <div>
              <div class="crop-card-name">{{ c.name }}</div>
              <div class="crop-card-season">{{ c.season }}</div>
            </div>
            <span class="badge ml-auto" [class]="getStatusClass(c.status)">{{ c.status }}</span>
          </div>
          <div class="crop-card-body">
            <div class="crop-date-row">
              <div class="crop-date-item">
                <i class="fa-regular fa-calendar"></i>
                <span>Sown: {{ c.sowingDate | date:'mediumDate' }}</span>
              </div>
              <div class="crop-date-item" *ngIf="c.harvestDate">
                <i class="fa-solid fa-wheat-awn"></i>
                <span>Harvest: {{ c.harvestDate | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>
          <div class="crop-card-actions">
            <button class="btn btn-sm btn-secondary" (click)="selectCrop(c); openModal('activity')">
              <i class="fa-solid fa-plus"></i> Activity
            </button>
            <button class="btn btn-sm btn-outline" (click)="selectCrop(c); openModal('expense')">
              <i class="fa-solid fa-rupee-sign"></i> Expense
            </button>
            <button *ngIf="c.status !== 'HARVESTED'" class="btn btn-sm btn-amber" (click)="selectCrop(c); openModal('harvest')">
              <i class="fa-solid fa-wheat-awn"></i> Harvest
            </button>
            <button class="btn btn-sm btn-danger" (click)="deleteCrop(c.id!)">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>

          <!-- Activities preview -->
          <div class="crop-expand" *ngIf="activitiesMap[c.id ?? 0] && activitiesMap[c.id ?? 0].length > 0">
            <div class="expand-title">Activities</div>
            <div class="activity-chip" *ngFor="let a of activitiesMap[c.id ?? 0].slice(0,3)">
              <i class="fa-solid fa-leaf"></i> {{ a.type }} • {{ a.date | date:'shortDate' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Crop Modal -->
    <div class="modal-backdrop" *ngIf="modal === 'addCrop'" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">🌱 Add New Crop</div>
          <button class="modal-close" (click)="closeModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <form [formGroup]="cropForm">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Crop Name *</label>
                <input class="form-control" formControlName="name" placeholder="e.g., Wheat" />
              </div>
              <div class="form-group">
                <label class="form-label">Season *</label>
                <select class="form-control" formControlName="season">
                  <option value="">Select season</option>
                  <option>Kharif</option>
                  <option>Rabi</option>
                  <option>Zaid</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Sowing Date *</label>
              <input type="date" class="form-control" formControlName="sowingDate" />
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-control" formControlName="status">
                <option value="SOWN">Sown</option>
                <option value="GROWING">Growing</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="closeModal()">Cancel</button>
          <button class="btn btn-primary" (click)="addCrop()" [disabled]="saving">
            <span *ngIf="saving" class="btn-spinner"></span>
            {{ saving ? 'Adding...' : 'Add Crop' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Harvest Modal -->
    <div class="modal-backdrop" *ngIf="modal === 'harvest'" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">🌾 Mark as Harvested</div>
          <button class="modal-close" (click)="closeModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <p style="margin-bottom:16px;color:#4a4a6a">Crop: <strong>{{ selectedCrop?.name }}</strong></p>
          <div class="form-group">
            <label class="form-label">Harvest Date *</label>
            <input type="date" class="form-control" [(ngModel)]="harvestDate" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="closeModal()">Cancel</button>
          <button class="btn btn-amber" (click)="markHarvest()" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Mark Harvested' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Activity Modal -->
    <div class="modal-backdrop" *ngIf="modal === 'activity'" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">🔧 Add Activity</div>
          <button class="modal-close" (click)="closeModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <p style="margin-bottom:16px;color:#4a4a6a">Crop: <strong>{{ selectedCrop?.name }}</strong></p>
          <form [formGroup]="activityForm">
            <div class="form-group">
              <label class="form-label">Activity Type *</label>
              <select class="form-control" formControlName="type">
                <option value="">Select type</option>
                <option>SOWING</option>
                <option>WATERING</option>
                <option>FERTILIZING</option>
                <option>PESTICIDE</option>
                <option>PRUNING</option>
                <option>HARVESTING</option>
                <option>OTHER</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="closeModal()">Cancel</button>
          <button class="btn btn-primary" (click)="addActivity()" [disabled]="saving">
            {{ saving ? 'Adding...' : 'Add Activity' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Expense Modal -->
    <div class="modal-backdrop" *ngIf="modal === 'expense'" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">💰 Add Expense</div>
          <button class="modal-close" (click)="closeModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <p style="margin-bottom:16px;color:#4a4a6a">Crop: <strong>{{ selectedCrop?.name }}</strong></p>
          <form [formGroup]="expenseForm">
            <div class="form-group">
              <label class="form-label">Expense Type *</label>
              <select class="form-control" formControlName="type">
                <option value="">Select type</option>
                <option>SEED</option>
                <option>LABOR</option>
                <option>FERTILIZER</option>
                <option>PESTICIDE</option>
                <option>EQUIPMENT</option>
                <option>IRRIGATION</option>
                <option>OTHER</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Amount (₹) *</label>
              <input type="number" class="form-control" formControlName="amount" placeholder="0.00" />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="closeModal()">Cancel</button>
          <button class="btn btn-primary" (click)="addExpense()" [disabled]="saving">
            {{ saving ? 'Adding...' : 'Add Expense' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 12px; }
    .crops-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 20px; }
    .crop-card { background: white; border-radius: 14px; border: 1px solid #e2e8f0; box-shadow: 0 1px 4px rgba(0,0,0,0.06); overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
    .crop-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
    .crop-card-header { display: flex; align-items: center; gap: 12px; padding: 16px; }
    .crop-header-sown { background: linear-gradient(135deg,#e0f2fe,#bae6fd); }
    .crop-header-growing { background: linear-gradient(135deg,#d8f3dc,#b7e4c7); }
    .crop-header-harvested { background: linear-gradient(135deg,#fef3c7,#fde68a); }
    .crop-card-emoji { font-size: 2rem; flex-shrink: 0; }
    .crop-card-name { font-weight: 700; font-size: 1rem; color: #1a1a2e; }
    .crop-card-season { font-size: 0.78rem; color: #4a4a6a; }
    .ml-auto { margin-left: auto; }
    .crop-card-body { padding: 12px 16px; }
    .crop-date-row { display: flex; flex-direction: column; gap: 6px; }
    .crop-date-item { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #4a4a6a; }
    .crop-card-actions { display: flex; gap: 8px; padding: 12px 16px; flex-wrap: wrap; border-top: 1px solid #f1f5f9; }
    .crop-expand { padding: 10px 16px; background: #f8fafc; border-top: 1px solid #f1f5f9; }
    .expand-title { font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
    .activity-chip { display: inline-flex; align-items: center; gap: 5px; background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 3px 10px; font-size: 0.75rem; color: #2d6a4f; margin-right: 6px; margin-bottom: 4px; }
    .btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media(max-width:600px) { .toolbar { flex-direction: column; align-items: stretch; } .toolbar .btn { width: 100%; justify-content: center; } }
  `]
})
export class CropsComponent implements OnInit {
  crops: Crop[] = [];
  activitiesMap: Record<number, Activity[]> = {};
  loading = true;
  saving = false;
  search = '';
  modal: ModalType = null;
  selectedCrop: Crop | null = null;
  harvestDate = '';
  farmerId!: number;

  cropForm = this.fb.group({
    name: ['', Validators.required],
    season: ['', Validators.required],
    sowingDate: ['', Validators.required],
    status: ['SOWN']
  });

  activityForm = this.fb.group({ type: ['', Validators.required] });
  expenseForm = this.fb.group({
    type: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]]
  });

  get filteredCrops() {
    return this.crops.filter(c => c.name.toLowerCase().includes(this.search.toLowerCase()));
  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private cropSvc: CropService,
    private actSvc: ActivityService,
    private expSvc: ExpenseService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.farmerId = this.auth.getFarmer()?.id!;
    this.loadCrops();
  }

  loadCrops() {
    this.loading = true;
    this.cropSvc.getCropsByFarmer(this.farmerId).subscribe({
      next: (crops) => {
        this.crops = crops;
        this.loading = false;
        crops.forEach(c => {
          if (c.id) {
            this.actSvc.getActivitiesByCrop(c.id).subscribe(acts => {
              this.activitiesMap[c.id!] = acts;
            });
          }
        });
      },
      error: () => { this.loading = false; }
    });
  }

  openModal(type: ModalType) { this.modal = type; }
  closeModal() { this.modal = null; this.selectedCrop = null; this.harvestDate = ''; }
  selectCrop(c: Crop) { this.selectedCrop = c; }

  addCrop() {
    if (this.cropForm.invalid) { this.cropForm.markAllAsTouched(); return; }
    this.saving = true;
    this.cropSvc.addCrop(this.cropForm.value as any, this.farmerId).subscribe({
      next: () => {
        this.toast.success('Crop added successfully! 🌱');
        this.cropForm.reset({ status: 'SOWN' });
        this.closeModal();
        this.loadCrops();
        this.saving = false;
      },
      error: () => { this.toast.error('Failed to add crop'); this.saving = false; }
    });
  }

  markHarvest() {
    if (!this.selectedCrop?.id || !this.harvestDate) { this.toast.error('Please select harvest date'); return; }
    this.saving = true;
    this.cropSvc.markHarvest(this.selectedCrop.id, { status: 'HARVESTED', harvestDate: this.harvestDate }).subscribe({
      next: () => {
        this.toast.success('Crop marked as harvested! 🌾');
        this.closeModal();
        this.loadCrops();
        this.saving = false;
      },
      error: () => { this.toast.error('Failed to update crop'); this.saving = false; }
    });
  }

  addActivity() {
    if (this.activityForm.invalid || !this.selectedCrop?.id) { this.activityForm.markAllAsTouched(); return; }
    this.saving = true;
    this.actSvc.addActivity(this.activityForm.value as any, this.selectedCrop.id).subscribe({
      next: () => {
        this.toast.success('Activity added!');
        this.activityForm.reset();
        this.closeModal();
        this.loadCrops();
        this.saving = false;
      },
      error: () => { this.toast.error('Failed to add activity'); this.saving = false; }
    });
  }

  addExpense() {
    if (this.expenseForm.invalid || !this.selectedCrop?.id) { this.expenseForm.markAllAsTouched(); return; }
    this.saving = true;
    this.expSvc.addExpense(this.expenseForm.value as any, this.selectedCrop.id).subscribe({
      next: () => {
        this.toast.success('Expense recorded!');
        this.expenseForm.reset();
        this.closeModal();
        this.saving = false;
      },
      error: () => { this.toast.error('Failed to add expense'); this.saving = false; }
    });
  }

  deleteCrop(id: number) {
    if (!confirm('Delete this crop and all related data?')) return;
    this.cropSvc.delete(id).subscribe({
      next: () => { this.toast.success('Crop deleted'); this.loadCrops(); },
      error: () => this.toast.error('Failed to delete crop')
    });
  }

  getCropEmoji(name: string) {
    const map: Record<string, string> = {
      wheat: '🌾', rice: '🌾', corn: '🌽', tomato: '🍅', potato: '🥔',
      onion: '🧅', sugarcane: '🎋', cotton: '🪴', soybean: '🫘'
    };
    return map[name?.toLowerCase()] || '🌱';
  }

  getStatusClass(s: string) {
    const m: Record<string, string> = { SOWN: 'badge-blue', GROWING: 'badge-green', HARVESTED: 'badge-amber' };
    return m[s] || 'badge-gray';
  }
}