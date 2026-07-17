import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import connectDB from './db.js';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import { Review } from '../models/review.model.js';
import { Cart } from '../models/cart.model.js';
import { Order } from '../models/order.model.js';

// Load environmental variables relative to your terminal execution root
dotenv.config({ path: './.env' });

const seedDatabase = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("❌ Error: MONGODB_URI is missing in your .env file!");
            process.exit(1);
        }

        // 1. Connect to DB
        console.log("Connecting to MongoDB via config/db.js...");
        await connectDB();

        // 2. Clear out ALL existing collections to prevent data collision
        console.log("Wiping collections clean...");
        await User.deleteMany({});
        await Product.deleteMany({});
        await Review.deleteMany({});
        await Cart.deleteMany({});
        await Order.deleteMany({});
        console.log("Database cleared.");

        // 3. Seed Users (Matching your User schema fields)
        console.log("Seeding users...");
        const usersToCreate = [];
        for (let i = 0; i < 10; i++) {
            usersToCreate.push({
                name: faker.person.fullName(), // Uses 'name' instead of 'username'
                email: faker.internet.email().toLowerCase(),
                password: "$2b$12$K39pZz19X.x48D7mEqF4IeyG.N0.Nf7M.Vl8hH.H8uEaFGe.dM3K6", // "password123" pre-hashed with bcrypt rounds: 12
                address: faker.location.streetAddress(),
                phone: parseInt(faker.string.numeric(10), 10), // Ensures it meets Number type requirement
                role: i === 0 ? 'admin' : 'user', // Makes the first user an admin for dashboard tests
                isVerified: true
            });
        }
        const createdUsers = await User.insertMany(usersToCreate);
        console.log(`Successfully created ${createdUsers.length} users.`);

        // 4. Seed Carts (Every user gets an initial unique empty cart schema)
        console.log("Initializing user carts...");
        const cartsToCreate = createdUsers.map(user => ({
            user: user._id,
            item: []
        }));
        await Cart.insertMany(cartsToCreate);

        // 5. Seed Products (Matching your Product schema fields)
        console.log("Seeding products...");
        const productsToCreate = [];
        const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen'];

        for (let i = 0; i < 15; i++) {
            productsToCreate.push({
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                imageUrl: faker.image.urlLoremFlickr({ category: 'appliance' }),
                price: parseFloat(faker.commerce.price({ min: 10, max: 299 })),
                stock: faker.number.int({ min: 10, max: 100 }),
                category: faker.helpers.arrayElement(categories),
                rating: 0 // Will auto-compute when individual reviews are created below
            });
        }
        const createdProducts = await Product.insertMany(productsToCreate);
        console.log(`Successfully created ${createdProducts.length} products.`);

        // 6. Seed Reviews & Compute Dynamic Averages
        console.log("Generating reviews and executing background aggregation hooks...");
        for (const product of createdProducts) {
            // Pick a random chunk of users (between 2 and 4) to review this product
            const reviewCount = faker.number.int({ min: 2, max: 4 });
            const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());
            const selectedUsers = shuffledUsers.slice(0, reviewCount);

            for (const user of selectedUsers) {
                // Must use Review.create() so your pre/post schema save middleware triggers
                await Review.create({
                    user: user._id,
                    product: product._id,
                    rating: faker.number.int({ min: 1, max: 5 }), // Respects min:1, max:5 properties
                    description: faker.lorem.sentences(1),
                });
            }
        }

        // 7. Seed Sample Orders (Simulates past transactional data)
        console.log("Generating transaction history (Orders)...");
        const orderStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];

        for (let i = 0; i < 8; i++) {
            const randomUser = faker.helpers.arrayElement(createdUsers);
            const randomProduct = faker.helpers.arrayElement(createdProducts);
            const quantity = faker.number.int({ min: 1, max: 3 });

            await Order.create({
                user: randomUser._id,
                item: [{
                    product: randomProduct._id,
                    quantity: quantity
                }],
                address: {
                    street: faker.location.streetAddress(),
                    city: faker.location.city(),
                    postalCode: faker.location.zipCode()
                },
                phone: faker.phone.number(),
                paymentId: `pay_${faker.string.alphanumeric(14)}`,
                totalAmount: randomProduct.price * quantity,
                status: faker.helpers.arrayElement(orderStatuses)
            });
        }

        console.log("🎉 Seeding successful! Database completely built and ready to go.");
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding stopped due to runtime error:", error);
        process.exit(1);
    }
};

seedDatabase();