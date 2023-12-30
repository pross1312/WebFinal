const products = [
    {
        id:1, 
        name: 'Product 1',
        category: 'Electronics',
        price: 599.99,
        stockQuantity: 50,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        manufacturer: 'ABC Electronics',
        releaseDate: '2022-01-01',
        rating: 4.5,
        image: 'https://placekitten.com/100/100'
    },
    {
        id:2, 
        name: 'Product 2',
        category: 'Clothing',
        price: 39.99,
        stockQuantity: 100,
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        manufacturer: 'FashionHub',
        releaseDate: '2022-02-15',
        rating: 3.8,
        image: 'https://placekitten.com/101/101'
    },
    {
        id:3, 
        name: 'Product 3',
        category: 'Home and Garden',
        price: 149.99,
        stockQuantity: 30,
        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        manufacturer: 'HomeGoods Co.',
        releaseDate: '2022-03-20',
        rating: 4.2,
        image: 'https://placekitten.com/102/102'
    },
    {
        id: 4, 
        name: 'Product 4',
        category: 'Sports and Outdoors',
        price: 79.99,
        stockQuantity: 70,
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        manufacturer: 'OutdoorGear Inc.',
        releaseDate: '2022-04-10',
        rating: 4.0,
        image: 'https://placekitten.com/103/103'
    },
    {
        id: 5, 
        name: 'Product 5',
        category: 'Books',
        price: 19.99,
        stockQuantity: 120,
        description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        manufacturer: 'BookHouse Publishers',
        releaseDate: '2022-05-05',
        rating: 4.8,
        image: 'https://placekitten.com/104/104'
    },
    {
        id: 6, 
        name: 'Product 6',
        category: 'Beauty and Personal Care',
        price: 49.99,
        stockQuantity: 40,
        description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
        manufacturer: 'BeautyEmpire',
        releaseDate: '2022-06-15',
        rating: 3.5,
        image: 'https://placekitten.com/105/105'
    },
    {
        id: 7, 
        name: 'Product 7',
        category: 'Furniture',
        price: 299.99,
        stockQuantity: 25,
        description: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
        manufacturer: 'FurnitureCraft',
        releaseDate: '2022-07-20',
        rating: 4.7,
        image: 'https://placekitten.com/106/106'
    },
    {
        id: 8, 
        name: 'Product 8',
        category: 'Toys and Games',
        price: 29.99,
        stockQuantity: 90,
        description: 'Suspendisse potenti. Vivamus in velit vestibulum, fermentum odio at, auctor orci.',
        manufacturer: 'ToyWorld',
        releaseDate: '2022-08-10',
        rating: 4.2,
        image: 'https://placekitten.com/107/107'
    },
    {
        id: 9, 
        name: 'Product 9',
        category: 'Kitchen and Dining',
        price: 129.99,
        stockQuantity: 60,
        description: 'Phasellus euismod justo ac tristique laoreet. Aenean nec sagittis orci.',
        manufacturer: 'KitchenMasters',
        releaseDate: '2022-09-05',
        rating: 4.6,
        image: 'https://placekitten.com/108/108'
    },
    {
        id: 10, 
        name: 'Product 10',
        category: 'Health and Wellness',
        price: 69.99,
        stockQuantity: 35,
        description: 'Curabitur sit amet justo id sapien interdum congue. Integer eget justo vel orci auctor finibus.',
        manufacturer: 'WellnessWorld',
        releaseDate: '2022-10-15',
        rating: 3.9,
        image: 'https://placekitten.com/109/109'
    },
];

const mockOrders = [
    { orderId: 1, customerName: 'John Doe', productName: 'Product A', quantity: 2, price: 25.99, deliveryMethod: 'shipping' },
    { orderId: 2, customerName: 'Jane Smith', productName: 'Product B', quantity: 1, price: 19.99, deliveryMethod: 'takeaway' },
    { orderId: 3, customerName: 'Bob Johnson', productName: 'Product C', quantity: 3, price: 34.99, deliveryMethod: 'shipping' },
    { orderId: 4, customerName: 'Alice Williams', productName: 'Product A', quantity: 1, price: 25.99, deliveryMethod: 'takeaway' },
    { orderId: 5, customerName: 'Charlie Brown', productName: 'Product B', quantity: 2, price: 19.99, deliveryMethod: 'shipping' },
    { orderId: 6, customerName: 'Eva Davis', productName: 'Product C', quantity: 1, price: 34.99, deliveryMethod: 'takeaway' },
    { orderId: 7, customerName: 'Frank Miller', productName: 'Product A', quantity: 4, price: 25.99, deliveryMethod: 'shipping' },
    { orderId: 8, customerName: 'Grace Wilson', productName: 'Product B', quantity: 2, price: 19.99, deliveryMethod: 'takeaway' },
    { orderId: 9, customerName: 'Henry Johnson', productName: 'Product C', quantity: 1, price: 34.99, deliveryMethod: 'shipping' },
    { orderId: 10, customerName: 'Ivy Carter', productName: 'Product A', quantity: 3, price: 25.99, deliveryMethod: 'takeaway' },
    // Add more orders as needed
];



module.exports = {products, mockOrders};