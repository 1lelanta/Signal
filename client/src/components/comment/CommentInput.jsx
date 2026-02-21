import { useState } from "react";
import Input from "../ui/input";
import Button from "../ui/button";

const CommentInput = ({onSubmit, parentId = null})=>{
    const [text, setText] = useState("");

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(!text.trim()) return;

        onSubmit(text, parentId);
    };

    return(
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
            <Input 
            value={text}
            onChange={(e)=>setText(e.target.value)}
            placeholder="Write a comment..."
            />
            <Button type="submit">Post</Button>

        </form>
    )
}