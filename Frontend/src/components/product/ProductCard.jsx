import {useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";
import {useState} from "react";
import {Spinner} from "../loaders/Spinner.jsx";
import api from "../../config/api.js";

export const ProductCard = ({description,productname,imageUrl,alt,productId,fetchProductHandler}) =>{
    const userRole = useSelector(state => state.auth?.user?.role)
    const [loading, setLoading] = useState(false)
    const isAdmin = userRole === 'admin'
    const navigate = useNavigate();
    const productDeleteHandler =async () => {
        try{
            setLoading(true)
            const response =  await api
                .delete(`/product/${productId}`)
            toast.success("Product deleted successfully.")
            fetchProductHandler()
        }catch(err){
            console.log(err);
            toast.error("failed to delete product");

        }finally{
            setLoading(false)
        }
    }

    return(
        <>
            <div className="card w-full max-w-[280px] bg-base-100 shadow-sm h-full mx-auto
                hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10
                transition-all duration-300 cursor-pointer"  >

                <figure className="h-[260px] overflow-hidden bg-base-300"> {/* 💡 Added a background color so it doesn't look empty while loading */}
                    <img

                        className="w-full h-full object-cover opacity-0 transition-all duration-500 hover:scale-105"
                        src={imageUrl}
                        alt={alt}
                        loading="lazy"

                        onLoad={(e) => e.currentTarget.classList.replace('opacity-0', 'opacity-100')}
                    />
                </figure>
                <div className="card-body flex flex-col justify-between p-5">
                    <h2
                        className="card-title text-lg font-semibold line-clamp-1"
                    >{productname}</h2>
                    <p
                        className="text-sm text-base-content/70 line-clamp-2"
                    >{description}</p>
                    {
                        isAdmin===false?(
                            <>
                                <div className="card-actions mt-5">
                                    <Link className="btn btn-primary w-full rounded-xl"
                                    to={`/products/${productId}`}
                                    >Buy Now
                                    </Link>
                                </div>
                            </>
                        ):(<></>)
                    }

                    {
                        isAdmin && (
                            <div className="flex gap-2 mt-3">
                                <button
                                    disabled={loading}
                                    onClick={()=>navigate(`/products/productForm/${productId}`)}
                                    className="
                                flex-1
                                px-4 py-2
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                font-medium
                                transition-all
                                cursor-pointer
                                "
                                >
                                    Edit
                                </button>

                                <button

                                    onClick={productDeleteHandler}
                                    disabled={loading}
                                    className="
                                flex-1
                                px-4 py-2
                                rounded-xl
                                bg-red-600
                                hover:bg-red-700
                                text-white
                                font-medium
                                transition-all
                                cursor-pointer
                                "
                                >
                                    {
                                        loading?(
                                            <Spinner className="
                                                    flex-1
                                                    flex
                                                    items-center
                                                    justify-center
                                                    px-4
                                                    py-2
                                                    rounded-xl
                                                    bg-red-600
                                                    hover:bg-red-700
                                                    disabled:bg-red-500
                                                    text-white
                                                    font-medium
                                                    transition-all
                                                    cursor-pointer
                                                    "/>
                                        ):(
                                            "Delete"
                                        )
                                    }

                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}