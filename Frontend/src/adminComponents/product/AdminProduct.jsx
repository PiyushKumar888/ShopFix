
import {ProductCard} from "../../components/product/ProductCard.jsx";


export const AdminProduct = () => {
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
                                    Product Management
                                </h1>

                                <p className="text-gray-400 mt-2">
                                    Manage your catalog, inventory and product listings.
                                </p>

                            </div>


                            {
                                products?.length > 0 ? (

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                                        {
                                            products.map((product, index) => (

                                                <ProductCard
                                                    key={product._id}
                                                    productname={product.name}
                                                    alt={product.name}
                                                    imageUrl={product?.variants?.[0]?.images?.[0]}
                                                    description={product.description}
                                                    isAdmin={true}
                                                />

                                            ))
                                        }

                                    </div>

                                ) : (

                                    <div className="h-96 flex justify-center items-center text-gray-400">
                                        No Products Found
                                    </div>

                                )
                            }


                            <div className="flex justify-center mt-14">

                                <div className="join">

                                    <button className="join-item btn btn-outline">
                                        1
                                    </button>

                                    <button className="join-item btn btn-outline">
                                        2
                                    </button>

                                    <button className="join-item btn btn-outline">
                                        3
                                    </button>

                                    <button className="join-item btn btn-outline">
                                        4
                                    </button>

                                </div>

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

                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary"
                                        />
                                        Clothes
                                    </label>

                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary"
                                        />
                                        Electronics
                                    </label>

                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary"
                                        />
                                        Sports
                                    </label>

                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary"
                                        />
                                        Shoes
                                    </label>

                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary"
                                        />
                                        Accessories
                                    </label>

                                </div>

                            </div>


                            <div className="mb-10">

                                <h3 className="font-semibold mb-4">
                                    Price Range
                                </h3>

                                <input
                                    type="range"
                                    min="0"
                                    max="100000"
                                    defaultValue="40000"
                                    className="range range-primary"
                                />

                                <div className="flex justify-between mt-2 text-sm text-gray-400">

                                    <span>₹0</span>

                                    <span>₹100000</span>

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
                                    defaultValue="4"
                                    className="range range-primary"
                                />

                                <div className="flex justify-between mt-2 text-sm text-gray-400">

                                    <span>1★</span>

                                    <span>5★</span>

                                </div>

                            </div>


                           <div className="mb-10 space-y-4">
                               <button className="btn btn-primary w-full">
                                   Clear Filters
                               </button>
                               <button
                                   className="
                                    btn
                                    w-full
                                    mt-6
                                    bg-green-600
                                    hover:bg-green-700
                                    border-none
                                    text-white
                                    font-semibold
                                    "
                               >
                                   + Add Product
                               </button>
                           </div>

                        </aside>

                    </div>

                </div>

            </div>
        </>
    )
}