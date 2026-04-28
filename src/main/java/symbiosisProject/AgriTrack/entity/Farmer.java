package symbiosisProject.AgriTrack.entity;

import java.util.List;


import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Farmer {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;
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

  public String getEmail() {
	return email;
  }

  public void setEmail(String email) {
	this.email = email;
  }

  public String getPassword() {
	return password;
  }

  public void setPassword(String password) {
	this.password = password;
  }

  public String getContact() {
	return contact;
  }

  public void setContact(String contact) {
	this.contact = contact;
  }

  public String getVillage() {
	return village;
  }

  public void setVillage(String village) {
	this.village = village;
  }

  public String getDistrict() {
	return district;
  }

  public void setDistrict(String district) {
	this.district = district;
  }

  public String getState() {
	return state;
  }

  public void setState(String state) {
	this.state = state;
  }

  public double getFarmSize() {
	return farmSize;
  }

  public void setFarmSize(double farmSize) {
	this.farmSize = farmSize;
  }

  public String getSoilType() {
	return soilType;
  }

  public void setSoilType(String soilType) {
	this.soilType = soilType;
  }

  public String getRole() {
	return role;
  }

  public void setRole(String role) {
	this.role = role;
  }

  public List<Crop> getCrops() {
	return crops;
  }

  public void setCrops(List<Crop> crops) {
	this.crops = crops;
  }
  
  
}
