package symbiosisProject.AgriTrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import symbiosisProject.AgriTrack.entity.Expense;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
	 List<Expense> findByCropId(Long cropId); 

}