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
    private CropRepository crepo;

  
    public Activity addActivity(Activity a, Long cropId) {

        Crop c = crepo.findById(cropId)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        a.setCrop(c);

        return repo.save(a);
    }

   
    public List<Activity> getActivitiesByCrop(Long cropId) {
        return repo.findByCropId(cropId);
    }

    public List<Activity> getAllActivities() {
        return repo.findAll();
    }

    public Activity getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
    }

    public String deleteById(Long id) {
        repo.deleteById(id);
        return "Deleted Successfully";
    }
}

