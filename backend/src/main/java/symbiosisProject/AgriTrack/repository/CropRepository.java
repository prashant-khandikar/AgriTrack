package symbiosisProject.AgriTrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import symbiosisProject.AgriTrack.entity.Crop;
import symbiosisProject.AgriTrack.entity.Farmer;


@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {

	  List<Crop> findByFarmerId(Long farmerId); // 🔥 IMPORTANT

	    List<Crop> findAllByName(String name);

		Optional<Farmer> findByid(Long id);
	

}
