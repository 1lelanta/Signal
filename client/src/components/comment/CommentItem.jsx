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
    const nestedOffset = Math.min(depth, 4) * 12;

    return(
        <div className={`mt-3 p-3 rounded-xl border ${depthColor(depth)} w-full`}
        style={{marginLeft: nestedOffset}}>

            <div className="flex justify-between items-start sm:items-center gap-2">
                <div className="min-w-0">
                    <p className="text-sm font-semibold">
                        {comment.author?.username}
                    </p>
                    <p className="text-xs text-slate-400">
                        {formatDate(comment.createdAt)}
                    </p>
                </div>
                <button onClick={()=>removeComment(comment._id)}
                    className="text-xs text-red-400 shrink-0">
                        Delete

                </button>

            </div>
                        <p className="mt-2 text-sm break-words">{comment.content || ""}</p>
                        {comment.imageUrl && (
                                <img
                                    src={comment.imageUrl}
                                    alt="Comment"
                                    className="mt-2 w-full max-h-72 object-cover rounded-lg border border-slate-700"
                                />
                        )}
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