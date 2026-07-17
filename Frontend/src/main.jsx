import { createRoot } from "react-dom/client";
import "./App.css";

import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import {
    Provider,
} from "react-redux";

import {
    lazy,
    Suspense,
} from "react";

import store from "./store/Store.js";

import { Home } from "./pages/Home.jsx";
import { AppSwiper } from "./components/common/AppSwiper.jsx";
import { HomeProductsByCategory } from "./components/common/HomeProductsByCategory.jsx";
import { ProtectedRoutes } from "./components/ProtectedRoutes/ProtectedRoutes.jsx";
import { AdminRoutes } from "./adminComponents/ProtectedRoutes/AdminRoutes.jsx";
import { PageLoader } from "./components/loaders/PageLoader.jsx";
import {UserRoutes} from "./components/ProtectedRoutes/UserRoutes.jsx";

const Product = lazy(() =>
    import("./components/product/Product.jsx")
);

const ProductGallery = lazy(() =>
    import("./components/product/ProductGallery.jsx")
);

const Cart = lazy(() =>
    import("./components/order/Cart.jsx")
);

const Checkout = lazy(() =>
    import("./components/order/Checkout.jsx")
);

const LoginForm = lazy(() =>
    import("./components/auth/LoginForm.jsx")
);

const OTPForm = lazy(() =>
    import("./components/auth/OTPForm.jsx")
);

const OrderSuccess = lazy(() =>
    import("./components/order/OrderSuccess.jsx")
);

const MyOrders = lazy(() =>
    import("./components/order/MyOrders.jsx")
);

const Wishlist = lazy(() =>
    import("./components/user/Wishlist.jsx")
);

const UserProfile = lazy(() =>
    import("./components/user/UserProfile.jsx")
);

const ReviewForm = lazy(() =>
    import("./components/Review/ReviewForm.jsx")
);

const Adminanalytics = lazy(() =>
    import("./adminComponents/analytics/Adminanalytics.jsx")
);

const AdminGetUsers = lazy(() =>
    import("./adminComponents/user/AdminGetUsers.jsx")
);

const AdminProductForm = lazy(() =>
    import("./adminComponents/product/AdminProductForm.jsx")
);

const AdminOrder = lazy(() =>
    import("./adminComponents/order/AdminOrder.jsx")
);

const AppSwiperForm = lazy(() =>
    import("./components/common/AppSwiperForm.jsx")
);

const About = lazy(()=>
    import("./pages/About.jsx")
);

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
                <Routes>

                    <Route path="/" element={<Home />}>

                        <Route
                            index
                            element={
                                <>
                                    <AppSwiper />
                                    <HomeProductsByCategory />
                                </>
                            }
                        />

                        <Route
                            path="products"
                            element={<Product />}
                        />

                        <Route
                            path="about"
                            element={<About />}
                        />

                        <Route
                            path="login"
                            element={<LoginForm />}
                        />

                        <Route
                            path="otp"
                            element={<OTPForm />}
                        />

                        <Route element={<ProtectedRoutes />}>



                            <Route
                                path="orders"
                                element={<MyOrders />}
                            />

                            <Route
                                path="products/:productId"
                                element={<ProductGallery />}
                            />

                            <Route
                                path="profile"
                                element={<UserProfile />}
                            />

                            <Route
                                path="review"
                                element={<ReviewForm />}
                            />



                            <Route element={<UserRoutes />}>

                                <Route
                                    path="cart"
                                    element={<Cart />}
                                />

                                <Route
                                    path="wishlist"
                                    element={<Wishlist />}
                                />

                                <Route
                                    path="checkout"
                                    element={<Checkout />}
                                />

                                <Route
                                    path="order-success"
                                    element={<OrderSuccess />}
                                />

                            </Route>

                        </Route>

                        <Route element={<AdminRoutes />}>

                            <Route
                                path="admin"
                                element={<Adminanalytics />}
                            />

                            <Route
                                path="admin/users"
                                element={<AdminGetUsers />}
                            />

                            <Route
                                path="admin/products"
                                element={<Product />}
                            />

                            <Route
                                path="products/productForm"
                                element={<AdminProductForm />}
                            />

                            <Route
                                path="products/productForm/:productId"
                                element={<AdminProductForm />}
                            />

                            <Route
                                path="admin/orders"
                                element={<AdminOrder />}
                            />

                            <Route
                                path="admin/banner"
                                element={<AppSwiperForm />}
                            />

                        </Route>

                    </Route>

                </Routes>
            </Suspense>
        </BrowserRouter>
    </Provider>
);