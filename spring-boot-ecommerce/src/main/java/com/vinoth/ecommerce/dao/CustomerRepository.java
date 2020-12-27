package com.vinoth.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vinoth.ecommerce.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}
