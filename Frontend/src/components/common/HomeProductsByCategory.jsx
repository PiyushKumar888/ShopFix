import {ProductCard} from "../product/ProductCard.jsx";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {PageLoader} from "../loaders/PageLoader.jsx";
import api from "../../config/api.js";


export const HomeProductsByCategory =()=> {


    const products = useSelector((state) => state.product?.products?.products);
    const [loading, setLoading] = useState(true);
    const [parentCategories, setParentCategories] = useState([]);
    const fetchcategory =async () =>{
        try{

            const response = await api
                .get(`/category`)

            const category = response.data.data

            const parentCategory = category.filter((category)=>(
                category.parent === null
            ))
            setParentCategories(parentCategory);
        }catch(err){
            console.log(err);

        }finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchcategory();
    },[])

    if (loading || !products){
        return (
            <PageLoader/>
        )
    }


    return (
        <>
            <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-12 space-y-16">
                {
                    parentCategories.map((category) => {

                        const categoryProducts = (products ?? [])
                            ?.filter(product => product.category?.parent === category._id)
                            .slice(0, 5);

                        if (categoryProducts?.length === 0) {
                            return null;
                        }

                        return (
                            <section key={category?._id} className="space-y-6">

                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-bold tracking-tight">
                                        {category?.name}
                                    </h2>

                                    <Link
                                        className="text-sm font-medium opacity-70 hover:opacity-100 transition"
                                        to={`/products?categoryId=${category?._id}`}
                                    >
                                        View All
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8">
                                    {categoryProducts.map((product ) => (
                                        <div key={product._id} className="h-full">
                                            <ProductCard
                                                productId={product?._id}
                                                imageUrl={product?.variants?.[0]?.images?.[0]}
                                                description={product?.description}
                                                productname={product?.name}
                                                alt={product?.name}
                                            />
                                        </div>
                                    ))}
                                </div>

                            </section>
                        );
                    })
                }





            </div>
        </>
    )
}