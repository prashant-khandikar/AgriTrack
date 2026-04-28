package symbiosisProject.AgriTrack.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Crop {
 
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
    private String season;
    private String status; // SOWN, GROWING, HARVESTED

    private LocalDate sowingDate;
    private LocalDate harvestDate;
    
    //many crop -> one farmer
    @ManyToOne
    @JoinColumn(name="farmer_id")
    @JsonBackReference
    private Farmer farmer;
    
    //one crop -> many activities
    @OneToMany(mappedBy = "crop" , cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Activity> activities;
    
    //one crop-> many expenses
    @OneToMany(mappedBy = "crop" , cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Expense> expenses;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSeason() {
		return season;
	}

	public void setSeason(String season) {
		this.season = season;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDate getSowingDate() {
		return sowingDate;
	}

	public void setSowingDate(LocalDate sowingDate) {
		this.sowingDate = sowingDate;
	}

	public LocalDate getHarvestDate() {
		return harvestDate;
	}

	public void setHarvestDate(LocalDate harvestDate) {
		this.harvestDate = harvestDate;
	}

	public Farmer getFarmer() {
		return farmer;
	}

	public void setFarmer(Farmer farmer) {
		this.farmer = farmer;
	}

	public List<Activity> getActivities() {
		return activities;
	}

	public void setActivities(List<Activity> activities) {
		this.activities = activities;
	}

	public List<Expense> getExpenses() {
		return expenses;
	}

	public void setExpenses(List<Expense> expenses) {
		this.expenses = expenses;
	}
    
}
