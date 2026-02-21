import { Link } from "react-router-dom";

const Navbar = ()=>{
    return(
        <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
            <div className="max-w-7-xl font-semibold tracking-tight items-center justify-between">
                <Link to= "/" 
                className="text-xl font-semibold tracking-tighy text-purple-400">
                    SIGNAL

                </Link>
                
                <div className="flex items-center gap-4">
                    <Link to= "/profile"
                        className="text-sm text-slate-400 hover:text-purple-400 transition">
                    </Link>
                        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded-md
                        text-sm font-medium transition">
                            New Post
                        </button>
                </div>

            </div>


        </nav>
    )
}