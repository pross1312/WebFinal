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
insert into "Category" (name, parent_id) values ('Apple', null);
insert into "Category" (name, parent_id) values ('Iphone 7', 1);
insert into "Category" (name, parent_id) values ('Iphone 13', 1);
insert into "Category" (name, parent_id) values ('Iphone 13', 3);
insert into "Category" (name, parent_id) values ('Iphone 13 Pro Max', 3);
insert into "Category" (name, parent_id) values ('Samsung', null);
insert into "Category" (name, parent_id) values ('Galaxy S', 6);
insert into "Category" (name, parent_id) values ('Galaxy Flip', 6);
insert into "Category" (name, parent_id) values ('Google', null);
insert into "Category" (name, parent_id) values ('Google 7 Pixel', 9);
insert into "Category" (name, parent_id) values ('Google 8 Pixel', 9);
insert into "Category" (name, parent_id) values ('Oppo', null);
insert into "Category" (name, parent_id) values ('Oppo Find N2 Flip', 12);
insert into "Category" (name, parent_id) values ('Oppo Reno', 12);
insert into "Category" (name, parent_id) values ('Xiaomi', null);
insert into "Category" (name, parent_id) values ('Redmi Note', 15);
insert into "Category" (name, parent_id) values ('Redmi', 15);


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

-- insert into "Category" (id, name) values(-1, 'REMOVED');
-- insert into "Products" (id, p_name, category) values(-1, 'REMOVED', -1);

INSERT INTO "Products" (p_name, category, price, "stockQuantity", description, image)
VALUES 
  ('Apple iPhone 13 - 256GB', '4', 849.99, 45, 'Product Red. Beautiful 6.1-inch A15 Bionic chip, Dual-camera system with 12MP Ultra-Wide and Wide cameras.', '/image/5.png'),
  ('Apple iPhone 13 - 512GB', '4', 899.99, 40, 'White. Sleek 6.1-inch A15 Bionic chip, Dual-camera system with 12MP Ultra-Wide and Wide cameras.', '/image/6.png'),
  ('Apple iPhone 13 - 64GB,', '4', 769.99, 55, 'lack. Elegant 6.1-inch A15 Bionic chip, Dual-camera system with 12MP Ultra-Wide and Wide cameras.', '/image/7.png'),
  ('Apple iPhone 13 Promax 128GB','5', 829.99, 48, ', Gold. Dazzling 6.1-inch A15 Bionic chip, Dual-camera system with 12MP Ultra-Wide and Wide cameras.', '/image/8.png'),
  ('Apple iPhone 13 - 256GB', '4', 779.99, 52, 'Blue. Vibrant 6.1-inch A15 Bionic chip, Dual-camera system with 12MP Ultra-Wide and Wide cameras.', '/image/9.png'),
  ('Apple iPhone 13 - 128GB', '4', 789.99, 53, 'Green. Modern 6.1-inch A15 Bionic chip, Dual-camera system with 12MP Ultra-Wide and Wide cameras.', '/image/10.png'),
  ('Apple iPhone 13 - 512GB', '4', 859.99, 42, 'Apple iPhone 13 - 512GB, Pink. Stylish 6.1-inch A15 Bionic chip, Dual-camera system with 12MP Ultra-Wide and Wide cameras.', '/image/12.png'),
-- Samsung
  ('Samsung Galaxy S23 Ultra Black', '7', 1809.99, 47, 'Samsung Galaxy S23 Ultra (8GB|256GB)', '/image/11.png'),
  ('Samsung Galaxy S23 Ultra Mint', '7', 1809.99, 47, 'Samsung Galaxy S23 Ultra (8GB|256GB)', '/image/13.png'),
  ('Samsung Galaxy S23 Ultra Red', '7', 1809.99, 47, 'Samsung Galaxy S23 Ultra (8GB|256GB)', '/image/14.png'),
  ('Samsung Galaxy Z Flip 4 - Black', '8', 1809.99, 47, 'Samsung Galaxy Z Flip 4 (8GB|128GB)', '/image/15.png'),
  ('Samsung Galaxy Z Flip 4 - Gold', '8', 1809.99, 47, 'Samsung Galaxy Z Flip 4 (16GB|252GB)', '/image/16.png'),

-- Google
  ('Google Pixel 7 Pro 5G', '10', 1759.99, 47, 'Google Pixel 7, new release in 2024, OLED 6.7 inch 12GB|256GB', '/image/21.png'),
  ('Google Pixel 8 Pro 5G Black', '11', 1809.99, 47, 'Google Pixel 8, new release in 2024, OLED 6.7 inch 12GB|256GB', '/image/17.png'),
  ('Google Pixel 8 Pro 5G Blue', '11', 1819.99, 47, 'Google Pixel 8, new release in 2024, OLED 6.7 inch 12GB|256GB', '/image/18.png'),
  ('Google Pixel 8 Pro 5G White', '11', 1829.99, 47, 'Google Pixel 8, new release in 2024, OLED 6.7 inch 12GB|256GB', '/image/19.png'),
  ('Google Pixel 8 Pro 5G', '11', 1839.99, 47, 'Google Pixel 8, new release in 2024, OLED 6.7 inch 12GB|256GB', '/image/20.png'),

-- Oppo
  ('Oppo Reno 11 Pro 5G - Black', '14', 13359.99, 47, 'Oppo Reno 11 Pro 5G 12GB|512GB,AMOLED 6.7" Full HD+, Camera 32 MP, MediaTek Dimensity 8200 5G 8 nhân', '/image/22.png'),
  ('Oppo Reno 11 Pro 5G - White', '14', 14359.99, 47, 'Oppo Reno 11 Pro 5G 12GB|512GB,AMOLED 6.7" Full HD+, Camera 32 MP, MediaTek Dimensity 8200 5G 8 nhân', '/image/23.png'),
  ('Oppo Reno 11 Pro 5G - Blue', '14', 14359.99, 47, 'Oppo Reno 11 Pro 5G 12GB|512GB,AMOLED 6.7" Full HD+, Camera 32 MP, MediaTek Dimensity 8200 5G 8 nhân', '/image/24.png'),
  ('Oppo Find N2 Flip - Purple', '13', 13349.99, 47, 'Oppo Find N2 Flip 8GB|256GB, AMOLED Chính 6.8" & Phụ 3.26" Full HD+, 32 MP, MediaTek Dimensity 9000+ 8 nhân', '/image/25.png'),
  ('Oppo Find N2 Flip - Black', '13', 13239.99, 47, 'Oppo Find N2 Flip 8GB|256GB, AMOLED Chính 6.8" & Phụ 3.26" Full HD+, 32 MP, MediaTek Dimensity 9000+ 8 nhân', '/image/26.png'),

-- Xiaomi 
  ('Xiaomi Redmi Note 12 - Black', '16', 13359.99, 47, 'Xiaomi Redmi Note 12 8GB|128GB, AMOLED 6.67" Full HD+, 120Hz, Camera 13 MP, Snapdragon 685 8 nhân', '/image/27.png'),
  ('Xiaomi Redmi Note 12 - Blue', '16', 13359.99, 47, 'Xiaomi Redmi Note 12 8GB|128GB, AMOLED 6.67" Full HD+, 120Hz, Camera 13 MP, Snapdragon 685 8 nhân', '/image/28.png'),
  ('Xiaomi Redmi Note 12 - Green', '16', 13359.99, 47, 'Xiaomi Redmi Note 12 8GB|128GB, AMOLED 6.67" Full HD+, 120Hz, Camera 13 MP, Snapdragon 685 8 nhân', '/image/29.png'),
  ('Xiaomi Redmi Note 12 - Yellow', '16', 13359.99, 47, 'Xiaomi Redmi Note 12 8GB|128GB, AMOLED 6.67" Full HD+, 120Hz, Camera 13 MP, Snapdragon 685 8 nhân', '/image/30.png'),
  ('Xiaomi Redmi 10 2022 - Blue', '17', 13359.99, 47, 'Xiaomi Redmi 10 2022 4GB|128GB,	IPS LCD 6.5" Full HD+, 120Hz, Camera 8 MP, 	MediaTek Helio G88', '/image/31.png');

create table "Order"(
    id serial,
    ts timestamp,
    email varchar(512) references "UserInfo"(email),
    product serial,
    count int not null check (count > 0),
    p_id serial,
    primary key(email, ts, p_id)
);

create table "Cart"(
    email varchar(512),
    product serial references "Products"(id),
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

-- chat between admin and customer with $email
create table "ChatMessage"(
    id serial,
    role varchar(16) not null check (role = 'customer' OR role = 'admin'),
    content varchar(1024) not null,
    email varchar(512) references "UserInfo"(email),
    primary key(id, email)
);

