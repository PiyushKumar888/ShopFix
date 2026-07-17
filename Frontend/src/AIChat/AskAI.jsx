import {ChatHeader} from "./ChatHeader.jsx";
import {ChatInput} from "./ChatInput.jsx";
import {useState} from "react";
import axios from "axios";
import {MessageBubble} from "./MessageBubble.jsx";
import api from "../config/api.js";


const AskAI = ({closeHandler,product}) => {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const AIhandler = async (message) =>{
        if (!message.trim()) return;

        try{
            setMessages(prev => [
                ...prev,
                {
                    role: "user",
                    content: message,
                }
            ]);
            setLoading(true);
            const response = await api
                .post(`/ai/chat`,{
                    query:message,
                    productId:product._id,
                })

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: response.data.data,
                }
            ]);
        }catch(e){
            console.log(e);
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, I'm currently unavailable. Please try again in a moment.",
                }
            ]);
        }finally{
            setLoading(false);
        }
    }



    return (

        <>



            <div className="fixed right-0 top-0 h-screen w-[430px] bg-base-100 shadow-2xl border-l border-base-300 flex flex-col z-40">

                <ChatHeader openHandler={closeHandler} product={product} />

                <div className="flex-1 overflow-y-auto p-5 space-y-5">



                    {
                        messages.length > 0 ?(
                            messages?.map((message, index) => (
                                <MessageBubble content={message.content} key={`${message.role}-${index}`} role={message.role} />
                            ))
                        ):(
                            <>
                                {messages.length === 0 && (
                                    <div className="flex h-full items-center justify-center opacity-60">
                                        Ask me anything about this product ✨
                                    </div>
                                )}
                            </>
                        )
                    }



                </div>

                <ChatInput  AIhandler = {AIhandler} loading={loading} />

            </div>

        </>

    );

};

export default AskAI;