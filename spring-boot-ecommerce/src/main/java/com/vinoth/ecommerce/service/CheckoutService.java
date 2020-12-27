package com.vinoth.ecommerce.service;

import com.vinoth.ecommerce.dto.Purchase;
import com.vinoth.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

	PurchaseResponse placeOrder(Purchase purchase);
}
