package symbiosisProject.AgriTrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import symbiosisProject.AgriTrack.entity.Product;
import symbiosisProject.AgriTrack.service.ProductService;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService service;

   
    @PostMapping("/{cropId}")
    public Product addProduct(@RequestBody Product p, @PathVariable Long cropId) {
        return service.addProduct(p, cropId);
    }

   
    @GetMapping
    public List<Product> getAllProduct() {
        return service.getAllProduct();
    }


    @GetMapping("/farmer/{farmerId}")
    public List<Product> getProductsByFarmer(@PathVariable Long farmerId) {
        return service.getProductsByFarmer(farmerId);
    }


    @GetMapping("/crop/{cropId}")
    public List<Product> getProductsByCrop(@PathVariable Long cropId) {
        return service.getProductsByCrop(cropId);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        return service.deleteProduct(id);
    }
}
