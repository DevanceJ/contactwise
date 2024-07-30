import { Suspense } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="">{children}</div>
    </Suspense>
  );
};

export default AuthLayout;
