package symbiosisProject.AgriTrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import symbiosisProject.AgriTrack.entity.Order;
import symbiosisProject.AgriTrack.service.OrderService;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService service;

   
    @PostMapping("/{buyerId}/{productId}")
    public Order placeOrder(@RequestBody Order o,
                            @PathVariable Long buyerId,
                            @PathVariable Long productId) {

        return service.placeOrder(o, buyerId, productId);
    }


    @GetMapping
    public List<Order> getAllOrders() {
        return service.getAllOrders();
    }

    
    @GetMapping("/buyer/{buyerId}")
    public List<Order> getOrdersByBuyer(@PathVariable Long buyerId) {
        return service.getOrdersByBuyer(buyerId);
    }

  
    @GetMapping("/farmer/{farmerId}")
    public List<Order> getOrdersByFarmer(@PathVariable Long farmerId) {
        return service.getOrdersByFarmer(farmerId);
    }

    
    @PutMapping("/{orderId}/status")
    public Order updateStatus(@PathVariable Long orderId,
                              @RequestParam String status) {
        return service.updateStatus(orderId, status);
    }
}