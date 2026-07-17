import 'swiper/css';
import {BrowserRouter, Outlet, Route, Routes, useNavigate} from 'react-router-dom';
import {NavBar} from "../components/common/NavBar.jsx";
import {Footer} from "../components/common/Footer.jsx";

import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {logoutUser, setUser} from "../features/auth/authSlice.js";

import {setProduct} from "../features/products/productsSlice.js";
import {Toaster} from "react-hot-toast";
import {setCart} from "../features/cart/cartSlice.js";
import api ,{setLogoutHandler} from "../config/api.js"

export const Home = () => {
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const {isAuthenticated} = useSelector(state => state.auth);



    const checkAuth = async () => {
        try{
            const response = await api
                .get(`/user/getMe`)

            dispatch(setUser(response.data.data));

        }catch(e){
            console.log(e)
            try{
                const response = await api
                    .put(`/user/refresh`)

                dispatch(setUser(response.data.data))

            }catch (e){

                dispatch(logoutUser())
            }


        }

    }
    useEffect(()=>{
        checkAuth()

    },[dispatch,isAuthenticated])
    useEffect(()=>{
        const fetchProducts = async () => {
            try{
                const response = await api
                    .get(`/product?page=1&limit=1000`)

                dispatch(setProduct(response.data.data))
            }catch(error){
                console.log(error)

            }
        }
        fetchProducts()
    },[])

    useEffect(() => {
        const fetchCart = async () => {
            try{
                const response = await api
                    .get(`/cart`)

                dispatch(setCart(response.data.data));
            }catch(err){
                console.error(err);

            }


        }
        fetchCart();
    },[isAuthenticated,dispatch]);

    useEffect(() => {
        setLogoutHandler(()=>{
            dispatch(logoutUser());
        })

    }, [dispatch]);


    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <NavBar/>
            <Outlet/>
            <Footer/>
        </>
    )
}