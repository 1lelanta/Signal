import api from "../../services/axios"

export const getCommentsByPost = async(postId)=>{
    const res = await api.get(`/comments/post/${postId}`);
    return res.data
}

export const createComment = async(payload)=>{
    const res = await api.post(`/comments`, payload)
};