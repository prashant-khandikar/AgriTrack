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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import symbiosisProject.AgriTrack.entity.Buyer;
import symbiosisProject.AgriTrack.service.BuyerService;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/buyers")
public class BuyerController {

    @Autowired
    private BuyerService service;

   
    @PostMapping("/signup")
    public Buyer signUpBuyer(@RequestBody Buyer b) {
        return service.signUpBuyer(b);
    }

    
    @PostMapping("/login")
    public Buyer login(@RequestBody Buyer b) {
        return service.loginBuyer(b.getEmail(), b.getPassword());
    }

  
    @GetMapping
    public List<Buyer> getAllBuyers() {
        return service.getAllBuyer();
    }

    
    @GetMapping("/{id}")
    public Buyer getById(@PathVariable Long id) {
        return service.getById(id);
    }

   
    @PutMapping("/{id}/password")
    public Buyer changePassword(@PathVariable Long id,
                                @RequestParam String newPassword) {
        return service.changePassword(id, newPassword);
    }

  
    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable Long id) {
        return service.deleteById(id);
    }
}