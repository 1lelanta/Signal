import { useParams } from "react-router-dom";
import { usePosts } from "../features/posts/usePosts";
import CommentTree from "../components/comment/CommentTree";
import CommentInput from "../components/comment/CommentInput";

const PostDetails = () => {
  const { postId } = useParams();
  const { getPostById } = usePosts();

  const post = getPostById(postId);

  if (!post) {
    return <div className="text-center py-10">Post not found</div>;
  }

  return (
    <div className="w-full space-y-6 lg:max-w-4xl lg:mx-auto 2xl:max-w-5xl">

      <div className="bg-slate-900 p-4 rounded-xl">
        <h2 className="text-lg font-bold">{post.content}</h2>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post"
            className="mt-4 w-full max-h-[32rem] object-cover rounded-lg border border-slate-700"
          />
        )}
      </div>

      <CommentInput postId={postId} />
      <CommentTree postId={postId} />

    </div>
  );
};

export default PostDetails;