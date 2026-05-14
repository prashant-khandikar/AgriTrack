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
import symbiosisProject.AgriTrack.entity.Expense;
import symbiosisProject.AgriTrack.service.ExpenseService;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService service;

 
    @PostMapping("/{cropId}")
    public Expense addExpense(@RequestBody Expense e, @PathVariable Long cropId) {
        return service.addExpense(e, cropId);
    }

   
    @GetMapping("/crop/{cropId}")
    public List<Expense> getExpensesByCrop(@PathVariable Long cropId) {
        return service.getExpensesByCrop(cropId);
    }


    @GetMapping
    public List<Expense> getAllExpenses() {
        return service.getAllExpenses();
    }


    @GetMapping("/{id}")
    public Expense getById(@PathVariable Long id) {
        return service.getById(id);
    }

   
    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable Long id) {
        return service.deleteById(id);
    }
}