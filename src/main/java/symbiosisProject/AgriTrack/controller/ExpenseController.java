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
import symbiosisProject.AgriTrack.entity.Expense;
import symbiosisProject.AgriTrack.service.ExpenseService;

@RestController
@RequestMapping("/expense")
public class ExpenseController {
 
	@Autowired
	public ExpenseService service;
	
	@PostMapping("/addExpense/{id}")
	public Expense addActivity( @RequestBody Expense e, @PathVariable Long id)
	{
		return service.addExpense(e, id);
	}
	
	@GetMapping
	public List<Expense> getAllExpenses()
	{
		return service.getAllExpenses();
	}
	
	@GetMapping("/id/{id}")
	public Expense getById(@PathVariable Long id)
	{
		return service.getById(id);
	}
	
	@GetMapping("/type/{type}")
	public Expense getByName(@PathVariable String type)
	{
		return service.getByType(type);
	}
	

	
	@DeleteMapping("/{id}")
	public String deleteById(@PathVariable Long id)
	{
		return service.delteById(id);
	}
}
