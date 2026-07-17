import {ProfileCard} from "../../components/user/ProfileCard.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-hot-toast";
import {PageLoader} from "../../components/loaders/PageLoader.jsx";
import api from "../../config/api.js";

const AdminGetUsers = () => {
    const[userProfiles, setUserProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchAllUsers =async () => {
        try{
            setLoading(true);
            const response =  await api
                .get(`/user/getusers`)
            setUserProfiles(response.data.data);
        }catch(err){
            console.log(err);
            toast.error("Failed to fetch users");
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchAllUsers();
    },[])
    if (loading){
        return (
            <PageLoader />
        )
    }
    return (
        <>
            {userProfiles.map((user) => (
                <ProfileCard avatar={user.avatar}
                             name={user.name}
                             key={user._id}
                             phone={user.phone}
                             email={user.email}
                             isAdminView={true}
                />
            ))}
        </>
    )
}

export default AdminGetUsers;