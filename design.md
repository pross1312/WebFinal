# FINAL PROJECT

## Authentication - TUONG
- /login
- /register
- /auth:
Post    - /login
Post    - /register
        - /google
        - /logout


## Buyer          - LONG
- /product:
View    - /list?page={}&per_page={}
View    - /detail?product_id={}
View    - /search?pattern={}&filter_type={}
        - /list_type?
        - /related?product_id={}

- /cart: **Store products in cart at backend**
        - /add?product_id={}
View    - /show?

- /payment: **Make payment for products in cart**
View    - /         (preview and confirm order)
View    - /deposit  (nap tien)
### TUONG
        - /make
        - /make_deposit



## Admin            - HUY
- /admin:
View    - /         (statistic with graph about order count
                     show admin account cash)
        - /statistic    -> {order_count, cash}

View    - /manage/account
        - /manage/account/create?new_type={}&product_ids={}
        - /manage/account/delete?id={}

View    - /manage/account
Post    - /manage/account/udpate
Post    - /manage/account/create
        - /manage/account/delete?id={}

View    - /manage/product
Post    - /manage/product/udpate
Post    - /manage/product/create
        - /manage/product/delete?id={}
**--------------------------------------------------------------------**


## Payment system       - TUONG
**Use jwt access token**
Post    - /register?
Post    - /make_transact
        - /account_info?access_token={}

### Database
#### Payment system
PaymentAccount {
    email (reference Account(email)),
    cash,
}
Transaction {
    id,
    from (reference Account(email)),
    to (reference Account(email)),
    amount,
    date,
}

#### Main system
Product {
    id,
    name,
    description,
    price
}
Account {
    email,
    password
}
UserInfo {
    email (reference Account(email)),
    fullname,
    avatar,
}
Cart {
    account_id,
    product_id
}
