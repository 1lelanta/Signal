import { useAuth } from "../features/auth/useAuth";
import { useReputation } from "../features/reputation/useReputation";
import ReputationProgress from "../components/reputation/ReputationProgress";

const Reputation = () => {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const { score, loading, eventsCount, breakdown, trustLevel } = useReputation(userId);

  return (
    <div className="w-full space-y-6 lg:max-w-4xl lg:mx-auto 2xl:max-w-5xl">
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">Reputation</h1>
        {loading ? (
          <p className="text-slate-300 mt-3">Loading reputation...</p>
        ) : (
          <>
            <p className="text-slate-300 mt-3">Current score: <span className="text-yellow-400 font-semibold">{score}</span></p>
            <p className="text-slate-300 mt-1">Trust level: <span className="text-purple-400 font-semibold capitalize">{trustLevel}</span></p>
            <p className="text-slate-400 text-sm mt-1">Calculated from {eventsCount} reputation events.</p>
            <div className="mt-4">
              <ReputationProgress score={score} />
            </div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2 text-slate-300">
                Post points: <span className="text-white font-medium">{breakdown.post}</span>
              </div>
              <div className="bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2 text-slate-300">
                Comment points: <span className="text-white font-medium">{breakdown.comment}</span>
              </div>
              <div className="bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2 text-slate-300">
                Tag points: <span className="text-white font-medium">{breakdown.tag}</span>
              </div>
              <div className="bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2 text-slate-300">
                Moderation points: <span className="text-white font-medium">{breakdown.moderation}</span>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Reputation;