import PostComposer from "../components/post/postComposer";
import PostList from "../components/post/PostList";
import { usePosts } from "../features/posts/usePosts";

export default function Home() {
  const { posts, loading, createPost, hasMore, loadingMore, loadMore } = usePosts();

  return (
    <div className="w-full space-y-6 lg:max-w-4xl lg:mx-auto 2xl:max-w-5xl">

      {/* Create Post */}
      <PostComposer onSubmit={createPost} />

      {/* Feed */}
      {loading ? (
        <div className="text-center py-10">Loading posts...</div>
      ) : (
        <PostList
          posts={posts}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={loadMore}
        />
      )}

    </div>
  );
}