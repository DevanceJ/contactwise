import { VerifyForm } from "@/components/auth/verification-form";
import { Suspense } from "react";

const Verify = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyForm />
    </Suspense>
  );
};

export default Verify;
