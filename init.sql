create table "Account"(
    email varchar(512) primary key,
    password varchar(512), 
    type varchar(16) check (type = 'admin' or type = 'customer')
);
create table "PaymentAccount"(
    email varchar(512) primary key references "Account"(email),
    cash float not null
);
create table "UserInfo"(
    email varchar(512) primary key references "Account"(email),
    name varchar(512),
    avatar varchar(512)
);

