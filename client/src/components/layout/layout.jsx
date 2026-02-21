import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({children})=>{
    return(
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar/>
            <div className="flex">
                {/* desktop Sidebar */}
                <div className="hidden md:block">
                    <Sidebar/>
                </div>
                    {/* Main Content */}
                    <main className="flex-1 px-4 md:px-8 py-6 max-w-5xl mx-auto w-full">
                        {children}
                    </main>
            </div>

        </div>
    )
}

export default Layout