const variants = {
  primary: "bg-purple-600 hover:bg-purple-700 text-white",
  secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;