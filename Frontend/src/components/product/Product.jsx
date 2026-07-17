

import {ProductCard} from "./ProductCard.jsx";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router-dom";
import {PageLoader} from "../loaders/PageLoader.jsx";
import api from "../../config/api.js";



const Product = () =>{
    const[products, setProducts] = useState([]);
    const [searchParams,setsearchParams] = useSearchParams();
    const clearAIsearch = () =>{
        const params = new URLSearchParams(searchParams);

        params.delete("query");

        setsearchParams(params);
    }

    const query = searchParams.get("query");
    const[filter, setFilter] = useState({
        keyword:"",
        minprice:"",
        maxprice:"",
        categoryId:new URLSearchParams(window.location.search).get("categoryId") || "",
        rating:"",
        page:1,
        limit:10
    });
    const [parentCategories, setParentCategories] = useState([]);
    const [categoryList,setCategoryList] = useState([]);
    const fetchcategory =async () =>{
        try{
            const response = await api
                .get(`/category`)


            const category = response.data.data
            setCategoryList(category);

            const parentCategory = category.filter((category)=>(
                category.parent === null
            ))
            setParentCategories(parentCategory);
        }catch(err){
            console.log(err);

        }
    }

    const[pagination, setPagination] = useState([]);
    const[isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const isAdmin = user?.role==='admin'
    const fetchProductswithFilter = async () => {
        setIsLoading(true);
        try{

            if (query){
                const response = await api
                    .get(`/product/ai-search?query=${query}`)
                setProducts(response.data.data)

            }else{
                const queryParams = new URLSearchParams();
                Object.entries(filter).forEach(([key,value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        queryParams.append(key, value);
                    }
                })
                const response = await api.get(`/product?${queryParams.toString()}`)
                setProducts(response.data.data?.products)

                setPagination(response.data.data?.pagination)
            }

        }catch(error){
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }
    useEffect(()=>{
        fetchcategory();
    },[])
    useEffect(()=>{

        fetchProductswithFilter();

    },[filter,query])

    const handleCheckboxChange = (categoryId) => {
        clearAIsearch()
        setFilter((prev)=>({
            ...prev,
            categoryId: prev.categoryId === categoryId ? "" : categoryId,
            page:1
        }))
    }
    const handleRatingChange = (rating) => {
        clearAIsearch()
        setFilter((prev)=>({
            ...prev,
            rating:rating,
            page:1
        }))
    }
    const handlePriceChange = (price) => {
        clearAIsearch()
        setFilter((prev)=>({
            ...prev,
            maxprice:price,
            page:1
        }))

    }
    const handleClearFilters = () => {
        clearAIsearch()
        setFilter({
            keyword: "",
            minprice: "",
            maxprice: "",
            categoryId: "",
            rating: "",
            page: 1,
            limit:  10
        });
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-r from-[#071326] via-black to-[#071326] text-white">

                <div className="drawer lg:drawer-open">

                    <input
                        id="my-drawer-3"
                        type="checkbox"
                        className="drawer-toggle"
                    />

                    <div className="drawer-content">

                        <div className="max-w-7xl mx-auto px-6 py-10">


                            <label
                                htmlFor="my-drawer-3"
                                className="btn btn-primary lg:hidden mb-6"
                            >
                                Filters
                            </label>


                            <div className="mb-10">

                                <h1 className="text-4xl font-bold">
                                    {isAdmin?"Admin Product Management":"Products"}
                                </h1>

                                <p className="text-gray-400 mt-2">
                                    {isAdmin?" Manage your catalog, inventory and product listings.":"Browse products by category, price and rating."}
                                </p>

                            </div>


                            { isLoading ?(
                                 <PageLoader/>
                                ):(
                                products?.length > 0 ? (

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                                        {
                                            products.map((product) => (

                                                <div key={product._id} className="h-full">
                                                    <ProductCard
                                                        productId={product._id}
                                                        productname={product.name}
                                                        alt={product.name}
                                                        imageUrl={product?.variants?.[0]?.images?.[0]}
                                                        description={product.description}
                                                        fetchProductHandler={fetchProductswithFilter}
                                                    />
                                                </div>

                                            ))
                                        }

                                    </div>

                                ) : (

                                    <div className="h-96 flex justify-center items-center text-gray-400">
                                        No Products Found
                                    </div>

                                )
                            )

                            }


                            <div className="flex justify-center items-center gap-4 mt-12">
                                <button
                                    disabled={filter.page <= 1}
                                    onClick={() => setFilter(prev => ({ ...prev, page: prev.page - 1 }))}
                                    className="btn btn-sm"
                                >
                                    Previous
                                </button>
                                <span className="text-sm font-semibold">
                                Page {pagination?.currentPage} of {pagination?.totalPages || 1}
                            </span>
                                <button
                                    disabled={filter.page >= pagination?.totalPages}
                                    onClick={() => setFilter(prev => ({ ...prev, page: prev.page + 1 }))}
                                    className="btn btn-sm"
                                >
                                    Next
                                </button>
                            </div>

                        </div>

                    </div>


                    <div className="drawer-side">

                        <label
                            htmlFor="my-drawer-3"
                            className="drawer-overlay"
                        />

                        <aside className="w-80 min-h-full bg-[#081223] border-r border-blue-950 p-6">

                            <h2 className="text-2xl font-bold mb-8">
                                Filters
                            </h2>


                            <div className="mb-10">

                                <h3 className="font-semibold mb-4">
                                    Categories
                                </h3>

                                <div className="space-y-4">
                                    {
                                        parentCategories.map((category) => (
                                            <label className="flex items-center gap-3" key={category._id}>
                                                <input
                                                    type="checkbox"
                                                    checked={filter.categoryId===category._id}
                                                    onChange={()=>handleCheckboxChange(category._id)}
                                                    className="checkbox checkbox-primary"
                                                />
                                                {category.name}
                                            </label>
                                        ))
                                    }




                                </div>

                            </div>


                            <div className="mb-10">

                                <h3 className="font-semibold mb-4">
                                    Price Range
                                </h3>

                                <input
                                    type="range"
                                    min="0"
                                    max="150000"
                                    value={filter.maxprice||"2000"}
                                    onChange={(e)=>handlePriceChange(e.target.value)}
                                    className="range range-primary"
                                />

                                <div className="flex justify-between mt-2 text-sm text-gray-400">

                                    <span>₹0</span>

                                    <span>₹{filter.maxprice||2000}</span>

                                </div>

                            </div>


                            <div className="mb-10">

                                <h3 className="font-semibold mb-4">
                                    Ratings
                                </h3>

                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={filter.rating||"1"}
                                    onChange={(e)=>handleRatingChange(e.target.value)}
                                    className="range range-primary"
                                />

                                <div className="flex justify-between mt-2 text-sm text-gray-400">

                                    <span>{filter.rating||"1"}★</span>

                                    <span>5★</span>

                                </div>

                            </div>


                            <div className=" flex flex-col  gap-4">
                                <button className="btn btn-primary w-full" onClick={handleClearFilters}>
                                    Clear Filters
                                </button>
                                {isAdmin && (
                                    <button className="btn btn-success w-full"
                                    onClick={()=>navigate('/products/productForm')}
                                    >
                                        Add Product
                                    </button>
                                )}

                            </div>


                        </aside>

                    </div>

                </div>

            </div>
        </>
    )
}

export default Product