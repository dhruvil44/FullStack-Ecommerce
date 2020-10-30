import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list.component.html'
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products:Product[]=[];

  currentCateogoryId:number=1;
  previousCategoryId: number;

  searchMode:boolean=false;

  //new properties for pagination
  thePageNumber: number=1;
  thePageSize: number=5;
  theTotalElements: number=0;

  previousKeyword: string=null;
  



  constructor(private productService:ProductService,
              private route:ActivatedRoute,
              private cartService:CartService) { }

  ngOnInit(): void {

    // this.listProducts();
    this.route.paramMap.subscribe(() => {
    this.listProducts();
    });

    
  }

  listProducts()
  {

    this.searchMode=this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode)
    {
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
   
    
  }

  handleSearchProducts()
  {
    const theKeyword = this.route.snapshot.paramMap.get('keyword');

    //if we have different keyword than previous
    //then set the pageNumber=1
    if(this.previousKeyword!=theKeyword)
    {
      this.thePageNumber=1;
    }

    this.previousKeyword=theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    //now search for the products using theKeyword
    this.productService.searchProducts(theKeyword).subscribe(
      data=>{this.products=data;}
    )

    this.productService.searchProductsPaginate(this.thePageNumber-1,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult());
  }

  handleListProducts()
  {
    // //check if the category id parameter is available or not
    const hasCategoryId:Boolean=this.route.snapshot.paramMap.has('id');

     if(hasCategoryId)
     {
     
      //read the categoryId...and convert it to a number using the "+" symbol
      this.currentCateogoryId=+this.route.snapshot.paramMap.get('id');
     }

    else{
       //no category id available....default category id=1
      this.currentCateogoryId=1;

     }


     //check if we have a different category id than previous one
     //Note:- Angular will reuse a component if it is currently being viewed

     //if we have different category id than previous
     //then set the pageNumber back to 1
     if(this.previousCategoryId!=this.currentCateogoryId)
     {
       this.thePageNumber=1;
     }


     this.previousCategoryId=this.currentCateogoryId;
     console.log(`currentcategory Id=${this.currentCateogoryId}, pageNumber=${this.thePageNumber}`);


    //now get the products for this given category id

    this.productService.getProductListPaginate(this.thePageNumber-1,
                                               this.thePageSize,
                                               this.currentCateogoryId)
                                               .subscribe(this.processResult());
  }

  processResult()
  {
    return data=>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number+1;
      this.thePageSize=data.page.size;
      this.theTotalElements=data.page.totalElements;

    }
  }

  updatePageSize(pageSize:number)
  {
    this.thePageSize=pageSize;
    this.thePageNumber=1;
    this.listProducts();
  }

  addToCart(theProduct:Product)
  {
    console.log("Adding to the cart "+ theProduct.name + theProduct.unitPrice);

    //TODO some real work
    const tempCartItem = new CartItem(theProduct);

    this.cartService.addToCart(tempCartItem);
  }
  
}
