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
    private ExpenseRepository repo;

    @Autowired
    private CropRepository crepo;

   
    public Expense addExpense(Expense e, Long cropId) {

        Crop c = crepo.findById(cropId)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        e.setCrop(c);

        return repo.save(e);
    }

   
    public List<Expense> getExpensesByCrop(Long cropId) {
        return repo.findByCropId(cropId);
    }

    public List<Expense> getAllExpenses() {
        return repo.findAll();
    }

    public Expense getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
    }

    public String deleteById(Long id) {
        repo.deleteById(id);
        return "Deleted Successfully";
    }
}