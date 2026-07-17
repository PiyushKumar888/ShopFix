

import { Bot, User } from "lucide-react";

export const MessageBubble = ({ role, content }) => {

    const isAI = role === "assistant";

    return (

        <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>

            <div
                className={`flex gap-3 max-w-[85%] ${
                    !isAI && "flex-row-reverse"
                }`}
            >

                <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isAI
                            ? "bg-primary text-primary-content"
                            : "bg-base-300"
                    }`}
                >
                    {isAI ? <Bot size={18} /> : <User size={18} />}
                </div>

                <div
                    className={`rounded-3xl px-5 py-4 leading-7 ${
                        isAI
                            ? "bg-base-200 rounded-tl-md"
                            : "bg-primary text-primary-content rounded-tr-md"
                    }`}
                >
                    {content}
                </div>

            </div>

        </div>

    );
};