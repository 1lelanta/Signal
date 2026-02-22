const levles = [
    {label: "Newbie", min:0, max:50},
    {label: "Contributor", min:50, max:200},
    {label: "Advanced", min:200, max: 500},
    {label:"Expert", min:500, max:Infinity},
];

const ReputationProgress = ({score=0})=>{
    const currentLevel = levles.find((lvl)=> lvl.min && score<lvl.max);

    if(!currentLevel || currentLevel.max === Infinity)
        {return null;}
    const progress = ((score-currentLevel.min))*100;

    return(
        <div className="w-full mt-2">
            <p className="text-xs text-gray-400 mb-1">
                Progress to {levles[levles.indexOf(currentLevel)+1]?.label}
            </p>
                 <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
        </div>
    )
}

export default ReputationProgress;