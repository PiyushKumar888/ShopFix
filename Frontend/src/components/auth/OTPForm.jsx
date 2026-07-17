import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";
import {Spinner} from "../loaders/Spinner.jsx";
import api from "../../config/api.js";


const OTPForm = ({length=6}) =>{
    const [otp, setOTP] = useState(Array.from({length}).fill(""));
    const inputRefs = useRef([]);
    const user = useSelector(state => state.auth.user)
    const [loading, setLoading] = useState(false);
    const [resendloading, setResendloading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (inputRefs.current[0]){
            inputRefs.current[0].focus()
        }
    },[])
    const handleChange = (index,e) =>{
        const value = e.target.value;
        if (isNaN(value)){
            return null;
        }
        const newOTP = [...otp];
        newOTP[index] = value.substring(value.length-1);
        setOTP(newOTP);


        if (value && inputRefs.current[index+1] && index<length-1){
            inputRefs.current[index+1].focus();
        }

    }
    const handleClick = (index) =>{
        inputRefs.current[index].setSelectionRange(1,1)
    }
    const handleKeydown = (index,e) => {
        if (e.key === "Backspace"){
            if (inputRefs.current[index-1] && index>0){
                inputRefs.current[index-1].focus();
            }
        }
    }
    const verifyUser =async (combinedOTP) => {
        try{
            setLoading(true);
            const email = user?.email||localStorage.getItem("pendingemail");
            const response =await api
                .put(`/user/verify/${email}`,{
                    otp:combinedOTP,
                })
            navigate("/login")
        }catch(e){
            console.log(e)
            toast.error("Failed to verify email");
        }finally{
            setLoading(false);
        }
    }
    const Resend = async () =>{
        try{
            setResendloading(true);
            const email = user?.email||localStorage.getItem("pendingemail");

            const response = await api
                .get(`/user/resendOTP/${email}`)
            toast.success("OTP send successfully");
        }catch(e){
            console.log(e)
            toast.error("Failed to resend OTP")
        }finally{
            setResendloading(false);
        }

    }

    return(
        <>
                <div className="h-screen flex justify-center items-center w-full">
                    <div
                        className="
                        w-full max-w-md
                        mx-auto
                        rounded-3xl
                        border border-indigo-500/20
                      bg-slate-950/80
                        backdrop-blur-xl
                      shadow-[0_0_40px_rgba(99,102,241,0.15)]
                             p-8
                         "
                    >
                        <div className="flex justify-center mb-4">
                            <div
                                className="
                         w-14 h-14
                        rounded-full
                        bg-indigo-500/10
                        flex items-center justify-center
                        "
                        >
                            🔒
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center text-white">
                        Verify OTP
                    </h2>

                    <p className="text-center text-slate-400 mt-2">
                        Enter the 6-digit code sent to your email
                    </p>

                    <div className="flex justify-center gap-3 mt-8">
                        {otp.map((value, index) => (
                            <input
                                key={index}
                                value={value}
                                ref={(input)=>inputRefs.current[index]=input}
                                onChange={(e)=>handleChange(index, e)}
                                onClick={()=>handleClick(index, )}
                                onKeyDown={(e)=>handleKeydown(index, e)}
                                className="
                              w-14 h-14
                              rounded-xl
                              border border-indigo-500/30
                              bg-slate-900
                              text-white
                              text-xl
                              font-semibold
                              text-center
                              outline-none
                              transition-all
                              focus:border-indigo-400
                              focus:ring-2
                              focus:ring-indigo-500/30
                            "
                            />
                        ))}
                    </div>

                    <button
                        disabled={loading}
                        className="
                          w-full
                          mt-8
                          py-4
                          rounded-xl
                          bg-gradient-to-r
                          from-indigo-600
                          to-violet-500
                          text-white
                          font-semibold
                          hover:scale-[1.02]
                          transition-all
                        "

                        onClick={() => {
                            const combinedOTP = otp.join("");

                            if (combinedOTP.length !== length) {
                                toast.error("Please enter the complete OTP.");
                                return;
                            }

                            verifyUser(combinedOTP);
                        }}
                    >
                        {
                            loading?(
                                <Spinner className="w-5 h-5" />
                            ):(
                                "Verify OTP"
                            )
                        }

                    </button>

                    <p className="text-center text-slate-400 mt-5">
                        Didn't receive the code?
                        <button className="ml-2 text-indigo-400 hover:text-indigo-300 cursor-pointer"
                                disabled={resendloading}
                        onClick={()=>Resend()}
                        >
                            {
                                resendloading?(
                                    "Resending..."
                                ):("Resend")
                            }
                        </button>
                    </p>
                </div>
            </div>
        </>

    )
}

export default OTPForm