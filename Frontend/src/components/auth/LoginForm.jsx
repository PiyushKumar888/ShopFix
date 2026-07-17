import { useState} from "react";
import { useForm } from "react-hook-form"
import api  from "../../config/api.js";
import {useDispatch} from "react-redux";
import {setUser} from "../../features/auth/authSlice.js";
import {useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";
import {Spinner} from "../loaders/Spinner.jsx";


const LoginForm = () => {

    const[isLoginMode, setIsLoginMode] = useState(true);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()
    const onSubmit = (data) =>{
        if (isLoginMode) {

            setLoading(true);
            const login = async () =>{
                try{
                    const response = await api
                        .post(`/user/login`, {
                            email: data.email,
                            password: data.password,
                        });

                    dispatch(setUser(response.data.data.user));
                    toast.success("Logged in successfully!");
                    navigate("/")
                }catch(err){
                    console.log(err);
                    toast.error("Failed to log in!");
                }finally{
                    setLoading(false);
                }

            }
            login()

        }
        else{

            setIsLoginMode(true);
            const register = async () =>{
                try{
                    const response = await api
                        .post(`/user/register`, data);


                    localStorage.setItem("pendingemail",(response.data.data.email));
                    dispatch(setUser(response.data.data));
                    navigate("/otp")


                }catch(err){
                    console.log(err)
                    toast.error("Failed to register!");
                }finally{
                    setLoading(false);
                }

            }
            register()

        }

    }




    return (

        <div >
           <form onSubmit={handleSubmit(onSubmit)}>
               <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
                   <fieldset className="fieldset w-full max-w-md bg-base-200 border border-base-300 rounded-2xl p-8 shadow-xl">

                       <div className="mb-6 text-center">
                           {isLoginMode?(
                               <>
                                   <h2 className="text-3xl font-bold">Welcome Back</h2>
                                   <p className="text-sm opacity-70 mt-2">
                                       Login to continue your account
                                   </p>
                               </>

                           ):(
                               <>
                                   <h2 className="text-3xl font-bold">Welcome to ShopFix</h2>
                                   <p className="text-sm opacity-70 mt-2">
                                       Please create an account
                                   </p>
                               </>
                           )}


                       </div>

                       {!isLoginMode ? (
                           <div className="space-y-2 mb-2">
                               <label className="label font-medium">Username</label>

                               <input
                                   type="text"
                                   className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                                   placeholder="Enter your username"
                                   {...register("name", { required: true })}
                               />
                               {errors.name && <span>This field is required</span>}
                           </div>
                       ) : null}

                       <div className="space-y-2 mb-4">
                           <label className="label font-medium">Email</label>

                           <input
                               type="email"
                               className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                               placeholder="Enter your email"
                               {...register("email", { required: true })}
                           />
                           {errors.email && <span>This field is required</span>}
                       </div>

                       <div className="space-y-2">
                           <div className="flex items-center justify-between">
                               <label className="label font-medium">Password</label>


                           </div>

                           <input
                               type="password"
                               className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                               placeholder="Enter your password"
                               {...register("password", { required: true })}
                           />
                           {errors.password && <span>This field is required</span>}
                       </div>

                       <button className="btn btn-primary w-full mt-6 rounded-xl text-base font-semibold hover:scale-[1.01] transition-all duration-300"
                       disabled={loading}
                       >
                           {
                               loading?(
                                   <Spinner className={"w-5 h-5"} />
                               ):(
                                   !isLoginMode ? "Signup":"Login"
                               )
                           }
                       </button>

                       <p className="text-center text-sm mt-5 opacity-70">
                           Don&apos;t have an account?{" "}
                           <button className="text-primary font-medium cursor-pointer hover:underline"
                                   type="button"
                           onClick={()=> setIsLoginMode(!isLoginMode)}
                           >
                               {isLoginMode ? "Signup" : "Login"}
                    </button>
                       </p>
                   </fieldset>
               </div>

           </form>
        </div>
    );
}

export default LoginForm