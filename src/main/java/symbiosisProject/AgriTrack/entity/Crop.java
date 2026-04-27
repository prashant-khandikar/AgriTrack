package symbiosisProject.AgriTrack.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Crop {
 
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	private String name;
    private String season;
    private String status; // SOWN, GROWING, HARVESTED

    private LocalDate sowingDate;
    private LocalDate harvestDate;
    
    //many crop -> one farmer
    @ManyToOne
    @JoinColumn(name="farmer_id")
    @JsonBackReference
    private Farmer farmer;
    
    //one crop -> many activities
    @OneToMany(mappedBy = "crop" , cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Activity> activities;
    
    //one crop-> many expenses
    @OneToMany(mappedBy = "crop" , cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Expense> expenses;
    
}
