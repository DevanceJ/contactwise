"use client";
import Link from "next/link";
import {
  Cross2Icon,
  HamburgerMenuIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import RemoveAlert from "@/components/home/alert";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { NavSkeleton } from "@/components/ui/skeleton-home";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Prisma, Member } from "@prisma/client";
import axios from "axios";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tenant, Role } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { SideNavSkeleton } from "@/components/ui/skeleton-sidenav";
import { HomeTableSkeleton } from "@/components/ui/home-table-skeleton";
import { EditTenantDialog } from "@/components/home/edit";

type MemberWithUser = Prisma.MemberGetPayload<{
  include: {
    user: true;
  };
}>;

const Home = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [members, setMembers] = useState<MemberWithUser[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberWithUser | null>(
    null,
  );
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [managers, setManagers] = useState<MemberWithUser[]>([]);
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [deleteTenantDialogOpen, setDeleteTenantDialogOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null);
  const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<MemberWithUser | null>(
    null,
  );
  const session = useSession();
  const status = session.status;
  const user = session.data?.user;
  const searchParam = useSearchParams();

  const fetchTenants = async () => {
    try {
      setLoadingTenants(true);
      if (user?.isAdmin) {
        const response = await axios.get(`/api/admin/tenants`);
        setTenants(response.data);
      } else {
        // todo: fetch tenants for regular users
        const response = await axios.get(`/api/tenants?id=${user?.id}`);
        setTenants(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch tenants", error);
    } finally {
      setLoadingTenants(false);
    }
  };
  useEffect(() => {
    const reload = searchParam.get("reload");
    if (reload) {
      window.location.href = window.location.origin + "/home";
      console.log("reloading");
    }
    if (user) {
      fetchTenants();
    }
  }, [user]);

  const fetchMembers = async (tenantId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/tenants/members/${tenantId}`);
      setMembers(response.data);
      const managers = response.data.filter(
        (member: MemberWithUser) => member.role === "MANAGER",
      );
      setManagers(managers);
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTenantUpdated = (updatedTenant: Tenant) => {
    setTenants((prevTenants) =>
      prevTenants.map((tenant) =>
        tenant.id === updatedTenant.id ? updatedTenant : tenant,
      ),
    );
  };

  const handleTenantClick = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    fetchMembers(tenant.id);
  };

  const confirmMemberRemove = async (memberToDelete: Member) => {
    if (memberToDelete) {
      try {
        startTransition(async () => {
          await axios.delete(
            `/api/tenants/${memberToDelete.tenantId}/remove-member/${memberToDelete.id}`,
          );
          setMembers((prevMembers) =>
            prevMembers.filter((member) => member.id !== memberToDelete.id),
          );
        });
      } catch (error) {
        console.error("Failed to remove member", error);
      }
    }
    setRemoveMemberDialogOpen(false);
    setMemberToDelete(null);
  };
  const cancelMemberRemove = () => {
    setRemoveMemberDialogOpen(false);
    setMemberToDelete(null);
  };

  const handleRoleChange = (member: MemberWithUser, role: string) => {
    setSelectedMember(member);
    setSelectedRole(role);
    setIsRoleDialogOpen(true);
  };
  const confirmRoleChange = async () => {
    if (selectedRole && selectedMember) {
      try {
        startTransition(async () => {
          await axios.put(
            `/api/tenants/${selectedMember.tenantId}/changerole/${selectedMember.id}`,
            {
              role: selectedRole,
            },
          );
          setMembers((prevMembers) =>
            prevMembers.map((m) =>
              m.id === selectedMember.id
                ? { ...m, role: selectedRole as Role }
                : m,
            ),
          );
        });
      } catch (error) {
        console.error("Failed to update member role", error);
      }
    }
    setSelectedMember(null);
    setSelectedRole(null);
    setIsRoleDialogOpen(false);
  };
  const cancelRoleChange = () => {
    setSelectedMember(null);
    setSelectedRole(null);
    setIsRoleDialogOpen(false);
  };

  const confirmDeleteTenant = async () => {
    if (tenantToDelete) {
      try {
        startTransition(async () => {
          await axios.delete(`/api/admin/tenants/${tenantToDelete.id}`);
          setTenants((prevTenants) =>
            prevTenants.filter((t) => t.id !== tenantToDelete.id),
          );
        });
      } catch (error) {
        console.error("Failed to delete tenant", error);
      }
    }
    setDeleteTenantDialogOpen(false);
    setTenantToDelete(null);
  };

  const cancelDeleteTenant = () => {
    setDeleteTenantDialogOpen(false);
    setTenantToDelete(null);
  };

  const toggleNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-2xl"
            >
              Noch
            </Link>
          </div>
          {status === "loading" && loadingTenants && <NavSkeleton />}
          {status === "authenticated" && (
            <nav className="flex-1 px-2 lg:px-4">
              <h3 className="text-xl font-semibold text-center mb-4">
                Tenants
              </h3>
              {tenants.map((tenant) => (
                <div
                  key={tenant.id}
                  className="mb-4 flex items-center justify-between"
                >
                  <Button
                    onClick={() => handleTenantClick(tenant)}
                    variant="ghost"
                    className="flex-1 text-black hover:text-primary "
                  >
                    {tenant.name}
                  </Button>
                  {user?.isAdmin && (
                    <Button
                      disabled={isPending}
                      variant="ghost"
                      onClick={() => {
                        setDeleteTenantDialogOpen(true);
                        setTenantToDelete(tenant);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                  {user?.isAdmin && (
                    <EditTenantDialog
                      tenant={tenant}
                      onTenantUpdated={handleTenantUpdated}
                    />
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>
      </div>

      {sideNavOpen && status === "loading" && <SideNavSkeleton />}
      {sideNavOpen && status === "authenticated" && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Tenants</h3>
              <Button variant="ghost" onClick={toggleNav}>
                <Cross2Icon />
              </Button>
            </div>
            {tenants.map((tenant) => (
              <div
                key={tenant.id}
                className="mb-4 flex items-center justify-between"
              >
                <Button
                  onClick={() => handleTenantClick(tenant)}
                  variant="ghost"
                  className="flex-1 text-muted-foreground hover:text-primary"
                >
                  {tenant.name}
                </Button>
                {user?.isAdmin && (
                  <Button
                    disabled={isPending}
                    variant="ghost"
                    onClick={() => {
                      setDeleteTenantDialogOpen(true);
                      setTenantToDelete(tenant);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
                {user?.isAdmin && (
                  <EditTenantDialog
                    tenant={tenant}
                    onTenantUpdated={handleTenantUpdated}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            {user?.isAdmin && (
              <div className="space-x-2 md:space-x-6">
                <Link href="/manage">
                  <span className="text-xs md:text-base font-medium text-gray-700 hover:text-black ">
                    Tenant Members
                  </span>
                </Link>
                <Link href="/add">
                  <span className="text-xs md:text-base font-medium text-gray-700 hover:text-black ">
                    Create Tenant
                  </span>
                </Link>
                <Link href="/admin">
                  <span className="text-xs md:text-base font-medium text-gray-700 hover:text-black">
                    Promote User
                  </span>
                </Link>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={toggleNav}
            aria-label="Toggle side navigation"
          >
            {sideNavOpen ? <Cross2Icon /> : <HamburgerMenuIcon />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <PersonIcon className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <form action={async () => await signOut()}>
                <button className="w-full" type="submit">
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          <h1 className="text-lg font-semibold md:text-2xl mb-4">
            {currentTenant?.name}
          </h1>
          <div className="rounded-lg border shadow-sm">
            <div className="overflow-x-auto">
              {loading ? (
                <HomeTableSkeleton />
              ) : currentTenant ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">Name</th>
                      <th className="border p-2 text-left">Email</th>
                      <th className="border p-2 text-left">Role</th>
                      {(user?.isAdmin ||
                        managers.some(
                          (manager) => manager.userId === user?.id,
                        )) && <th className="border p-2 text-left">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr
                        key={member.id}
                        className="
                      hover:bg-gray-100
                      "
                      >
                        <td className="border capitalize p-2">
                          {member.user.name}
                        </td>
                        <td className="border  p-2">
                          <a
                            className="cursor-pointer text-blue-800 hover:text-blue-400"
                            href={`mailto:${member.user.email}`}
                          >
                            {member.user.email}
                          </a>
                        </td>

                        {user?.isAdmin ||
                        managers.some(
                          (manager) => manager.userId === user?.id,
                        ) ? (
                          <td className="border p-2">
                            <Select
                              value={member.role}
                              disabled={isPending}
                              onValueChange={(role) =>
                                handleRoleChange(member, role)
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={member.role} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="MANAGER">Manager</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        ) : (
                          <td className="border p-2">{member.role}</td>
                        )}
                        {(user?.isAdmin ||
                          (managers.some(
                            (manager) => manager.userId === user?.id,
                          ) &&
                            !member.user.isAdmin)) && (
                          <td className="border p-2">
                            <Button
                              disabled={isPending}
                              variant="outline"
                              // write tailwindcss for remove button
                              className="text-red-600 hover:bg-red-100"
                              onClick={() =>
                                // handleRemoveMember(member.id, member.tenantId)
                                {
                                  setRemoveMemberDialogOpen(true);
                                  setMemberToDelete(member);
                                }
                              }
                            >
                              Remove
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center p-4">
                  Please select an organization to view its members.
                </p>
              )}
            </div>
          </div>
          {selectedMember && (
            <RemoveAlert
              open={isRoleDialogOpen}
              onOpenChange={setIsRoleDialogOpen}
              title="Are you absolutely sure?"
              description={`Are you sure you want to change the role of ${selectedMember.user.name} to ${selectedRole}?`}
              onConfirm={confirmRoleChange}
              onCancel={cancelRoleChange}
            />
          )}
          {tenantToDelete && (
            <RemoveAlert
              open={deleteTenantDialogOpen}
              onOpenChange={setDeleteTenantDialogOpen}
              title="Are you absolutely sure?"
              description={`Are you sure you want to delete ${tenantToDelete.name}?`}
              onConfirm={confirmDeleteTenant}
              onCancel={cancelDeleteTenant}
            />
          )}
          {memberToDelete && (
            <RemoveAlert
              open={removeMemberDialogOpen}
              onOpenChange={setRemoveMemberDialogOpen}
              title="Are you absolutely sure?"
              description={`Are you sure you want to remove ${memberToDelete.user.name} from the organization?`}
              onConfirm={() => confirmMemberRemove(memberToDelete)}
              onCancel={cancelMemberRemove}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
