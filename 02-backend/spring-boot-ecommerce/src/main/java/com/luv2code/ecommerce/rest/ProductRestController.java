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
    private ProductRepository prepo;

    @Autowired
    private ProductCategoryRepository categoryRepository;


    @GetMapping("/findByCategory")
    public List<Product> findByCat(@RequestParam("ids") Long id)
    {
        List<Product> products = prepo.findByCategory(id);

        return products;
    }

    @GetMapping("/ids")
    public List<Integer> getIds()
    {
        List<Integer> ids = prepo.getAllIds();

        return ids;
    }


}
