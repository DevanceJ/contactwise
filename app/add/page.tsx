import { TenantForm } from "@/components/tenant/tenant-form";
import { auth } from "@/auth";
import { RoleGate } from "@/components/auth/role-gate";
const Admin = async () => {
  return (
    <RoleGate>
      <TenantForm />
    </RoleGate>
  );
};

export default Admin;
