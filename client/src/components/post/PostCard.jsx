import { Link } from "react-router-dom";
import depthScoreBadge from "./DepthScoreBadge";

const PostCard = ({post})=>{
    return(
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-purple-600/40 transition duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <Link to={`/profile/${post.author._id}`} 
                className="text-sm font-medium text-slate-300 hover:text-purple-400">
                    {post.author.username}
                </Link>
                <p className="text-xs text-slate-500">
                    Reputation {post.author.reputationScore}
                </p>
            </div>
            <depthScoreBadge score={post.depthScore}/>

            {/* content */}

            <Link to={`/post/${post._id}`}>
            <p className="text-slate-200 leading-relaxed text-sm mb-4">
                {post.content}
            </p>
            </Link>

            {/* Footer */}
            <div className="flex justify-between text-xs text-slate-500">
                <span>{post.commentCount} discussions</span>
                <span>{post.uniqueParticipant} thinkers</span>

            </div>

        </div>
    )
}

export default PostCard