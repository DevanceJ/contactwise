"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/verification";
import { LoadingSpinner } from "../ui/spinner";
import { FormErr } from "../form-err";
import { FormSuc } from "../form-suc";

export const VerifyForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const checkToken = useCallback(() => {
    if (error || success) return;
    if (!token) {
      setError("No token found!");
      return;
    }
    newVerification(token).then((data) => {
      setSuccess(data.success);
      setError(data.error);
    });
  }, [token, success, error]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);
  return (
    <CardWrapper
      headerLabel="Verifying..."
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex w-full items-center justify-center">
        {!error && !success && <LoadingSpinner />}
        <FormSuc message={success} />
        {!success && <FormErr message={error} />}
      </div>
    </CardWrapper>
  );
};
