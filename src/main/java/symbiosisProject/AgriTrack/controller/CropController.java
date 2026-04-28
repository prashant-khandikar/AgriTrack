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

import symbiosisProject.AgriTrack.entity.Crop;
import symbiosisProject.AgriTrack.service.CropService;

@RestController
@RequestMapping("/crop")
public class CropController {

	@Autowired
	public CropService service;
	
	@PostMapping("/{id}")
	public Crop postCrop(@RequestBody Crop c,@PathVariable long id)
	{
		return service.postCrop(c,id);
	}
	
	@GetMapping
	public List<Crop> getAllCrop()
	{
		return service.getAllCrop();
	}
	
	@GetMapping("/{id}")
	public Crop getById(@PathVariable long id)
	{
		return service.getById(id);
	}
	
	@GetMapping("/{name}")
	public Crop getByName(@PathVariable String name)
	{
		return service.getByName(name);
	}
	
	
	@DeleteMapping("/{id}")
	public String deleteById(@PathVariable long id)
	{
		return service.delteById(id);
	}
}
