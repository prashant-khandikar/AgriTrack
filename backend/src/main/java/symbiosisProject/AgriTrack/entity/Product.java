package symbiosisProject.AgriTrack.entity;


import jakarta.persistence.*;
import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double price;
    private Double quantity;
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDate postedDate;

    @ManyToOne
    @JoinColumn(name = "crop_id")
    private Crop crop;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Double getQuantity() {
		return quantity;
	}

	public void setQuantity(Double quantity) {
		this.quantity = quantity;
	}

	public LocalDate getPostedDate() {
		return postedDate;
	}

	public void setPostedDate(LocalDate postedDate) {
		this.postedDate = postedDate;
	}

	public Crop getCrop() {
		return crop;
	}

	public void setCrop(Crop crop) {
		this.crop = crop;
	}

   
}
