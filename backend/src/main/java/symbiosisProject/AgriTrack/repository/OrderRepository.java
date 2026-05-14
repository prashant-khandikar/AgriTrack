package symbiosisProject.AgriTrack.repository;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import symbiosisProject.AgriTrack.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>{

	List<Order> findByBuyerId(Long buyerId);

    List<Order> findByProductCropFarmerId(Long farmerId);

    List<Order> findByProductCropId(Long cropId); 
}
