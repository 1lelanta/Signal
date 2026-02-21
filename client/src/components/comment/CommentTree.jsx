import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import  {useComments} from "../../features/comments/useComments"
import Spinner from "../ui/Spinner";

const CommentTree = ({postId})=>{
    const {comments, loading, addComment, removeComment}= useComments(postId);
    if(loading) return <Spinner/>;

    return(
        <div className="mt-6">
            <CommentInput onSubmit={addComment}/>

            {comments.map((comment)=>(
                <CommentItem
                    key={comment._id}
                    comment={comment}
                    addComment={addComment}
                    removeComment={removeComment}

                />
            ))}

        </div>
    )
}

export default CommentTree;