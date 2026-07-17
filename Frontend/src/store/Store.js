import {configureStore, createStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import productReducer from '../features/products/productsSlice.js';
import cartReducer from '../features/cart/cartSlice.js';
import reviewsReducer from '../features/reviews/reviewsSlice.js';

export const store = configureStore({
    reducer: {
        auth:authReducer,
        product:productReducer,
        cart:cartReducer,
        reviews:reviewsReducer
    }
})

export default store;