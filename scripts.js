module.exports = [
  "CREATE DATABASE menucoffee",
  "USE menucoffee",
  "CREATE TABLE `customers` (`customer_id` varchar(100) NOT NULL,`username` varchar(45) DEFAULT NULL,`password` varchar(45) DEFAULT NULL,`name` varchar(45) DEFAULT NULL,PRIMARY KEY (`customer_id`))",
  "CREATE TABLE `employee` (`employee_id` varchar(100) NOT NULL,`username` varchar(100) NOT NULL,`name` varchar(100) NOT NULL,`password` varchar(100) NOT NULL,PRIMARY KEY (`employee_id`))",
  "CREATE TABLE `menu` (`COFFEE_ID` varchar(100) NOT NULL,`COFFEE` varchar(100) NOT NULL,`PRICE` float NOT NULL,PRIMARY KEY (`COFFEE_ID`)) ",
  "CREATE TABLE `status` (`ORDER_ID` varchar(100) NOT NULL,`status` tinyint NOT NULL,PRIMARY KEY (`ORDER_ID`))",
  "CREATE TABLE `orders` (`customer_id` varchar(100) NOT NULL,`order_id` varchar(100) NOT NULL,`time_stamp` bigint NOT NULL,`coffee_id` varchar(100) NOT NULL,`quantity` int DEFAULT NULL,KEY `customer_id_idx` (`customer_id`),KEY `order_id_idx` (`order_id`),KEY `coffee_id_idx` (`coffee_id`),CONSTRAINT `coffee_id` FOREIGN KEY (`coffee_id`) REFERENCES `menu` (`COFFEE_ID`) ON DELETE CASCADE,CONSTRAINT `customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE,CONSTRAINT `order_id` FOREIGN KEY (`order_id`) REFERENCES `status` (`ORDER_ID`) ON DELETE CASCADE) ",
  "INSERT INTO `menucoffee`.`employee` (`employee_id`, `username`, `name`, `password`) VALUES ('123', 'employee', 'Employee', '123');",
  "INSERT INTO `menucoffee`.`customers` (`customer_id`, `username`, `password`, `name`) VALUES ('321', 'customer', '123', 'Customer');",
];
