import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

const CommentInput = ({onSubmit, parentId = null})=>{
    const [text, setText] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(!text.trim() && !imageFile) return;

        onSubmit(text, parentId, imageFile);
        setText("");
        setImageFile(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
    };

    return(
        <form onSubmit={handleSubmit} className="mt-2">
            <div className="relative">
                <Input 
                value={text}
                onChange={(e)=>setText(e.target.value)}
                placeholder="Write a comment..."
                className="pr-20"
                />
                <Button
                    type="submit"
                    aria-label="Submit comment"
                    className="!bg-blue-600 hover:!bg-blue-700 !text-white border-0 !px-3 !py-1.5 absolute right-1 top-1/2 -translate-y-1/2"
                >
                    Post
                </Button>
            </div>

            <div className="mt-2 flex items-center justify-between gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-400 hover:text-slate-200">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    Add image
                </label>

                {imageFile && (
                    <span className="truncate text-xs text-slate-300 max-w-[200px]">
                        {imageFile.name}
                    </span>
                )}
            </div>

        </form>
    )
}

export default CommentInput