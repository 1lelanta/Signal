import PostComposer from "../components/post/PostComposer";
import PostList from "../components/post/PostList";
import { usePosts } from "../features/posts/usePosts";

const Home = () => {
  const { posts, loading } = usePosts();

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Create Post */}
      <PostComposer />

      {/* Feed */}
      {loading ? (
        <div className="text-center py-10">Loading posts...</div>
      ) : (
        <PostList posts={posts} />
      )}

    </div>
  );
};

export default Home;