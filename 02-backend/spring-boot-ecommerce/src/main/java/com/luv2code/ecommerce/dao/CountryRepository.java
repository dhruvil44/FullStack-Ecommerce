package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

//@CrossOrigin Now no need to add Cross origin because the Cors Mapping is added in the MyDataRestConfig class for all repositories
@RepositoryRestResource(collectionResourceRel="countries",path="countries")
public interface CountryRepository extends JpaRepository<Country,Integer> {
}
