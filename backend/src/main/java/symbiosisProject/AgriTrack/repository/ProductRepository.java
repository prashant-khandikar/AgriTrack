package symbiosisProject.AgriTrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import symbiosisProject.AgriTrack.entity.Product;
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{

	List<Product> findByCropId(Long id);

    List<Product> findByCropFarmerId(Long id);
	
}
