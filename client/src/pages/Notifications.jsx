import { useAuth } from "../features/auth/useAuth";

const Notifications = () => {
  const { user } = useAuth();

  return (
    <div className="w-full space-y-6 lg:max-w-4xl lg:mx-auto 2xl:max-w-5xl">
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">Notifications</h1>
        <p className="text-slate-300 mt-2">
          {user
            ? "No new notifications right now."
            : "Please log in to view notifications."}
        </p>
      </section>
    </div>
  );
};

export default Notifications;