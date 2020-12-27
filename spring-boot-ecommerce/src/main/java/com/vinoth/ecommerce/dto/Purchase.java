package com.vinoth.ecommerce.dto;

import java.util.Set;

import com.vinoth.ecommerce.entity.Address;
import com.vinoth.ecommerce.entity.Customer;
import com.vinoth.ecommerce.entity.Order;
import com.vinoth.ecommerce.entity.OrderItem;

import lombok.Data;

@Data
public class Purchase {
	private Customer customer;
	private Address shippingAddress;
	private Address billingAddress;
	private Order order;
	private Set<OrderItem> orderItems; 
}
