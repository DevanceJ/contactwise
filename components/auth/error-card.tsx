import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CardWrapper } from "@/components/auth/card-wrapper";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Something went wrong"
      backButtonHref="/auth/login"
      backButtonLabel="Back to Login">
      <div className="flex w-full items-center justify-center">
        <ExclamationTriangleIcon />{" "}
        <span className="ml-2">An error occurred</span>
      </div>
    </CardWrapper>
  );
};
