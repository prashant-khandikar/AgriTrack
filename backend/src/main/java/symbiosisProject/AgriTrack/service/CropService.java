package symbiosisProject.AgriTrack.service;


import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import symbiosisProject.AgriTrack.entity.Crop;
import symbiosisProject.AgriTrack.entity.Expense;
import symbiosisProject.AgriTrack.entity.Farmer;
import symbiosisProject.AgriTrack.repository.CropRepository;
import symbiosisProject.AgriTrack.repository.ExpenseRepository;
import symbiosisProject.AgriTrack.repository.FarmerRepository;
import symbiosisProject.AgriTrack.repository.OrderRepository;


@Service
public class CropService {
 
	@Autowired
	public CropRepository repo;
	
	@Autowired
	public FarmerRepository frepo;
	
	@Autowired
	private ExpenseRepository expenseRepo;
	
	@Autowired
	private OrderRepository orderRepo ;

 
    public Crop addCrop(Crop c, Long farmerId) {

        Farmer f = frepo.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        c.setFarmer(f);

        return repo.save(c);
    }

   
    public List<Crop> getCropsByFarmer(Long farmerId) {
        return repo.findByFarmerId(farmerId);
    }

   
    public Crop markHarvest(Long cropId, Crop updatedCrop) {

        Crop c = repo.findById(cropId)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        c.setStatus("HARVESTED");
        c.setHarvestDate(updatedCrop.getHarvestDate());

        return repo.save(c);
    }

    public List<Crop> getAllCrop() {
        return repo.findAll();
    }

    public Crop getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found"));
    }

    public String deleteById(Long id) {
        repo.deleteById(id);
        return "Deleted Successfully";
    }
    
    public Double calculateTotalExpense(Long cropId) {

        return expenseRepo.findByCropId(cropId)
                .stream()
                .map(Expense::getAmount)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .sum();
    }
    
    public Double calculateProfit(Long cropId) {

        Double totalExpense = calculateTotalExpense(cropId);

        Double totalSales = orderRepo.findByProductCropId(cropId)
                .stream()
                .mapToDouble(o -> o.getQuantity() * o.getProduct().getPrice())
                .sum();

        return (totalSales != null ? totalSales : 0.0)
             - (totalExpense != null ? totalExpense : 0.0);
    }
}
