import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number=0.00;
  totalQuantity: number=0;

  creditCardYears: number[]=[];
  creditCardMonths: number[]=[];

  countries: Country[]=[];

  shippingAddressStates: State[]=[];
  billingAddressStates: State[]=[];
  

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('Dhruvil',[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('',[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]),
        email: new FormControl('',[Validators.required,
                                  Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(6), Luv2ShopValidators.notOnlyWhiteSpace])
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(6), Luv2ShopValidators.notOnlyWhiteSpace])
      }),


      creditCard: this.formBuilder.group({
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',[Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('',[Validators.pattern('[0-9]{16}'), Validators.required]),
        securityCode: new FormControl('',[Validators.pattern('[0-9]{3}'), Validators.required]),
        expirationMonth: [''],
        expirationYear: ['']
      }),

    });

    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data=>{this.creditCardMonths=data;}
    )

    //populate credit card years
      this.luv2ShopFormService.getCreditCardYears().subscribe(
        data=>{this.creditCardYears=data;}
      )

      //populate the countries
      this.luv2ShopFormService.getCountries().subscribe(
        data=>{this.countries=data;}
      )

      //subscribe to the cartservice.totalprice data
      this.cartService.totalPrice.subscribe(
        data=>{this.totalPrice=data;}
      )

      //subscribe to the cartservice.totalquantity data
      this.cartService.totalQuantity.subscribe(
        data=>{this.totalQuantity=data;}
      )

      //calling cart service total
      this.cartService.computeCartTotals();
  }


  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
  
  get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressZipCode(){return this.checkoutFormGroup.get('billingAddress.zipCode');}
  get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country');}

  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');}


  onSubmit()
  {
    console.log(`Handling Submit BUtton...`);

    if(this.checkoutFormGroup.invalid)
    {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    // console.log(this.checkoutFormGroup.get('customer').value);
    // console.log(this.checkoutFormGroup.get('customer').value.email);

    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;


    //get cart items
    const cartItems = this.cartService.cartItems;


    //create orderItems from cartItems
    let orderItems: OrderItem[]=[];
    for(let i=0;i<cartItems.length;i++)
    {
      orderItems[i]=new OrderItem(cartItems[i]);
    }


    //set up purchase
    let purchase = new Purchase();

    //populate purchase -- customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase -- shippingAddress
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase -- billingAddress
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //populate purchase -- order and orderitems
    purchase.order = order;
    purchase.orderItems = orderItems;

    //call the REST API via CHECKOUT SERVICE
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response=>{
          alert(`Your order has been recieved.\n Order Tracking number: ${response.orderTrackingNumber}`);

          //reset cart
          this.resetCart();
        },

        error: err=>{
          alert(`There was an error: ${err.message}`);
        }
      }
    );
  }



  resetCart() {

    //reset the cart data
    this.cartService.cartItems=[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form data
    this.checkoutFormGroup.reset();

    //navigate back to the products page
    this.router.navigateByUrl("/products");
  }


  copyShippingAddressToBillingAddress(event)
  {
    if(event.target.checked)
    {
      this.checkoutFormGroup.controls.billingAddress.
          setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      //handle bug for states
       this.billingAddressStates = this.shippingAddressStates;
      
      
    }

    else{
      this.checkoutFormGroup.controls.billingAddress.reset();

      //bug fix for states
      this.billingAddressStates=[];
    }
  }

  handleMonthsAndYears()
  {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const seletedYear: number = Number(creditCardFormGroup.value.expirationYear);

    //check if the selected year equals the current year, then start with cuurent month
    let startMonth: number;

    if(currentYear == seletedYear)
    {
      startMonth = new Date().getMonth()+1;
    }

    else{
      startMonth=1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data=>{this.creditCardMonths=data;}
    )
  }


  getStates(formGroupName: string)
  {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data=>{

        if(formGroupName == 'shippingAddress')
        {
          this.shippingAddressStates=data;
        }

        else{
          this.billingAddressStates=data;
        }

        //select first item for default
        formGroup.get('state').setValue(data[0]);

      }
    )
  }


}
