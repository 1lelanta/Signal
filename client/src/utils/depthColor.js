export const depthColor = (depth) => {
  if (depth <= 2) return "bg-green-500/20 text-green-400";
  if (depth <= 5) return "bg-blue-500/20 text-blue-400";
  if (depth <= 10) return "bg-purple-500/20 text-purple-400";
  return "bg-red-500/20 text-red-400";
};

export default depthColor;