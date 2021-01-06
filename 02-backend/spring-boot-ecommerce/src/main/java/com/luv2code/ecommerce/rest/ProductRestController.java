package com.luv2code.ecommerce.rest;

import com.luv2code.ecommerce.dao.ProductCategoryRepository;
import com.luv2code.ecommerce.dao.ProductRepository;
import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
//@RequestMapping("/api")
public class ProductRestController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository categoryRepository;
//
//    @GetMapping("/findProducts")
//    public List<Product> findProducts(@RequestParam("id") Long id, @RequestParam("name") String name)
//    {
//        System.out.println(productRepository.findByCategory(id,name).size());
//        return productRepository.findByCategory(id,name);
//    }


}
