package symbiosisProject.AgriTrack.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import symbiosisProject.AgriTrack.entity.Crop;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {

	Optional<Crop> getByName(String name);

}
