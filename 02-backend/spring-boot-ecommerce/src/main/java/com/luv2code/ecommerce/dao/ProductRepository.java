package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;


@CrossOrigin
public interface ProductRepository extends JpaRepository<Product,Long> {

    @Query("from Product")
    public List<Product> getAllProducts();

    @Query("select id from Product")
    public List<Integer> getAllIds();


    @Query("from Product p where p.category.id=?1")
    public List<Product> findByCategory(@RequestParam("ids") Long id);

    Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);

    Page<Product> findByNameContaining(@RequestParam("name") String name,Pageable pageable);
}
