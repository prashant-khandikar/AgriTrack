package symbiosisProject.AgriTrack.controller;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import symbiosisProject.AgriTrack.entity.Crop;
import symbiosisProject.AgriTrack.service.CropService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/crops")
public class CropController {

	@Autowired
	public CropService service;
	

    
    @PostMapping("/{farmerId}")
    public Crop addCrop(@RequestBody Crop c, @PathVariable Long farmerId) {
        return service.addCrop(c, farmerId);
    }

 
    @GetMapping("/farmer/{farmerId}")
    public List<Crop> getCropsByFarmer(@PathVariable Long farmerId) {
        return service.getCropsByFarmer(farmerId);
    }

    
    @PutMapping("/{cropId}/harvest")
    public Crop markHarvest(@PathVariable Long cropId,
                            @RequestBody Crop c) {
        return service.markHarvest(cropId, c);
    }

 
    @GetMapping
    public List<Crop> getAllCrop() {
        return service.getAllCrop();
    }

   
    @GetMapping("/{id}")
    public Crop getById(@PathVariable Long id) {
        return service.getById(id);
    }

    
    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable Long id) {
        return service.deleteById(id);
    }
    
    @GetMapping("/{cropId}/profit")
    public Double getProfit(@PathVariable Long cropId) {
        return service.calculateProfit(cropId);
    }
}
