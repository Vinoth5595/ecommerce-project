import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckOutService } from 'src/app/services/check-out.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkOutFormGroup: FormGroup;
  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private luv2shopformservice: Luv2ShopFormService,
    private cartSerice: CartService,
    private checkoutService: CheckOutService,
    private router: Router) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
                                  [Validators.required, 
                                    Validators.minLength(2), 
                                    Luv2ShopValidators.notOnlyWhiteSpace]),

        lastName: new FormControl('',
                                  [Validators.required, 
                                    Validators.minLength(2),
                                    Luv2ShopValidators.notOnlyWhiteSpace]),

        email: new FormControl('',
                                [Validators.required, 
                                  Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
                                [Validators.required, 
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhiteSpace]),

        city: new FormControl('',
                                [Validators.required, 
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhiteSpace]),

        state: new FormControl('', [Validators.required]),

        country: new FormControl('', [Validators.required]),

        zipCode: new FormControl('',
                                  [Validators.required, 
                                    Validators.minLength(2),
                                    Luv2ShopValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
                                [Validators.required, 
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhiteSpace]),

        city: new FormControl('',
                                [Validators.required, 
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhiteSpace]),

        state: new FormControl('', [Validators.required]),

        country: new FormControl('', [Validators.required]),

        zipCode: new FormControl('',
                                  [Validators.required, 
                                    Validators.minLength(2),
                                    Luv2ShopValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('',
                                    [Validators.required, 
                                      Validators.minLength(2),
                                      Luv2ShopValidators.notOnlyWhiteSpace]),

        cardNumber: new FormControl('',
                                    [Validators.required, 
                                      Validators.pattern('[0-9]{16}')]),

        securityCode: new FormControl('',
                                      [Validators.required, 
                                        Validators.pattern('[0-9]{3}')]),

        expirationMonth: [''],
        expirationYear: ['']
      }),
    });

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log('Start Month = ' + startMonth);

    this.luv2shopformservice.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );

    // populate credit card years
    this.luv2shopformservice.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    );

    // populate countries
    this.luv2shopformservice.getCountries().subscribe(
      data => this.countries = data
    );


  }

  reviewCartDetails() {
    //subscribe to cartService.totalQuantity
    this.cartSerice.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    //subscribe to cartService.totalprice
    this.cartSerice.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName(){ return this.checkOutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkOutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkOutFormGroup.get('customer.email'); }

  get shippingAddressStreet() {return this.checkOutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity() {return this.checkOutFormGroup.get('shippingAddress.city');}
  get shippingAddressState() {return this.checkOutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipCode() {return this.checkOutFormGroup.get('shippingAddress.zipCode');}
  get shippingAddressCountry() {return this.checkOutFormGroup.get('shippingAddress.country');}

  get billingAddressStreet() {return this.checkOutFormGroup.get('billingAddress.street');}
  get billingAddressCity() {return this.checkOutFormGroup.get('billingAddress.city');}
  get billingAddressState() {return this.checkOutFormGroup.get('billingAddress.state');}
  get billingAddressZipCode() {return this.checkOutFormGroup.get('billingAddress.zipCode');}
  get billingAddressCountry() {return this.checkOutFormGroup.get('billingAddress.country');}

  get creditCardType() {return this.checkOutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard() {return this.checkOutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber() {return this.checkOutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode() {return this.checkOutFormGroup.get('creditCard.securityCode');}
  

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkOutFormGroup.controls.billingAddress
        .setValue(this.checkOutFormGroup.controls.shippingAddress.value);

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkOutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  onSubmit(): void {
    console.log(`Handling the Submit Button`);

    if(this.checkOutFormGroup.invalid){
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }

    // setup order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartSerice.cartItems;

    // create orderItesm from cartItems
    let orderItems: OrderItem[] = cartItems.map(temp => new OrderItem(temp));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkOutFormGroup.get('customer').value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkOutFormGroup.get('shippingAddress').value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkOutFormGroup.get('billingAddress').value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order tracking number ${response.orderTrackingNumber}`);
        
          //reset cart
          this.resetCart();
        },
        error: err =>{
          alert(`Error : ${err.message}`);
        }
      }
    );
  }

  resetCart() {
    // reset cart data
    this.cartSerice.cartItems = [];
    this.cartSerice.totalPrice.next(0);
    this.cartSerice.totalQuantity.next(0);

    // reset the form
    this.checkOutFormGroup.reset();

    // navigate back to product
    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkOutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2shopformservice.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );
  }
  
  getStates(formGroupName: string){
    const formGroup = this.checkOutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} Country Code : ${countryCode}, country name : ${countryName}`);

    this.luv2shopformservice.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }

        formGroup.get('state').setValue(data[0]);
      }
    );


  }
}
