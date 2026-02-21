import { useState } from "react";
import CommentInput from "./CommentInput";
import formatDate from "../../utils/formatDate";
import depthColor from "../../utils/depthColor";

const CommentItem = ({
    comment,
    addComment,
    removeComment,
    depth = 0,
})=>{
    const [showReply, setShowReply] = useState(false);

    return(
        <div className={`mt-3 p-3 rounded-xl border-1-4 ${depthColor(depth)}`}
        style={{marginLeft: depth*16}}>

            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-semibold">
                        {comment.author?.username}
                    </p>
                    <p>
                        {formatDate(comment.createdAt)}
                    </p>
                </div>
                <button onClick={()=>removeComment(comment._id)}
                    className="text-xs text-red-400">
                        Delete

                </button>

            </div>
            <p className="mt-2 text-sm">{comment.text}</p>
            <button onClick={()=>setShowReply(!showReply)}
                className="text-xs text-blue-400 mt-2">
                    reply
            </button>

            {showReply && (
                <CommentInput
                onSubmit={addComment}
                parentId={comment._id}
                />
            )};

            { comment.children?.map((child)=>(
                <commentItem 
                key={child._id}
                comment={child}
                addComment={addComment}
                removeComment={removeComment}
                depth={depth+1}
                />
            ))
            }

        </div>
    )
}

export default CommentItem