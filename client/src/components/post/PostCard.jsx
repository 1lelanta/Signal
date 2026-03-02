import { Link } from "react-router-dom";
import DepthScoreBadge from "./DepthScoreBadge";

const PostCard = ({post})=>{
    return(
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-purple-600/40 transition duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 mb-3">
                <Link to={`/profile/${post.author._id}`} 
                className="text-sm font-medium text-slate-300 hover:text-purple-400 break-all">
                    {post.author.username}
                </Link>
                <p className="text-xs text-slate-500 sm:text-right">
                    Reputation {post.author.reputationScore}
                </p>
            </div>
            <DepthScoreBadge score={post.depthScore}/>

            {/* content */}

            <Link to={`/post/${post._id}`}>
            <p className="text-slate-200 leading-relaxed text-sm mb-4 break-words">
                {post.content}
            </p>
            </Link>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-500">
                <span>{post.commentCount} discussions</span>
                <span>{post.uniqueParticipant} thinkers</span>

            </div>

        </div>
    )
}

export default PostCard