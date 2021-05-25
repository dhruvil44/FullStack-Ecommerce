package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;


// @CrossOrigin Now no need to add Cross origin because the Cors Mapping is added in the MyDataRestConfig class for all repositories
@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product,Long> {

    @Query("from Product p where p.category.id=?1")
    List<Product> ByCategory(@Param("id") Long id);

    List<Product> findByCategoryIdAndNameContaining(@RequestParam("id") Long id,@RequestParam("name")String name);

    Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);

    Page<Product> findByNameContaining(@RequestParam("name") String name,Pageable pageable);
}
