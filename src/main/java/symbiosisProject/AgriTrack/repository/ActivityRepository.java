package symbiosisProject.AgriTrack.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import symbiosisProject.AgriTrack.entity.Activity;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

	Optional<Activity> getByType(String type);

}
