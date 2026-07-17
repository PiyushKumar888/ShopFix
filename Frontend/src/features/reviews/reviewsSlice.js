import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    myReviews:{},
    productReviews:null,
}

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        setProductReviews: (state, action) => {
            state.productReviews = action.payload
        },
        setMyReviews:(state, action) => {
            const reviewPayload = action.payload
            if (reviewPayload && reviewPayload.product){
                const productId = reviewPayload.product._id
                state.myReviews[productId] = reviewPayload
            }
            else if (reviewPayload && reviewPayload.deleteId){
                state.myReviews[reviewPayload.deleteId] = null
            }

        }
    }
})

export const {setProductReviews, setMyReviews} = reviewsSlice.actions;
export default reviewsSlice.reducer;