import PostComposer from "../components/post/postComposer";
import PostList from "../components/post/PostList";
import { usePosts } from "../features/posts/usePosts";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const { posts, loading, createPost, hasMore, loadingMore, loadMore } = usePosts(null, q);

  return (
    <div className="w-full lg:max-w-4xl lg:mx-auto 2xl:max-w-5xl h-[calc(100vh-9rem)]">
      <div className="h-full overflow-y-auto no-scrollbar space-y-5">
        {/* Create Post */}
        <PostComposer onSubmit={createPost} />

        {/* Feed */}
        {loading ? (
          <div className="text-center py-10 text-sm text-slate-400">Loading posts...</div>
        ) : (
          <PostList
            posts={posts}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
          />
        )}
      </div>
    </div>
  );
}