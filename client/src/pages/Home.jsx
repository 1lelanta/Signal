import PostComposer from "../components/post/postComposer";
import PostList from "../components/post/PostList";
import { usePosts } from "../features/posts/usePosts";

export default function Home() {
  const { posts, loading, createPost } = usePosts();

  return (
    <div className="w-full space-y-6">

      {/* Create Post */}
      <PostComposer onSubmit={createPost} />

      {/* Feed */}
      {loading ? (
        <div className="text-center py-10">Loading posts...</div>
      ) : (
        <PostList posts={posts} />
      )}

    </div>
  );
}