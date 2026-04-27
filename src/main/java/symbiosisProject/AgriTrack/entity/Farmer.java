package symbiosisProject.AgriTrack.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.UniqueConstraint;

@Entity
public class Farmer {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private long id;
 private String	name ;
 private String	email;
 private String password ;
 private String	contact ;
 private String village ;
 private String district ;
 private String	state ;
 private double	farmSize ;
 private String soilType ;
 private String role ;
	
  @OneToMany(mappedBy = "farmer" , cascade = CascadeType.ALL)
  @JsonManagedReference
  private List<Crop> crops;
}
