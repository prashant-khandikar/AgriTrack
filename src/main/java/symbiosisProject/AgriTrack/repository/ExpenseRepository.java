package symbiosisProject.AgriTrack.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import symbiosisProject.AgriTrack.entity.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

	Optional<Expense> getByType(String name);

}