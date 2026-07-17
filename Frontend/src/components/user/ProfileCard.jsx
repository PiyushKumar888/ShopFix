import axios from "axios";
import { toast } from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {logoutUser} from "../../features/auth/authSlice.js";


export const ProfileCard = ({email,avatar,name,phone,isAdminView}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const logoutHandler =() => {
        const logout = async () => {
            try{
                const response = await axios
                    .put(`/user/logout`)
                dispatch(logoutUser());

                toast.success("Logged out successfully!");
                navigate('/login')
             }catch(err){

                toast.error("Failed to log out. Please try again.");
            }
        }
      logout();
    }
    return (
        <>


            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.7)]">

                <div className="flex flex-col sm:flex-row gap-10 sm:gap-14 items-start">

                    <div className="flex flex-col items-center sm:items-start shrink-0">

                        <div className="relative group">

                            <div className="absolute -inset-0.5 bg-gradient-to-tr from-zinc-700 to-zinc-400 rounded-full opacity-30 blur-sm"></div>

                            <div className="relative w-28 h-28 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900">

                                {avatar ? (
                                    <img
                                        src={avatar}
                                        alt={name}
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl font-light text-zinc-500">
                                        {name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isAdminView ? (
                            <button className="mt-6 px-4 py-2 text-sm rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
                                    onClick={logoutHandler}
                            >
                                Logout
                            </button>
                        ):(<></>)}

                    </div>



                    <div className="flex-1 w-full">

                        <div className="border-b border-zinc-900 pb-6">

                            <h1 className="text-3xl font-light tracking-tight text-zinc-100">
                                {name}
                            </h1>

                            <p className="text-sm text-zinc-500 mt-2">
                                Account Member
                            </p>

                        </div>


                        <div className="grid sm:grid-cols-2 gap-6 mt-8">

                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">
                                    Email Address
                                </p>

                                <p className="text-sm text-zinc-300 break-all">
                                    {email}
                                </p>
                            </div>


                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">
                                    Phone Number
                                </p>

                                <p className="text-sm text-zinc-300">
                                    {phone}
                                </p>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </>

    )
}