import { useEffect, useState } from "react";
import { getCommentsByPost, createComment, deleteComment, uploadCommentImage } from "./commentAPI";

import socket from "../../services/socket"

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

    const addComment = async(content, parentId=null, imageFile=null)=>{
        try {
            let imageUrl = null;

            if (imageFile) {
                const uploaded = await uploadCommentImage(imageFile);
                imageUrl = uploaded?.imageUrl || null;
            }

            const newComment = await createComment(postId, {
                content,
                parentCommentId: parentId,
                imageUrl,
            });

            if (newComment?._id) {
                setComments((prev) => [...prev, newComment]);
            }
            
        } catch (err) {
            console.error(err);
            
        }
    };

    const removeComment = async(id)=>{
        try {
            await deleteComment(id)
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(()=>{
        if(!postId) return;

        fetchComments();
        socket.connect();

        socket.emit("joinPost", postId);

        socket.on("comment:new",(comment)=>{
            if(comment.postId===postId){
                setComments((prev)=>[...prev,comment])
            }
        })

          socket.on("comment:delete", (commentId) => {
      setComments((prev) =>
        prev.filter((c) => c._id !== commentId)
      );
    });

    return () => {
      socket.emit("leavePost", postId);
      socket.off("comment:new");
      socket.off("comment:delete");
      socket.disconnect();
    };
  }, [postId]);

  return {
    comments,
    loading,
    addComment,
    removeComment,
  };
};
