import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 

  cartItems:CartItem[]=[];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();



  constructor() { }

  addToCart(theCartitem:CartItem)
  {
    //check if we already have the item in the CART
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem=undefined;

    if(this.cartItems.length>0)
    {
      //find the item in the cart based on item id
      existingCartItem=this.cartItems.find(tempCartItem => tempCartItem.id==theCartitem.id);

      //check if we found it
      alreadyExistsInCart = (existingCartItem!=undefined);      


    }

    if(alreadyExistsInCart)
    {
      existingCartItem.quantity++;

    }

    else{
      this.cartItems.push(theCartitem);
    }

    //compute the cart totals and quantity
    this.computeCartTotals();
    
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if(theCartItem.quantity==0)
    {
      this.remove(theCartItem);
    }

    else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem){
    //get index of item in the array
    const index = this.cartItems.findIndex(tempCartItem=> tempCartItem.id==theCartItem.id);

    //if found....remove it from the array
    if(index>-1)
    {
      this.cartItems.splice(index,1);
      this.computeCartTotals();
    }

  }
  
  computeCartTotals() {
    let totalPriceValue: number=0;
    let totalQuantityValue: number=0;

    for(let currentCartItem of this.cartItems)
    {
      totalPriceValue+= currentCartItem.quantity*currentCartItem.unitPrice;
      totalQuantityValue+= currentCartItem.quantity;
    }

    //publish the new values....all subscribers will recieve the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    

    //log the cart data for debugging
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("Contents of the cart");
    for(let tempCartItem of this.cartItems)
    {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, subTotalPrice: ${subTotalPrice}`);

    }


  }

 
}
