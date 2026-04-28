package symbiosisProject.AgriTrack.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import symbiosisProject.AgriTrack.entity.Farmer;
import symbiosisProject.AgriTrack.repository.FarmerRepository;

@Service
public class FarmerService {

	@Autowired
	public FarmerRepository repo;
	
	
	
	public String loginFarmer(String name, String email , String password)
	{
		Farmer f = repo.getByName(name).orElse(null);
		
		if(f!=null)
		{
			if(f.getEmail().equals(email) && f.getPassword().equals(password))
			{
				return "successfull login";
			}
			
			else
			{
				return "email or password wrong";
			}
		}
		else
		{
			return "username invalid";
		}
	}
	public Farmer signUpFarmer(Farmer f)
	{
		return repo.save(f);
	}
	
	public List<Farmer> getAllFarmer()
	{
		return repo.findAll();
	}
	
	public Farmer getById(long id)
	{
		return repo.findById(id).orElse(null);
	}
   
	public Farmer getByName(String name)
	{
		return repo.getByName(name).orElse(null);
	}
	
	public Farmer changePassword(String oldPassword,Long id)
	{
		Farmer f = repo.findById(id).orElse(null);
		if(f != null)
		{
			String password = f.getPassword();
			if(password.equals(oldPassword))
			{
				f.setPassword(password);
				return repo.save(f);
			}
			else
			{
				return null;
			}
		}
		else
		{
			return null;
		}
		
	
	}
	
	public String delteById(Long id)
	{
	     repo.deleteById(id);
	     return "deleted";
	}
}
