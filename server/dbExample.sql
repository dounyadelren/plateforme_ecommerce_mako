CREATE DATABASE IF NOT EXISTS eCommerce;

USE eCommerce;

CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    firstName varchar(255),
    lastName varchar(255),
    company varchar(255),
    telPaypal varchar(255),
    emailPaypal varchar(255),
    roles array NOT NULL,
    adress varchar(255),
    postalCode INT,
    city varchar(255),
    country varchar(255),
    phone varchar(255)
)

CREATE TABLE IF NOT EXISTS articles (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idSeller INT NOT NULL,
    name varchar(255) NOT NULL,
    price INT NOT NULL,
    components array NOT NULL,
    description varchar(511) NOT NULL,
    status varchar(255) NOT NULL,
    stock INT,
    promotion INT DEFAULT(0),
    releaseDate DATETIME DEFAULT (NOW()),
    deliveryPrice INT NOT NULL,
    size array,
    mainTag varchar(255) NOT NULL
)

CREATE TABLE IF NOT EXISTS plantedTrees (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idUser INT NOT NULL,
    locationX DECIMAL(20,15) NOT NULL,
    locationY DECIMAL(20,15) NOT NULL,
)

CREATE TABLE IF NOT EXISTS tags (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idArticle INT NOT NULL,
    tagName varchar(255) NOT NULL,
)

CREATE TABLE IF NOT EXISTS reviews (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idArticle INT NOT NULL,
    idUser INT NOT NULL,
    review varchar(511),
    stars INT NOT NULL,
    publishedDate DATETIME NOT NULL
)

CREATE TABLE IF NOT EXISTS orders (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idUser INT NOT NULL,
    idTransport varchar(255) NOT NULL,
    orderNumber varchar(255) NOT NULL,
    expeditionDate DATE NOT NULL,
    estimatedArrivalDate DATE NOT NULL,
    status varchar(255) NOT NULL,
    promotion INT NOT NULL
)

CREATE TABLE IF NOT EXISTS purchases (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idArticle INT NOT NULL,
    idOrder INT NOT NULL,
    quantity INT NOT NULL,
    price INT NOT NULL,
    size varchar(255)
)

CREATE TABLE IF NOT EXISTS deliveryTypes (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    types varchar(255) NOT NULL,
    price INT NOT NULL,
    speed INT NOT NULL
)

CREATE TABLE IF NOT EXISTS SellerAccountRequest (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user INT NOT NULL,
    email varchar(255) NOT NULL,
    companyName varchar(255) NOT NULL,
    description varchar(511),
    status varchar(127) NOT NULL
)

CREATE TABLE IF NOT EXISTS MainTags (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name varchar(255) NOT NULL
)

CREATE TABLE IF NOT EXISTS images (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idArticle INT NOT NULL,
    name varchar(255) NOT NULL
)

-- INSERT INTO users VALUES (
--     email = 'superAdmin@dounyacratie.fr',
--     password = 'passwordAdmin',
--     firstName = 'Dounya',
--     lastName = 'Cratie',
--     roles = 'ROLE_SUPERADMIN',
--     adress = '111 avenue de France',
--     postalCode = 75000,
--     city = 'Paris',
--     country = 'France'
-- )