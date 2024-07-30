const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center bg-muted/40">
      {children}
    </div>
  );
};

export default AuthLayout;
