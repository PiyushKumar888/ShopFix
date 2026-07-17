import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_LINK,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

let logoutHandler  = null;

export const setLogoutHandler = (handler) =>{
    logoutHandler = handler;
}


const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;


            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return api(originalRequest);
                });
            }

            isRefreshing = true;

            try {
                await api.put("/user/refresh");

                processQueue(null);

                return api(originalRequest);
            } catch (err) {
                processQueue(err);

                if (logoutHandler){
                    logoutHandler();
                }

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;