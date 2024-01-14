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
