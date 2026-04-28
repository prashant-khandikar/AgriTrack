package symbiosisProject.AgriTrack.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import symbiosisProject.AgriTrack.entity.Crop;
import symbiosisProject.AgriTrack.entity.Expense;
import symbiosisProject.AgriTrack.repository.CropRepository;
import symbiosisProject.AgriTrack.repository.ExpenseRepository;

@Service
public class ExpenseService {

	@Autowired
	public ExpenseRepository repo;
	
	@Autowired
	public CropRepository crepo;
	
	public Expense addExpense(Expense e,Long id)
	{
		Crop c = crepo.findById(id).orElse(null);
		
			e.setCrop(c);
		
		return repo.save(e);
	}
	
	public List<Expense> getAllExpenses()
	{
		return repo.findAll();
	}
	
	public Expense getById(Long id)
	{
		return repo.findById(id).orElse(null);
	}
   
	public Expense getByType(String type)
	{
		return repo.getByType(type).orElse(null);
	}
	

	public String delteById(Long id)
	{
	     repo.deleteById(id);
	     return "deleted";
	}
}
