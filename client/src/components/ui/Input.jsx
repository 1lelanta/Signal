const Input = ({
  className = "",
  ...props
}) => {
  return (
    <input
      className={`w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
      {...props}
    />
  );
};

export default Input;