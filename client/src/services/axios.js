import axios from "axios"

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
    withCredentials:true,
});

// if a token exists from a previous session, set it so early requests include Authorization
try{
    const _token = localStorage.getItem("token");
    if(_token){
        api.defaults.headers.common = api.defaults.headers.common || {};
        api.defaults.headers.common.Authorization = `Bearer ${_token}`;
    }
}catch(e){}

//atach token authomatically
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");

    if(token){
        // set both header shapes to be safe
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        if(!config.headers.common) config.headers.common = {};
        config.headers.common.Authorization = `Bearer ${token}`;
    }
    // debug: log outgoing request url and Authorization header
    try{
        // avoid leaking token in production logs; this is a dev helper
        // eslint-disable-next-line no-console
        console.log("Outgoing request:", config.url, "Authorization:", config.headers.Authorization);
    }catch(e){}
    return config
});

// handle global errors
api.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response?.status  === 401){
            // debug: log which request got a 401
            // eslint-disable-next-line no-console
            console.warn("Unauthorized. Redirect to login.", error.config?.url || error.request?.responseURL);
        }
        return Promise.reject(error);
    }
    )

    export default api
