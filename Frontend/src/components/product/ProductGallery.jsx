import { useNavigate, useParams } from "react-router-dom";
import {lazy,Suspense, useEffect, useState} from "react";
import api from "../../config/api.js"
import { useDispatch} from "react-redux";
import { setCart } from "../../features/cart/cartSlice.js";
import { ProductReview } from "./ProductReview.jsx";
import {toast} from "react-hot-toast";
import {ProductCard} from "./ProductCard.jsx";
import {AIbutton} from "../../AIChat/AIbutton.jsx";
import {Spinner} from "../loaders/Spinner.jsx";
import {PageLoader} from "../loaders/PageLoader.jsx";
import {NotFound} from "../loaders/NotFound.jsx";
import {ErrorBoundary} from "../loaders/ErrorBoundary.jsx";

const AskAI = lazy(()=>import( "../../AIChat/AskAI.jsx"))


const ProductGallery = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [cartloading,setCartloading] = useState(false);
    const [loading,setLoading] = useState(true);
    const [wishlistLoading,setWishlistLoading] = useState(false);
    const [activeVariant, setActiveVariant] = useState(0); // 🎯 Set default index to 0 instead of 1 to prevent out-of-bounds on variants[0]
    const dispatch = useDispatch();
    const fetchWishlistItems = async () => {
        try{

            const response = await api
                .get(`/wishlist`)
            setWishlistItems(response.data.data);

        }catch(error){
            console.log(error);
            toast.error("Failed to fetch wishlist");
        }
    }
    const openHandler = () => {
        setIsOpen(true);
    }
    const closeHandler = () => {
        setIsOpen(false);
    }
    useEffect(() => {
        fetchWishlistItems();
    },[productId])

    const addToWishlist =async (productId) => {

       const isAlreadyPresent =  wishlistItems?.products?.some((item)=>(
            item._id === productId
        ))
        if (isAlreadyPresent) {
            toast.error("Product is already in wishlist");
            return;
        }

        try{
            setWishlistLoading(true);
            const response = await api
                .post(`/wishlist`,{
                    productId
                })
            await fetchWishlistItems();
            toast.success("Product added to wishlist")

        }catch(error){
            console.log(error);
            toast.error("failed to add to wishlist");
        }finally{
            setWishlistLoading(false);
        }
    }
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try{
                const response = await api
                    .get(`/product/${productId}`);
                setProduct(response.data?.data);

                if (response.data?.data?.variants?.[0]?.images?.length > 0) {
                    setActiveImage(response.data?.data?.variants[0].images[0]);
                }
            }catch(error){
                console.log(error);
            }finally{
                setLoading(false);
            }




        };
        if (productId) {
            fetchProducts();
        }
    }, [productId]);

    useEffect(() => {
        if (productId){
            fetchrecommendedProducts()
        }
    },[productId]);
    const onAddtoCartHandler = () => {
        const currentVariant = product.variants?.[activeVariant];
        const variantId =  currentVariant?._id;
        const variantName =  currentVariant?.variantName
        const addToCart = async () => {
            try {
                setCartloading(true);
                const response = await api
                    .post(`/cart`, {
                        productId: productId,
                        variantId: variantId,
                        variantName: variantName,
                        quantity: 1,
                    });
                dispatch(setCart(response.data.data));
                toast.success("Added to cart");
                navigate("/cart",{
                    state:{
                        variantId: variantId,
                        variantName: variantName,
                    }
                });
            } catch (error) {
                 console.log(error);
                if (error.response?.status === 400) {
                    toast.error("Out of stock", { id: "stock-limit" });
                } else {
                    toast.error("Failed to update cart");
                }
            }finally {
                setCartloading(false);
            }
        };
        addToCart();
    };
    const [recommendedProduct, setRecommendedProduct] = useState([]);
    const fetchrecommendedProducts =async () =>{
        try{
            const response = await api
                .get(`/product/recommend/${productId}`);
            setRecommendedProduct(response?.data?.data);
        }catch(error){
            console.log(error);

        }
    }
    if(loading){
        return (
            <>
            <PageLoader/>
            </>

        )
    }
    if (!product) {
        return (
            <NotFound />
        )
    }

    return (
        <div className="min-h-screen bg-black text-white px-6 py-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">


                <div className="space-y-6">

                    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden">
                        <img
                            src={activeImage}
                            alt={activeImage}
                            className="w-full h-[500px] object-cover"
                        />
                    </div>


                    <ul className="flex gap-4 overflow-x-auto">
                        {product?.variants?.[activeVariant]?.images?.map((image, index) => {
                            const isSelected = activeImage === image;

                            return (
                                <li
                                    key={image}
                                    onClick={() => setActiveImage(image)}
                                >
                                    <img
                                        src={image}
                                        alt={image}
                                        className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition transform cursor-pointer shrink-0 ${
                                            isSelected
                                                ? "border-white scale-95 opacity-100"
                                                : "border-zinc-800 opacity-50 hover:opacity-80"
                                        }`}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>


                <div className="space-y-8">

                    <div className="space-y-4 border-b border-zinc-900 pb-8">
                        <h1 className="text-4xl font-light tracking-tight">
                            {product?.name}
                        </h1>


                        <p className="text-3xl font-medium text-zinc-100">
                            ₹{product?.variants?.[activeVariant]?.price || product?.price}
                        </p>

                        <p className="text-zinc-400 leading-relaxed">
                            {product?.description}
                        </p>
                    </div>


                    {product?.hasVariants && product?.variants?.length > 0 && (
                        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 space-y-4">
                            <h2 className="text-sm font-medium tracking-wider text-zinc-400 uppercase">
                                Select Option
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {product.variants.map((variant, index) => {
                                    const isCurrentVariant = activeVariant === index;
                                    return (
                                        <button
                                            key={variant._id || index}
                                            onClick={() => {
                                                setActiveVariant(index);

                                                if (variant.images?.length > 0) {
                                                    setActiveImage(variant.images[0]);
                                                }
                                            }}
                                            className={`px-5 py-3 rounded-2xl font-medium border text-sm transition cursor-pointer ${
                                                isCurrentVariant
                                                    ? "bg-white text-black border-white"
                                                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                                            }`}
                                        >
                                            {variant.variantName || `Option ${index + 1}`}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}


                    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6">
                        <h2 className="text-xl font-medium mb-6">
                            Specifications
                        </h2>

                        <div className="space-y-4">
                            {product.specification && Object.entries(product.specification).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex items-center justify-between border-b border-zinc-900 pb-3"
                                >
                                    <span className="text-zinc-500 capitalize">
                                        {key}
                                    </span>
                                    <span className="text-zinc-200 font-medium">
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="flex gap-4">
                        <button
                            disabled={cartloading}
                            className="flex-1 bg-white text-black rounded-2xl py-4 font-medium hover:opacity-90 transition cursor-pointer"
                            onClick={onAddtoCartHandler}
                        >
                            {
                                cartloading?(<Spinner className={"w-5 h-5"}/>):("Add to Cart")
                            }
                        </button>

                        <button className="px-6 border border-zinc-800 rounded-2xl hover:border-zinc-600 transition cursor-pointer"
                        onClick={()=>{
                            addToWishlist(product._id)
                        }}
                                disabled={wishlistLoading}
                        >
                            {
                                wishlistLoading?(<Spinner className={"w-5 h-5"}/>):("Add to Wishlist")
                            }
                        </button>
                    </div>


                    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6">
                        <h2 className="text-xl font-medium mb-4">
                            Reviews
                        </h2>
                        {product?.reviews?.map((review) => (
                            <ProductReview
                                key={review._id}
                                avatar={review?.user?.avatar}
                                name={review?.user?.name}
                                email={review?.user?.email}
                                description={review?.description}
                                images={review?.images}
                                rating={review?.rating}
                            />
                        ))}
                    </div>

                </div>
            </div>
            <div>
                <div className="mt-20 border-t border-zinc-900 pt-12">
                    <div className="mb-8">
                        <h2 className="text-3xl font-semibold tracking-tight">
                            You May Also Like
                        </h2>

                        <p className="text-zinc-400 mt-2">
                            Similar products selected for you based on this item.
                        </p>
                    </div>
                    <div >
                        {
                            isOpen?(
                                <ErrorBoundary >
                                    <Suspense fallback={
                                        <div className="flex justify-center py-10">
                                            <Spinner className="w-8 h-8" />
                                        </div>
                                    }>
                                        <AskAI closeHandler={closeHandler} product={product} />
                                    </Suspense>
                                </ErrorBoundary>



                            ): (<>
                                <AIbutton openHandler={openHandler} />
                            </>)
                        }

                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recommendedProduct.map((product) => (
                            <div
                                key={product._id}
                                className="transition duration-300 hover:-translate-y-1"
                            >
                                <ProductCard
                                    productId={product._id}
                                    productname={product.name}
                                    alt={product.name}
                                    imageUrl={product?.variants?.[0]?.images?.[0]}
                                    description={product.description}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductGallery;