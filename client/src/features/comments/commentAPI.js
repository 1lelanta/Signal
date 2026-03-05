import api from "../../services/axios"

export const getCommentsByPost = async(postId)=>{
    const res = await api.get(`/comments/post/${postId}`);
    return res.data
}

export const uploadCommentImage = async(imageFile)=>{
    const formData = new FormData();
    formData.append("image", imageFile);
    const res = await api.post(`/comments/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export const createComment = async(postId, payload)=>{
    const res = await api.post(`/comments/${postId}`, payload)
    return res.data;
};

export const deleteComment = async(commentId)=>{
    const res = await api.delete(`/comments/${commentId}`);
    return res.data
}