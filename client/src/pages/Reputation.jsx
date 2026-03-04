import { useAuth } from "../features/auth/useAuth";
import { useReputation } from "../features/reputation/useReputation";
import ReputationProgress from "../components/reputation/ReputationProgress";

const Reputation = () => {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const { score, loading } = useReputation(userId);

  return (
    <div className="w-full space-y-6 lg:max-w-4xl lg:mx-auto 2xl:max-w-5xl">
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">Reputation</h1>
        {loading ? (
          <p className="text-slate-300 mt-3">Loading reputation...</p>
        ) : (
          <>
            <p className="text-slate-300 mt-3">Current score: <span className="text-yellow-400 font-semibold">{score}</span></p>
            <div className="mt-4">
              <ReputationProgress score={score} />
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Reputation;