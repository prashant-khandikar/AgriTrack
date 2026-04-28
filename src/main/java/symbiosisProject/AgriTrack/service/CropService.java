package symbiosisProject.AgriTrack.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import symbiosisProject.AgriTrack.entity.Crop;
import symbiosisProject.AgriTrack.entity.Farmer;
import symbiosisProject.AgriTrack.repository.CropRepository;
import symbiosisProject.AgriTrack.repository.FarmerRepository;

@Service
public class CropService {
 
	@Autowired
	public CropRepository repo;
	
	@Autowired
	public FarmerRepository frepo;
	
	public Crop postCrop(Crop c,long id)
	{
		Farmer f = frepo.findById(id).orElse(null);
		
			c.setFarmer(f);
		
		return repo.save(c);
	}
	
	public List<Crop> getAllCrop()
	{
		return repo.findAll();
	}
	
	public Crop getById(long id)
	{
		return repo.findById(id).orElse(null);
	}
   
	public Crop getByName(String name)
	{
		return repo.getByName(name).orElse(null);
	}
	
	public String delteById(long id)
	{
	     repo.deleteById(id);
	     return "deleted";
	}
}
