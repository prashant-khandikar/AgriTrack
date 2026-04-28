package symbiosisProject.AgriTrack.service;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import symbiosisProject.AgriTrack.entity.Activity;
import symbiosisProject.AgriTrack.entity.Crop;
import symbiosisProject.AgriTrack.repository.ActivityRepository;
import symbiosisProject.AgriTrack.repository.CropRepository;

@Service
public class ActivityService {

	@Autowired
	public ActivityRepository repo;
	
	@Autowired
	public CropRepository crepo;
	
	public Activity addActivity(Activity a,Long id)
	{
		Crop c = crepo.findById(id).orElse(null);
		
			a.setCrop(c);
		
		return repo.save(a);
	}
	
	public List<Activity> getAllActivities()
	{
		return repo.findAll();
	}
	
	public Activity getById(Long id)
	{
		return repo.findById(id).orElse(null);
	}
   
	public Activity getByType(String type)
	{
		return repo.getByType(type).orElse(null);
	}
	
	
	public String delteById(Long id)
	{
	     repo.deleteById(id);
	     return "deleted";
	}
}

