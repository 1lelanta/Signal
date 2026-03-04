const getDepthStyle = (score)=>{
    if(score>80)
        return "bg-purple-600 text-white shadow-lg shadow-purple-700/40";
    if(score>40)
        return "bg-blue-600 text-white"
    return "bg-slate-700 text-slate-300"
}

const depthScoreBadge = ({score})=>{
    const normalized = Math.max(0, Math.min(100, Number(score) || 0));

    return(
        <div className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${getDepthStyle(
            score
        )}`}>
            <div className="flex items-center justify-between gap-3">
                <span>depth {score}</span>
                <span>{normalized}%</span>
            </div>

            <div className="w-full h-1.5 mt-2 rounded-full bg-slate-900/40 overflow-hidden">
                <div
                    className="h-full bg-blue-400 transition-all duration-300"
                    style={{ width: `${normalized}%` }}
                />
            </div>

        </div>
    )
}

export default depthScoreBadge;