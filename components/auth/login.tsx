"use client";
import { useRouter } from "next/navigation";
interface LoginProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const Login = ({ children, mode = "redirect", asChild }: LoginProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push("/auth/login");
  };
  if (mode === "modal") {
    return <span>Implement</span>;
  }
  return (
    <span onClick={onClick} className="curson-pointer">
      {children}
    </span>
  );
};
