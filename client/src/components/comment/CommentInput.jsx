import { useState } from "react";
import { useAuth } from "../../features/auth/useAuth";
import { useTheme } from "../../app/themeContext";

const CommentInput = ({ onSubmit, parentId = null }) => {
    const { user } = useAuth();
    const { isWarm } = useTheme();
    const [text, setText] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim() && !imageFile) return;

        onSubmit(text, parentId, imageFile);
        setText("");
        setImageFile(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-2">
            <div className="flex items-start gap-3">
                <img
                    src={user?.avatar || `/img/default-avatar.png`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex-1">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
                        rows={parentId ? 2 : 3}
                        className={`w-full resize-none rounded-full px-4 py-2 text-sm focus:outline-none ${isWarm ? 'bg-slate-100 text-slate-900' : 'bg-slate-800 text-slate-100'}`}
                    />

                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-400 hover:text-slate-200">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                <span className="text-sm">Add image</span>
                            </label>

                            {imageFile && (
                                <span className="truncate text-xs text-slate-400 max-w-[200px]">{imageFile.name}</span>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={!text.trim() && !imageFile}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium ${text.trim() || imageFile ? 'bg-blue-600 text-white' : 'bg-slate-400 text-white/60 cursor-not-allowed'}`}
                            >
                                {parentId ? 'Reply' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CommentInput;