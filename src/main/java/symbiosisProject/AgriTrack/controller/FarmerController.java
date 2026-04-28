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

import symbiosisProject.AgriTrack.entity.Farmer;
import symbiosisProject.AgriTrack.service.FarmerService;

@RestController
@RequestMapping("/farmer")
public class FarmerController {

	@Autowired
	public FarmerService service;
	
	@PostMapping("/{userName}/{email}/{password}")
	public String loginFarmer(@PathVariable String userName,@PathVariable String email , @PathVariable String password)
	{
		return service.loginFarmer(userName, email, password);
	}
	
	
	@PostMapping("/signUpFarmer")
	public Farmer signUpFarmer(@RequestBody Farmer f)
	{
		return service.signUpFarmer(f);
	}
	
	@GetMapping
	public List<Farmer> getAllFarmer()
	{
		return service.getAllFarmer();
	}
	
	@GetMapping("/id/{id}")
	public Farmer getById(@PathVariable Long id)
	{
		return service.getById(id);
	}
	
	@GetMapping("/name/{name}")
	public Farmer getByName(@PathVariable String name)
	{
		return service.getByName(name);
	}
	
	@PostMapping("/{password}/{id}")
	public Farmer changePassword(@PathVariable String password ,@PathVariable Long id)
	{
		return service.changePassword(password, id);
	}
	
	@DeleteMapping("/{id}")
	public String deleteById(@PathVariable Long id)
	{
		return service.delteById(id);
	}
}
