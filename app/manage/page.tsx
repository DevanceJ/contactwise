"use client";
import { RoleGate } from "@/components/auth/role-gate";
import { AddUserForm } from "@/components/tenant/add-member";

const ManagePage = () => {
  return (
    <RoleGate>
      <AddUserForm />
    </RoleGate>
  );
};

export default ManagePage;
