package symbiosisProject.AgriTrack.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import symbiosisProject.AgriTrack.entity.Farmer;
import symbiosisProject.AgriTrack.repository.FarmerRepository;

@Service
public class FarmerService {

	@Autowired
	public FarmerRepository repo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

 
	public Farmer loginFarmer(String email, String password) {

	    Farmer f = repo.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("Invalid email"));

	    if (!passwordEncoder.matches(password, f.getPassword())) {
	        throw new RuntimeException("Wrong password");
	    }

	    return f;
	}


	public Farmer signUpFarmer(Farmer f) {
	    f.setPassword(passwordEncoder.encode(f.getPassword())); // 🔥 MUST
	    return repo.save(f);
	}
	
    public List<Farmer> getAllFarmer() {
        return repo.findAll();
    }

    public Farmer getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
    }

   
    public Farmer changePassword(Long id, String newPassword) {

        Farmer f = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        f.setPassword(newPassword);

        return repo.save(f);
    }

    public String deleteById(Long id) {
        repo.deleteById(id);
        return "Deleted Successfully";
    }
}
