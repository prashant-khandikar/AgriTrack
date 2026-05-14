package symbiosisProject.AgriTrack.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import symbiosisProject.AgriTrack.entity.Crop;
import symbiosisProject.AgriTrack.entity.Product;
import symbiosisProject.AgriTrack.repository.CropRepository;
import symbiosisProject.AgriTrack.repository.ProductRepository;
@Service
public class ProductService {

    @Autowired
    private ProductRepository repo;

    @Autowired
    private CropRepository crepo;

    
    public Product addProduct(Product p, Long cropId) {

        Crop c = crepo.findById(cropId)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        p.setCrop(c);

        return repo.save(p);
    }

    public List<Product> getAllProduct() {
        return repo.findAll();
    }

   
    public List<Product> getProductsByFarmer(Long farmerId) {
        return repo.findByCropFarmerId(farmerId);
    }

   
    public List<Product> getProductsByCrop(Long cropId) {
        return repo.findByCropId(cropId);
    }

    public String deleteProduct(Long id) {
        repo.deleteById(id);
        return "Deleted Successfully";
    }
}