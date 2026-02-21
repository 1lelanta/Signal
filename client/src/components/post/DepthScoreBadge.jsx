const getDepthStyle = (score)=>{
    if(score>80)
        return "bg-purple-600 text-white shadow-lg shadow-purple-700/40";
    if(score>40)
        return "bg-blue-600 text-white"
    return "bg-slate-700 text-slate-300"
}

const depthScoreBadge = ({score})=>{
    return(
        <div className={`px-3 py-1 rounded-full text-xs font-semibold transition ${getDepthStyle(
            score
        )}`}>
            depth {score}

        </div>
    )
}

export default depthScoreBadge;