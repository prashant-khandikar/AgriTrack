package symbiosisProject.AgriTrack.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import symbiosisProject.AgriTrack.entity.Farmer;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, Long> {

	Optional<Farmer> getByName(String name);

}
