import {Link, useNavigate} from 'react-router-dom';
import { SearchBar } from "./SearchBar.jsx";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-hot-toast";
import {logoutUser} from "../../features/auth/authSlice.js";
import {setCart} from "../../features/cart/cartSlice.js";
import {useState} from "react";
import {Spinner} from "../loaders/Spinner.jsx";
import api from "../../config/api.js";

export const NavBar = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const {user,isAuthenticated } = useSelector((state) => state.auth);
    const cart = useSelector((state) => state.cart.cart);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();

    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    const logoutHandler =() => {
        const logout = async () => {
            try{
                setLoading(true);
                const response = await api
                    .put(`/user/logout`,{})
                dispatch(logoutUser());
                dispatch(setCart(null));

                toast.success("Logged out successfully!");

                navigate("/login");

            }catch(err){
                console.log(err)
                toast.error("Failed to log out. Please try again.");
            }finally{
                setLoading(false);
            }
        }
        logout();
    }
    if (isSearchOpen) {
        return (
            <div className="navbar bg-base-100 shadow-md px-4 lg:hidden">

                <button
                    className="btn btn-ghost btn-circle"
                    onClick={() => setIsSearchOpen(false)}
                >
                    ←
                </button>

                <div className="flex-1 ml-2">
                    <SearchBar />
                </div>

            </div>
        );
    }
    return (
        <>
            <div className="navbar bg-base-100 dark:bg-neutral text-base-content dark:text-neutral-content shadow-md px-4 sm:px-6 transition-colors duration-200">


                <div className="navbar-start">
                    <Link to="/" className="btn btn-ghost text-xl tracking-tight font-extrabold text-primary dark:text-secondary-content">
                        ShopFix
                    </Link>
                    <div className="dropdown lg:hidden">
                        <div tabIndex={0} role="button" className="btn btn-ghost">
                            ☰
                        </div>

                        <ul
                            tabIndex={0}
                            className="menu dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 shadow"
                        >
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/orders">My Orders</Link></li>

                            {user?.role === "admin" ? (
                                <>
                                    <li><Link to="/admin">Admin Panel</Link></li>
                                    <li><Link to="/admin/banner">Banner</Link></li>
                                </>
                            ) : (
                                <li><Link to="/about">About Us</Link></li>
                            )}
                        </ul>
                    </div>
                    <button
                        className="btn btn-ghost btn-circle lg:hidden"
                        onClick={() => setIsSearchOpen(true)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M20 20l-3.5-3.5"
                            />
                        </svg>
                    </button>
                    {isSearchOpen && (
                        <div className="fixed inset-0 z-[999] bg-black/60 flex justify-center items-start pt-20 px-4 lg:hidden">
                            <div className="bg-base-100 rounded-xl p-4 w-full max-w-lg">

                                <div className="flex justify-end mb-3">
                                    <button
                                        className="btn btn-sm btn-circle"
                                        onClick={() => setShowMobileSearch(false)}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <SearchBar />

                            </div>
                        </div>
                    )}
                </div>


                <div className="navbar-center hidden lg:flex items-center gap-2">
                    <ul className="menu menu-horizontal px-1 gap-2 font-medium">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/orders">My Orders</Link></li>


                        {
                            user?.role==='admin'? (
                                <li><Link to="/admin">Admin Panel</Link></li>
                            ):(
                                <li><Link to="/about">About Us</Link></li>
                            )
                        }
                        {
                            user?.role==='admin'? (
                                <li><Link to="/admin/banner">Banner</Link></li>
                            ):(<></>)
                        }



                    </ul>


                    <div className="ml-4 w-64 xl:w-80">
                        <SearchBar />
                    </div>
                </div>

                <div className="navbar-end gap-2 sm:gap-4">


                    <div className="flex items-center px-2">
                        <input type="checkbox" value="synthwave" className="toggle toggle-sm theme-controller" />
                    </div>


                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle hover:bg-base-200 dark:hover:bg-neutral-focus">
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="badge badge-sm badge-primary indicator-item font-semibold shadow-xs">{cart?.item?.length || 0}</span>
                            </div>
                        </div>
                        <div tabIndex={0} className="card card-compact dropdown-content bg-base-100 dark:bg-base-200 text-base-content z-50 mt-3 w-56 shadow-2xl border border-base-200 dark:border-neutral-focus">
                            <div className="card-body">
                                <span className="text-md font-bold text-base-content/80">{cart?.item?.length || 0} Items Selected</span>

                                <div className="card-actions mt-2">
                                    <Link to="/cart" className="btn btn-primary btn-block btn-sm">View Cart</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Link
                            to="/wishlist"
                            className="btn btn-ghost btn-circle hover:bg-base-200 dark:hover:bg-neutral-focus text-base-content dark:text-neutral-content transition-all duration-200"
                            title="View Wishlist"
                        >
                            <div className="indicator">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 transition-transform duration-200 active:scale-95"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </div>
                        </Link>
                    </div>


                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-1 ring-base-content/10 dark:ring-neutral-content/20 transition-all hover:scale-105">
                            <div className="w-9 rounded-full">
                                <img
                                    loading="lazy"
                                    alt="User Profile"
                                    src={user?.avatar || defaultAvatar}
                                />
                            </div>
                        </div>
                        <ul tabIndex={-1} className="menu menu-sm dropdown-content bg-base-100 dark:bg-base-200 text-base-content z-50 mt-3 w-52 p-2 shadow-2xl rounded-box border border-base-200 dark:border-neutral-focus">
                            <li>
                                <Link to="/profile" className="justify-between py-2">
                                    Profile
                                </Link>
                            </li>
                            <hr className="my-1 border-base-200 dark:border-neutral-focus" />
                            <li>
                                {
                                    isAuthenticated===true ? (
                                        <button
                                            disabled={loading}
                                            onClick={logoutHandler} className="text-error font-medium py-2 hover:bg-error/10 w-full text-left">
                                            {
                                                loading?(
                                                    <Spinner className={"h-4 w-4"} />
                                                ):(
                                                    "Logout"
                                                )
                                            }
                                        </button>
                                    ):(

                                        <button onClick={()=>{

                                            navigate('/login')
                                        }} className="text-error font-medium py-2 hover:bg-error/10 w-full text-left">
                                            Login
                                        </button>
                                    )
                                }




                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </>

    );
};