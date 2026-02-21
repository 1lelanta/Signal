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

    const addComment = async(text, parentId=null)=>{
        try {
            const newComment = await createComment({
                postId,
                text,
                parentId
            });
            setComments((prev)=>[...prev, newComment])
        } catch (err) {
            console.error(err);
            
        }
    };
    useEffect(()=>{
        if(postId) fetchComments();
    }, [postId]);

    return {
        comments,
        loading,
        addComment,
        removeComment
    }

    
} 