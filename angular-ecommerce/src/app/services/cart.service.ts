import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem: CartItem){
    // Check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if(this.cartItems.length > 0){
      // for(let tempCartItem of this.cartItems){
      //   if(tempCartItem.id === theCartItem.id){
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }
      existingCartItem = this.cartItems.find(temp => temp.id === theCartItem.id);

      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart){
      existingCartItem.quantity++;
    }else{
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }


  computeCartTotals() {
    let totalpriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentItem of this.cartItems){
      totalpriceValue += currentItem.quantity * currentItem.unitPrice;
      totalQuantityValue += currentItem.quantity;
    }

    this.totalPrice.next(totalpriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalpriceValue, totalQuantityValue);
  }
  logCartData(totalpriceValue: number, totalQuantityValue: number) {
    console.log(`Content of Cart`);
    for(let tempCartItem of this.cartItems){
      let subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name= ${tempCartItem.name}, quantity=${tempCartItem.quantity},unitPrice=${tempCartItem.unitPrice},subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice=${totalpriceValue.toFixed(2)}, totalQuantity=${totalQuantityValue}`);
    console.log(`------`);
  }

  decrementQuantity(cartItem: CartItem){
    cartItem.quantity--;
    
    if(cartItem.quantity == 0){
      this.remove(cartItem);
    }else{
      this.computeCartTotals();
    }

  }

  remove(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(
      tempCartItem => tempCartItem.id == cartItem.id
    );

    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }
}
