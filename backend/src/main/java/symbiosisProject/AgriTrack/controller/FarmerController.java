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

import symbiosisProject.AgriTrack.entity.Farmer;
import symbiosisProject.AgriTrack.service.FarmerService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/farmers")
public class FarmerController {

	@Autowired
	public FarmerService service;

    
    @PostMapping("/signup")
    public Farmer signUpFarmer(@RequestBody Farmer f) {
        return service.signUpFarmer(f);
    }

   
    @PostMapping("/login")
    public Farmer login(@RequestBody Farmer f) {
        return service.loginFarmer(f.getEmail(), f.getPassword());
    }


    @GetMapping
    public List<Farmer> getAllFarmer() {
        return service.getAllFarmer();
    }

   
    @GetMapping("/{id}")
    public Farmer getById(@PathVariable Long id) {
        return service.getById(id);
    }

    
    @PutMapping("/{id}/password")
    public Farmer changePassword(@PathVariable Long id,
                                 @RequestParam String newPassword) {
        return service.changePassword(id, newPassword);
    }

    
    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable Long id) {
        return service.deleteById(id);
    }
}
