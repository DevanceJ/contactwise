"use client";
import { TenantForm } from "@/components/tenant/tenant-form";
import { auth } from "@/auth";
import { RoleGate } from "@/components/auth/role-gate";
const Admin = () => {
  return (
    <RoleGate>
      <TenantForm />
    </RoleGate>
  );
};

export default Admin;
