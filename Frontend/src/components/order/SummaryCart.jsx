import {useNavigate} from "react-router-dom";


export const SummaryCart = ({charges=0,subtotal=0}) =>{
    const isShippingFree = subtotal >= 2000;
    const finalShippingCost = !isShippingFree ? 0 : charges;
    const estimatedTotal = subtotal + finalShippingCost;
    const navigate = useNavigate();

    return (
        <>
            <div className="card w-full max-w-sm bg-[#0f172a]/40 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl">
                <div className="card-body p-6">


                    <div className="border-b border-slate-800/60 pb-4">
                        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
                            Order Summary
                        </h2>
                    </div>


                    <ul className="mt-5 flex flex-col gap-3.5 text-sm">
                        <li className="flex justify-between items-center text-slate-400">
                            <span>Subtotal</span>
                            <span className="font-semibold text-slate-200">
                    ₹{subtotal.toLocaleString('en-IN')}
                </span>
                        </li>

                        <li className="flex justify-between items-center text-slate-400">
                            <span>Shipping & Handling</span>
                            {!isShippingFree ? (
                                <span className="font-semibold text-emerald-400 uppercase tracking-wider text-xs bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                Free
                            </span>
                            ) : (
                                <span className="font-semibold text-slate-200">
                                ₹{charges}
                            </span>
                            )}
                        </li>

                        <li className="flex justify-between items-center text-slate-400">
                            <span>Estimated Taxes</span>
                            <span className="font-semibold text-slate-200">₹0</span>
                        </li>


                        <li className="border-t border-slate-800/80 my-2"></li>


                        <li className="flex justify-between items-baseline">
                            <span className="text-base font-bold text-slate-100">Total</span>
                            <span className="text-2xl font-black text-slate-100 tracking-tight">
                    ₹{(estimatedTotal).toLocaleString('en-IN')}
                </span>
                        </li>
                    </ul>


                    <div className="card-actions mt-6">
                        <button className="btn btn-primary btn-block rounded-xl font-bold tracking-wide shadow-lg shadow-primary/20 normal-case transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                        onClick={()=>{
                            navigate("/checkout",{
                                state:{estimatedTotal}
                            })
                        }}
                        >
                            Proceed to Checkout
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 ml-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
        </>

    )
}