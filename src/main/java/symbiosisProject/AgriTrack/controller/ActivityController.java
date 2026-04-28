package symbiosisProject.AgriTrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import symbiosisProject.AgriTrack.entity.Activity;
import symbiosisProject.AgriTrack.service.ActivityService;

@RestController
@RequestMapping("/activity")
public class ActivityController {

	@Autowired
	public ActivityService service;
	
	@PostMapping("/addActivity/{id}")
	public Activity addActivity(@RequestBody Activity a,@PathVariable Long id)
	{
		return service.addActivity(a,id);
	}
	
	@GetMapping
	public List<Activity> getAllActivities()
	{
		return service.getAllActivities();
	}
	
	@GetMapping("/id/{id}")
	public Activity getById(@PathVariable Long id)
	{
		return service.getById(id);
	}
	
	@GetMapping("/type/{type}")
	public Activity getByType(@PathVariable String type)
	{
		return service.getByType(type);
	}
	

	
	@DeleteMapping("/{id}")
	public String deleteById(@PathVariable Long id)
	{
		return service.delteById(id);
	}
}
