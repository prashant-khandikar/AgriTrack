package symbiosisProject.AgriTrack.repository;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import symbiosisProject.AgriTrack.entity.Crop;


@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {

	List<Crop> findAllByName(String name);

	

	

}
