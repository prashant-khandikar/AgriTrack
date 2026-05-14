package symbiosisProject.AgriTrack.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import symbiosisProject.AgriTrack.entity.Buyer;
import symbiosisProject.AgriTrack.repository.BuyerRepository;
@Service
public class BuyerService {

    @Autowired
    private BuyerRepository repo;
    @Autowired
	private PasswordEncoder passwordEncoder;

    public Buyer loginBuyer(String email, String password) {

        Buyer b = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!passwordEncoder.matches(password, b.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        return b;
    }

  
    public Buyer signUpBuyer(Buyer b) {

        b.setPassword(passwordEncoder.encode(b.getPassword()));

        return repo.save(b);
    }
    public List<Buyer> getAllBuyer() {
        return repo.findAll();
    }

    public Buyer getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
    }

   
    public Buyer changePassword(Long id, String newPassword) {

        Buyer b = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        b.setPassword(newPassword);

        return repo.save(b);
    }

    public String deleteById(Long id) {
        repo.deleteById(id);
        return "Deleted Successfully";
    }
}