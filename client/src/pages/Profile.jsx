import { useParams } from "react-router-dom";
import { useReputation } from "../features/reputation/useReputation";
import { usePosts } from "../features/posts/usePosts";
import ReputationProgress from "../components/reputation/ReputationProgress";
import PostList from "../components/post/PostList";

const Profile = () => {
  const { userId } = useParams();
  const { reputation } = useReputation(userId);
  const { posts } = usePosts(userId); // filtered version

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div className="bg-slate-900 p-6 rounded-xl text-center">
        <h2 className="text-xl font-bold">User Profile</h2>
        <p className="text-yellow-400 mt-2">
          ⭐ Reputation: {reputation}
        </p>

        <ReputationProgress score={reputation} />
      </div>

      <PostList posts={posts} />

    </div>
  );
};

export default Profile;