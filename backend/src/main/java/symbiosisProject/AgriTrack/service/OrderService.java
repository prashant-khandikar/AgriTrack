package symbiosisProject.AgriTrack.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import symbiosisProject.AgriTrack.entity.Buyer;
import symbiosisProject.AgriTrack.entity.Order;
import symbiosisProject.AgriTrack.entity.Product;
import symbiosisProject.AgriTrack.repository.BuyerRepository;
import symbiosisProject.AgriTrack.repository.OrderRepository;
import symbiosisProject.AgriTrack.repository.ProductRepository;
@Service
public class OrderService {

    @Autowired
    private OrderRepository repo;

    @Autowired
    private ProductRepository prepo;

    @Autowired
    private BuyerRepository brepo;

 
    public Order placeOrder(Order o, Long buyerId, Long productId) {

        Product p = prepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Buyer b = brepo.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

       
        if (p.getQuantity() < o.getQuantity()) {
            throw new RuntimeException("Not enough stock");
        }

     
        p.setQuantity(p.getQuantity() - o.getQuantity());
        prepo.save(p);

        o.setBuyer(b);
        o.setProduct(p);
        o.setStatus("PENDING");

        return repo.save(o);
    }

    public List<Order> getAllOrders() {
        return repo.findAll();
    }

  
    public List<Order> getOrdersByBuyer(Long buyerId) {
        return repo.findByBuyerId(buyerId);
    }

    
    public List<Order> getOrdersByFarmer(Long farmerId) {
        return repo.findByProductCropFarmerId(farmerId);
    }

    
    public Order updateStatus(Long orderId, String status) {

        Order o = repo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        o.setStatus(status);

        return repo.save(o);
    }
}