import { useEffect, useState } from "react";
import { getCommentsByPost, createComment,deleteComment } from "./commentAPI";

export const useComments = (postId)=>{
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchComments = async()=>{
        try {
            setLoading(true);
            const data = await getCommentsByPost(postId);
            setComments(data)
        } catch (err) {
            console.error(err);
            
        }finally{
            setLoading(false);
        }
    };

    const addComment = async(text, parentId=null)=>
} 