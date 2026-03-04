import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import socket from "../services/socket";
import {
  getConversation,
  getMessageUsers,
  getUnreadMessagesCount,
  sendPrivateMessage,
  uploadMessageImage,
} from "../features/messages/messagesAPI";

const Messages = () => {
  const { user } = useAuth();
  const myId = user?._id || user?.id;

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUserId, setActiveUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const activeUser = useMemo(
    () => users.find((u) => String(u._id) === String(activeUserId)),
    [users, activeUserId]
  );

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      String(u.username || "").toLowerCase().includes(q)
    );
  }, [users, searchTerm]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        await getUnreadMessagesCount();
        const data = await getMessageUsers();
        setUsers(Array.isArray(data) ? data : []);
        if (data?.length) setActiveUserId(data[0]._id);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (!activeUserId) {
      setMessages([]);
      return;
    }

    const loadConversation = async () => {
      try {
        setLoadingMessages(true);
        const data = await getConversation(activeUserId);
        setMessages(Array.isArray(data) ? data : []);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadConversation();
  }, [activeUserId]);

  useEffect(() => {
    if (!myId) return;

    socket.connect();
    socket.emit("registerUser", String(myId));

    const onIncoming = (message) => {
      const fromActiveUser = String(message?.sender) === String(activeUserId);
      const toMe = String(message?.receiver) === String(myId);
      if (fromActiveUser && toMe) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("message:new", onIncoming);
    return () => {
      socket.off("message:new", onIncoming);
      socket.disconnect();
    };
  }, [myId, activeUserId]);

  const handleSend = async (e) => {
    e.preventDefault();
    const message = text.trim();
    if ((!message && !imageFile) || !activeUserId) return;

    try {
      setSending(true);
      let imageUrl = null;
      if (imageFile) {
        const uploaded = await uploadMessageImage(imageFile);
        imageUrl = uploaded?.imageUrl || null;
      }

      const newMessage = await sendPrivateMessage(activeUserId, {
        text: message,
        imageUrl,
      });
      setMessages((prev) => [...prev, newMessage]);
      setText("");
      setImageFile(null);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full lg:max-w-6xl lg:mx-auto 2xl:max-w-7xl">
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-[260px_1fr] min-h-[65vh]">
        <aside className="border-r border-slate-800 p-3">
          <h2 className="text-sm font-semibold text-slate-200 mb-3">Messages</h2>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full mb-3 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {loadingUsers ? (
            <p className="text-xs text-slate-400">Loading users...</p>
          ) : filteredUsers.length ? (
            <div className="space-y-1">
              {filteredUsers.map((u) => (
                <button
                  key={u._id}
                  type="button"
                  onClick={() => setActiveUserId(u._id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                    String(activeUserId) === String(u._id)
                      ? "bg-purple-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {u.username}
                </button>
              ))}
            </div>
          ) : users.length ? (
            <p className="text-xs text-slate-400">No users match your search.</p>
          ) : (
            <p className="text-xs text-slate-400">No users found.</p>
          )}
        </aside>

        <section className="flex flex-col">
          <div className="px-4 py-3 border-b border-slate-800 text-sm text-slate-300">
            {activeUser ? `Chat with ${activeUser.username}` : "Select a user"}
          </div>

          <div className="flex-1 p-4 space-y-2 overflow-y-auto max-h-[50vh]">
            {loadingMessages ? (
              <p className="text-xs text-slate-400">Loading conversation...</p>
            ) : messages.length ? (
              messages.map((m) => {
                const mine = String(m.sender) === String(myId);
                return (
                  <div
                    key={m._id}
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      mine
                        ? "ml-auto bg-blue-600 text-white"
                        : "mr-auto bg-slate-800 text-slate-200 border border-slate-700"
                    }`}
                  >
                    {m.text ? <p>{m.text}</p> : null}
                    {m.imageUrl ? (
                      <img
                        src={m.imageUrl}
                        alt="message"
                        className="mt-2 max-w-full rounded-md border border-slate-700"
                      />
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400">No messages yet.</p>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-slate-800 p-3">
            <div className="relative">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={activeUser ? "Type a private message..." : "Select a user first"}
                disabled={!activeUserId || sending}
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 pr-36 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              />
              <label className="absolute right-16 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md text-xs font-medium border border-slate-600 text-slate-300 hover:border-slate-500 cursor-pointer">
                📷
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={!activeUserId || sending}
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </label>
              <button
                type="submit"
                disabled={!activeUserId || sending || (!text.trim() && !imageFile)}
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {sending ? "..." : "Send"}
              </button>
            </div>
            {imageFile && (
              <p className="mt-2 text-xs text-slate-400">Attached: {imageFile.name}</p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};

export default Messages;