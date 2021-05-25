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

  //This is browser session storage
  // storage: Storage = sessionStorage;

  //This is browser local storage
  storage: Storage = localStorage;

  constructor() { 
    //getting the data from browser storage as JSON object
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if(data!=null)
    {
      this.cartItems = data;
      this.computeCartTotals();
    }

  }

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

    //persist the data in the browser storage
    this.persistCartItems();
  }

  persistCartItems() {
    //saving the cartItems as key(cartItems) - value(this.cartItems) pairs
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems));
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
