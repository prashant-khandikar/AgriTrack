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

import symbiosisProject.AgriTrack.entity.Activity;
import symbiosisProject.AgriTrack.service.ActivityService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/activity")
public class ActivityController {

	@Autowired
	public ActivityService service;
	
	 
    @PostMapping("/{cropId}")
    public Activity addActivity(@RequestBody Activity a, @PathVariable Long cropId) {
        return service.addActivity(a, cropId);
    }

    
    @GetMapping("/crop/{cropId}")
    public List<Activity> getActivitiesByCrop(@PathVariable Long cropId) {
        return service.getActivitiesByCrop(cropId);
    }

    @GetMapping
    public List<Activity> getAllActivities() {
        return service.getAllActivities();
    }

  
    @GetMapping("/{id}")
    public Activity getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable Long id) {
        return service.deleteById(id);
    }
}
