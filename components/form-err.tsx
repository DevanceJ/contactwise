import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormErrProps {
  message?: string;
}

export const FormErr = ({ message }: FormErrProps) => {
  if (!message) return null;
  return (
    <div className="bg-destructive/30 rounded-md p-2 gap-x-2 text-sm text-destructive flex items-center">
      <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
      <span>{message}</span>
    </div>
  );
};
