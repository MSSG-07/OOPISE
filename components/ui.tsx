export const Button = ({
  children,
  className = "",
  ...props
}: any) => {
  return (
    <button
      {...props}
      className={`rounded-full bg-sage px-6 py-4 font-medium text-deep-forest transition-all hover:opacity-90 ${className}`}
    >
      {children}
    </button>
  );
};

export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`rounded-[24px] bg-sand p-5 ${className}`}>
      {children}
    </div>
  );
};