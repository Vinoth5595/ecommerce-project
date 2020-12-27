# Ecommerce Application (Angular & SpringBoot)

| Application  | Description | Port |
| ------------- | ------------- | ------------- |
| angular-ecommerce  | Angular Front End  | 4200  |
| spring-boot-ecommerce  | Spring Boot back End  | 8080  |

Steps to run the application:

1. Up your database by executing the docker command
    docker run -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql

2. Now, open the MySql Client and execute the initial DB scipts (db-scripts.sql).

3. Run your Spring boot application

4. Run your Angular Application (ng serve --open)