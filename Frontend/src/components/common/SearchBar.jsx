import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {SearchSuggestion} from "../product/SearchSuggestion.jsx";
import {useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";
import api from "../../config/api.js";



export const SearchBar = () => {
    const[input, setInput] = useState("");
    const[isOpen, setIsOpen] = useState(false);
    const[AIsearchedproducts, setAIsearchedproducts] = useState([]);
    const searchRef = useRef();

    const navigate = useNavigate();
    const sementicSearch = async (search,signal) =>{
        try{
            const response = await api
                .get(`/product/ai-search?query=${search}`,{
                    withCredentials: true,
                    signal:signal
                })

            setAIsearchedproducts(response.data.data);
            setIsOpen(true);
        }catch(err){
            if (axios.isCancel(err)) return;
            console.log(err);
            toast.error("failed to search");
        }
    }

    useEffect(() => {
        const handleClickSearch = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)
            ) {
               setIsOpen(false);
            }
        }
       document.addEventListener("mousedown", handleClickSearch);
        return () => {
            document.removeEventListener("mousedown", handleClickSearch);
        }
    },[])



    useEffect(() => {
        if (!input.trim()){
            setAIsearchedproducts([]);
            setIsOpen(false);
            return;
        }
        const controller = new AbortController();
       const debouncedQuery =  setTimeout(()=>{
            sementicSearch(input,controller.signal);
        },500)

        return () => {
           clearTimeout(debouncedQuery);
           controller.abort()
        }
    },[input])

    return (
        <>
            <div className="relative" ref={searchRef}>
                <label className="input"  >
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input type="search" required placeholder="Search"
                           onFocus={() => setIsOpen(true)}
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           onKeyDown={(e)=>{
                                if (e.key === "Enter"){
                                    if (!input.trim()) return;
                                    setIsOpen(false);
                                    navigate(`/products?query=${encodeURIComponent(input)}`);
                                }
                           }

                           }

                    />
                </label>
                <div className="absolute z-50 bg-base-100 shadow-lg rounded-lg ">
                    {
                        isOpen ?(<>
                            {
                                AIsearchedproducts.length>0?(
                                    <div>
                                        {AIsearchedproducts.slice(0,6)?.map((product,index) =>(
                                            <SearchSuggestion product={product} key={product._id} onClick={()=>{
                                                setIsOpen(false);
                                                navigate(`/products/${product._id}`)
                                            }}/>
                                        ))}

                                    </div>

                                ):(<></>)
                            }

                        </>):(<></>)
                    }
                </div>

            </div>


        </>
    )
}