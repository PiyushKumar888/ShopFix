import { Sparkles, X } from "lucide-react";

export const ChatHeader = ({ product, openHandler }) => {
    return (
        <div className="sticky top-0 z-10 border-b border-base-300 bg-base-100/90 backdrop-blur-lg">

            <div className="flex items-center justify-between px-5 py-4">

                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">

                        <Sparkles className="text-primary" size={22} />

                    </div>

                    <div>

                        <h2 className="font-bold text-lg">
                            ShopFix Assistant
                        </h2>

                        <p className="text-xs opacity-60">
                            Ask anything about this product
                        </p>

                    </div>

                </div>

                <button
                    onClick={openHandler}
                    className="btn btn-circle btn-ghost"
                >
                    <X size={18} />
                </button>

            </div>

            <div className="px-5 pb-4">

                <div className="rounded-xl bg-base-200 p-3 flex items-center gap-3">

                    <img
                        src={product?.variants?.[0]?.images?.[0]}
                        alt={product?.name}
                        className="w-12 h-12 rounded-lg object-cover"
                    />

                    <div>

                        <p className="text-xs opacity-60">
                            Current Product
                        </p>

                        <h3 className="font-semibold">
                            {product?.name}
                        </h3>

                    </div>

                </div>

            </div>

        </div>
    );
};