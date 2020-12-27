package com.vinoth.ecommerce.service;

import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vinoth.ecommerce.dao.CustomerRepository;
import com.vinoth.ecommerce.dto.Purchase;
import com.vinoth.ecommerce.dto.PurchaseResponse;
import com.vinoth.ecommerce.entity.Customer;
import com.vinoth.ecommerce.entity.Order;
import com.vinoth.ecommerce.entity.OrderItem;

@Service
public class CheckoutServiceImpl implements CheckoutService{

	@Autowired
	private CustomerRepository customerRepository;
	
	@Override
	@Transactional
	public PurchaseResponse placeOrder(Purchase purchase) {

		// retrieve order info from dto
		Order order = purchase.getOrder();
		
		// generate tracking number
		String orderTrackingNumber = generateOrderTrackingNumber();
		order.setOrderTrackingNumber(orderTrackingNumber);
		
		// populate order with orderItems
		Set<OrderItem> orderItems = purchase.getOrderItems();
		orderItems.forEach(item -> order.add(item));
		
		// populate order with billingAddress and shippingAddress
		order.setBillingAddress(purchase.getBillingAddress());
		order.setShippingAddress(purchase.getShippingAddress());
		
		// populate customer with order
		Customer customer = purchase.getCustomer();
		customer.add(order);
		
		//save to the data base
		customerRepository.save(customer);
		
		//return a response
		return new PurchaseResponse(orderTrackingNumber);
	}

	private String generateOrderTrackingNumber() {
		// generate random UUID
		return UUID.randomUUID().toString();
	}

}
