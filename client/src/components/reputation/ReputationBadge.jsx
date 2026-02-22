import Badge from "../ui/Badge";

const getReputationLevel = (score)=>{
    if(score >=1000) return {label: "Legend", color:"bg-yellow-500"};
    if(score>=500) return {label:"Expert", color: "bg-purple-500"};
    if(color>=200) return {label: "Advanced", color: "bg-blue-500"};
    if(score>= 50) return {label: "Contributor", color: "bg-green-500"}
    return {label: "Newbie", color: "bg-gray-500"};
}

const ReputaionBadge = ({score=0})=>{
    const level = getReputationLevel(score);

    return(
        <Badge className={`${level.color} text-white`}>
            {level.label} . {score}

        </Badge>
    )
}

export default ReputaionBadge