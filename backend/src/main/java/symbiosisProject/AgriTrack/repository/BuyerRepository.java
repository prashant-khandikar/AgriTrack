package symbiosisProject.AgriTrack.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import symbiosisProject.AgriTrack.entity.Buyer;

@Repository
public interface BuyerRepository extends JpaRepository<Buyer, Long> {


    Optional<Buyer> findByEmail(String email);

    Optional<Buyer> findByName(String name);

	

}
