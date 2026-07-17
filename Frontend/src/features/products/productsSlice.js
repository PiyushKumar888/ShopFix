import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    products: null,

}

const productsSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProduct: (state, action) => {
            state.products = action.payload
        }
    }
})
export const {setProduct} = productsSlice.actions;
export  default productsSlice.reducer