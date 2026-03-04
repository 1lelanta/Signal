import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

const CommentInput = ({onSubmit, parentId = null})=>{
    const [text, setText] = useState("");

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(!text.trim()) return;

        onSubmit(text, parentId);
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

        </form>
    )
}

export default CommentInput