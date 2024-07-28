import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

interface FormSucProps {
  message?: string;
}

export const FormSuc = ({ message }: FormSucProps) => {
  if (!message) return null;
  return (
    <div className="bg-emerald-600/30 rounded-md p-2 gap-x-2 text-sm text-emerald-600 flex items-center">
      <CheckCircledIcon className="w-4 h-4 mr-2" />
      <span>{message}</span>
    </div>
  );
};
