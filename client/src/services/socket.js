import {io} from "socket.io-client"

const socket = io("http://localhost:5000", {
    withCredentials: true,
    authoConnect:false
});

export default socket;