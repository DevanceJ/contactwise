"use client";
import { useCurrentUser } from "@/hooks/use-current-user";
interface RoleGateProps {
  children: React.ReactNode;
}

export const RoleGate = ({ children }: RoleGateProps) => {
  const user = useCurrentUser();
  if (user?.isAdmin) {
    return <>{children}</>;
  }
  return null;
};
