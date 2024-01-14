create table "Account"(
    email varchar(512) primary key,
    password varchar(512),
    type varchar(16) check (type = 'admin' or type = 'customer')
);
insert into "Account" values ('a', '$2b$10$9Nc8Lw0QOFgRJo.HCVjt5.kCIa3m3LpBVetXTVtnoDCN19ypICPzS', 'admin');

create table "UserInfo"(
    email varchar(512) primary key references "Account"(email),
    name varchar(512),
    avatar varchar(512)
);

-- create Category table
create table "Category"(
    id serial primary key,
    name varchar(255),
    parent_id int,
    unique (name, parent_id),
    foreign key (parent_id) references "Category"(id)
);
-- mock data
insert into "Category" (name, parent_id) values ('phone', null);
insert into "Category" (name, parent_id) values ('iphone', 1);
insert into "Category" (name, parent_id) values ('android', 1);

-- table created for testing display data
CREATE TABLE "Products" (
    id SERIAL PRIMARY KEY,
    p_name VARCHAR(255) NOT NULL,
    category SERIAL references "Category"(id),
    price NUMERIC(10, 2),
    "stockQuantity" INTEGER,
    description TEXT,
    image VARCHAR(255)
);

create table "Order"(
    id serial,
    ts timestamp,
    email varchar(512) references "UserInfo"(email),
    product serial references "Products"(id),
    count int not null check (count > 0),
    primary key(email, ts, product)
);

create table "Cart"(
    id serial unique,
    email varchar(512),
    product serial references "Products"(id) unique,
    count int not null check (count > 0),
    primary key(email, product)
);

-- NOTE: maybe remove password field here and skip login when purchase
create table "PaymentAccount"(
    email varchar(512) primary key,
    password varchar(512),
    balance float not null
);

insert into "PaymentAccount" values('admin@gmail.com', null, 1000000.0);

create table "Transaction"(
    id serial unique,
    initiator varchar(512) references "PaymentAccount"(email),
    receiver varchar(512) references "PaymentAccount"(email),
    ts timestamp not null,
    amount float not null,
    description varchar(1024),
    primary key(initiator, receiver, ts)
);


-- table created for testing display data
CREATE TABLE "Products" (
    id SERIAL PRIMARY KEY,
    p_name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    price NUMERIC(10, 2),
    "stockQuantity" INTEGER,
    description TEXT,
    image VARCHAR(255)
);

INSERT INTO "Products" (p_name, category, price, "stockQuantity", description, image)
VALUES ('Product 1', 'Health and Wellness', 69.99, 35, 'Curabitur sit amet justo id sapien interdum congue. Integer eget justo vel orci auctor finibus.', 'https://placekitten.com/109/109');


-- create Category table 
create table "Category"(
    id serial primary key,
    name varchar(255),
    parent_id int,
    unique (name, parent_id),
    foreign key (parent_id) references "Category"(id)
);

-- mock data 
insert into "Category" (name) values ('iphone');  
insert into "Category" (name) values ('android'); 
insert into "Category" (name) values ('phone'); 


INSERT INTO "Products" (p_name, category, price, "stockQuantity", description, image)
VALUES 
  ('iPhone', 'phone', 849.99, 45, 'Apple iPhone 13 - 256GB, Product Red. Beautiful 6.1-inch A15 Bionic chip, Dual-camera system with 12MP Ultra-Wide and Wide cameras.', '5.png'),
  ('iPhone', 'phone', 899.99, 40, 'Apple iPhone 13 - 512GB, White. Sleek 6.1-inch A15 Bionic chip, Dual-camera system with 12MP Ultra-Wide and Wide cameras.', '6.png'),
  ('iPhone', 'phone', 769.99, 55, 'Apple iPhone 13 - 64GB, Black. Elegant 6.1-inch A15 Bionic chip, Dual-camera system with 12MP Ultra-Wide and Wide cameras.', '7.png'),
  ('iPhone', 'phone', 829.99, 48, 'Apple iPhone 13 Promax - 128GB, Gold. Dazzling 6.1-inch A15 Bionic chip, Dual-camera system with 12MP Ultra-Wide and Wide cameras.', '8.png'),
  ('iPhone', 'phone', 779.99, 52, 'Apple iPhone 13 - 256GB, Blue. Vibrant 6.1-inch A15 Bionic chip, Dual-camera system with 12MP Ultra-Wide and Wide cameras.', '9.png'),
  ('iPhone', 'phone', 789.99, 53, 'Apple iPhone 13 - 128GB, Green. Modern 6.1-inch A15 Bionic chip, Dual-camera system with 12MP Ultra-Wide and Wide cameras.', '10.png'),
  ('iPhone', 'phone', 809.99, 47, 'Samsung Galaxy S23 Ultra (8GB|256GB)', '11.png'),
  ('iPhone', 'phone', 859.99, 42, 'Apple iPhone 13 - 512GB, Pink. Stylish 6.1-inch A15 Bionic chip, Dual-camera system with 12MP Ultra-Wide and Wide cameras.', '12.png');
