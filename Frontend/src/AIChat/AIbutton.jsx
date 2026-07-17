import { Sparkles } from "lucide-react";


export const AIbutton = ({openHandler}) => {



    return (
        <>
            <button
                onClick={openHandler}
                className="fixed bottom-6 right-6
                    bg-primary
                    text-white
                    rounded-2xl
                    px-5 py-4
                    shadow-[0_0_40px_rgba(99,102,241,0.45)]
                    hover:shadow-[0_0_60px_rgba(99,102,241,0.7)]
                    transition duration-300 z-40 cursor-pointer"
                                >

                <div className="flex items-center gap-2">

                    <Sparkles />

                    Ask AI

                </div>

            </button>

        </>
    )
}