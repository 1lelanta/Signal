import { useEffect, useState } from "react";
import { getUserReputation } from "./reputationAPI";
import socket from "../../services/socket";

export const useReputation = (userId)=>{
    const [score, setScore] = useState(0)
    cosnt [loading,setLoading] = useState(false);

    const fetchReputation  = async()=>{
        try {
            setLoading(true);
            const data = await getUserReputation(userId)
            setScore(data.score)
        } catch (err) {
            console.error(err)
        } finally{
            setLoading(false)
        }
    };

    useEffect(()=>{
        if(!userId) return;
        fetchReputation();
        socket.connect();
        socket.emit("joinUserRoom", userId);

        socket.on("reputation:update",({userId:Id,score})=>{
            if(Id===userId){
                setScore(score)
            }
        });
        return () =>{
            socket.emit("leaveUserRoom", userId);
            socket.off("reputation:update");
            socket.disconnect();
        }
    }, [userId]);

    return {score, loading};
}