export const registerCommentSocket = (io,socket)=>{
    socket.on("joinPostRoom", (postId)=>{
        socket.join(`post_${postId}`)
    });
};

export const emitNewComment = (io,postId, comment)