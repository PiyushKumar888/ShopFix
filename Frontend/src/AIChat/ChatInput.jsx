

import { SendHorizontal } from "lucide-react";
import {useState} from "react";

export const ChatInput = ({

                              loading,
                             AIhandler,
                          }) => {
    const [message, setMessage] = useState("");
    return (

        <div className="border-t border-base-300 bg-base-100 p-4">

            <div className="rounded-2xl border border-base-300 bg-base-200 flex items-end gap-3 p-3">

                <textarea
                    rows={1}
                    value={message}
                    onChange={(e)=>{
                        setMessage(e.target.value);
                    }}
                    placeholder="Ask ShopFix Assistant..."
                    className="flex-1 bg-transparent resize-none outline-none"
                />

                <button
                    onClick={()=>{

                        AIhandler(message)
                        setMessage("");

                    }}
                    disabled={loading || !message.trim()}
                    className="btn btn-primary btn-circle"
                >
                    {
                        loading
                            ? <span className="loading loading-spinner loading-sm"></span>
                            : <SendHorizontal size={18}/>
                    }
                </button>

            </div>

        </div>

    );
};