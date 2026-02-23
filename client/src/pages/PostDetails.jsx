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
    <div className="max-w-2xl mx-auto space-y-6">

      <div className="bg-slate-900 p-4 rounded-xl">
        <h2 className="text-lg font-bold">{post.content}</h2>
      </div>

      <CommentInput postId={postId} />
      <CommentTree postId={postId} />

    </div>
  );
};

export default PostDetails;