import { useEffect, useState } from "react";
import { getUserReputation } from "./reputationAPI";
import socket from "../../services/socket";

export const useReputation = (userId)=>{
    const [score, setScore] = useState(0)
    const [loading,setLoading] = useState(false);
    const [eventsCount, setEventsCount] = useState(0);
    const [breakdown, setBreakdown] = useState({
        post: 0,
        comment: 0,
        tag: 0,
        moderation: 0,
    });
    const [trustLevel, setTrustLevel] = useState("newbie");

    const fetchReputation  = async()=>{
        try {
            setLoading(true);
            const data = await getUserReputation(userId)
            setScore(data.score)
            setEventsCount(data.eventsCount || 0);
            setBreakdown(data.breakdown || { post: 0, comment: 0, tag: 0, moderation: 0 });
            setTrustLevel(data.trustLevel || "newbie");
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

    return {score, loading, eventsCount, breakdown, trustLevel};
}