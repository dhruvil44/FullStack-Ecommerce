import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories:ProductCategory[];

  constructor(private productService:ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(()=>this.listProductCategories());

    // this.listProductCategories();
    
  }


  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data=>{
        
        console.log("Product Categories= "+JSON.stringify(data));
        this.productCategories=data;
        
      }
    );
  }

}
