import { VerifyForm } from "@/components/auth/verification-form";
import { Suspense } from "react";

const Verify = () => {
  <Suspense fallback={<div>Loading...</div>}>
    return <VerifyForm />;
  </Suspense>;
};

export default Verify;
