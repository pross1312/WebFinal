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
create table "PaymentAccount"(
    email varchar(512) primary key,
    password varchar(512),
    balance float not null
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
