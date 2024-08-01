"use client";
import { RoleGate } from "@/components/auth/role-gate";
import { MemberForm } from "@/components/tenant/add-mem";

const ManagePage = () => {
  return (
    <RoleGate>
      <MemberForm />
    </RoleGate>
  );
};

export default ManagePage;
