package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

// @CrossOrigin Now no need to add Cross origin because the Cors Mapping is added in the MyDataRestConfig class for all repositories
@RepositoryRestResource
public interface StateRepository  extends JpaRepository<State,Integer> {

    List<State> findByCountryCode(@RequestParam("code") String code);
}
