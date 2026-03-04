import PostCard from "./PostCard";

const PostList = ({posts, hasMore = false, loadingMore = false, onLoadMore})=>{
    return(
        <div className="space-y-4">
            {posts.map((post)=>
            <PostCard key={post._id} post={post}/>)}

            {hasMore && (
                <div className="pt-2 flex justify-center">
                    <button
                        type="button"
                        onClick={onLoadMore}
                        disabled={loadingMore}
                        className="px-4 py-2 rounded-md text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-60"
                    >
                        {loadingMore ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}

        </div>
    )
}

export default PostList;