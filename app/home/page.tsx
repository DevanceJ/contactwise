"use client";
import Link from "next/link";
import { FaBars, FaRegCircleUser, FaCross } from "react-icons/fa6";
import {
  Cross2Icon,
  HamburgerMenuIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Member, Prisma } from "@prisma/client";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TenantSchema } from "@/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tenant, Role } from "@prisma/client";
import { useSearchParams } from "next/navigation";

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
    null
  );
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [managers, setManagers] = useState<MemberWithUser[]>([]);
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const user = useCurrentUser();
  const searchParam = useSearchParams();

  const form = useForm<z.infer<typeof TenantSchema>>({
    resolver: zodResolver(TenantSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const fetchTenants = async () => {
    try {
      const response = await axios.get(`/api/tenants`);
      setTenants(response.data);
    } catch (error) {
      console.error("Failed to fetch tenants", error);
    }
  };
  useEffect(() => {
    const reload = searchParam.get("reload");
    if (reload) {
      window.location.href = window.location.origin + "/home";
      console.log("reloading");
    }
    fetchTenants();
  }, [searchParam]);

  const fetchMembers = async (tenantId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/tenants/members/${tenantId}`);
      setMembers(response.data);
      const managers = response.data.filter(
        (member: MemberWithUser) => member.role === "MANAGER"
      );
      setManagers(managers);
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    form.reset({
      name: tenant.name,
      description: tenant.description || "",
    });
  };

  const onSubmit = async (values: z.infer<typeof TenantSchema>) => {
    try {
      await axios.put(`/api/tenants/${currentTenant?.id}`, values);
      setTenants((prevTenants) =>
        prevTenants.map((tenant) =>
          tenant.id === currentTenant?.id ? { ...tenant, ...values } : tenant
        )
      );
      setSuccess("Tenant updated successfully");
    } catch (error) {
      setError("Failed to update tenant");
    }
  };

  const handleTenantClick = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    fetchMembers(tenant.id);
  };

  const handleRemoveMember = async (memberId: string, tenantId: string) => {
    try {
      await axios.delete(`/api/tenants/${tenantId}/remove-member/${memberId}`);
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== memberId)
      );
    } catch (error) {
      console.error("Failed to remove member", error);
    }
  };

  const handleRoleChange = (member: MemberWithUser, role: string) => {
    setSelectedMember(member);
    setSelectedRole(role);
    setIsDialogOpen(true);
  };
  const confirmRoleChange = async () => {
    if (selectedRole && selectedMember) {
      try {
        await axios.put(
          `/api/tenants/${selectedMember.tenantId}/changerole/${selectedMember.id}`,
          {
            role: selectedRole,
          }
        );
        setMembers((prevMembers) =>
          prevMembers.map((m) =>
            m.id === selectedMember.id
              ? { ...m, role: selectedRole as Role }
              : m
          )
        );
      } catch (error) {
        console.error("Failed to update member role", error);
      }
    }
    setSelectedMember(null);
    setSelectedRole(null);
    setIsDialogOpen(false);
  };
  const cancelRoleChange = () => {
    setSelectedMember(null);
    setSelectedRole(null);
    setIsDialogOpen(false);
  };

  const toggleNav = () => {
    setSideNavOpen(!sideNavOpen);
  };
  // md:grid-cols-[220px_1fr]
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-2xl">
              Noch
            </Link>
          </div>
          <nav className="flex-1 px-2 lg:px-4">
            <h3 className="text-xl font-semibold text-center mb-4">Tenants</h3>
            {tenants.map((tenant) => (
              <div
                key={tenant.id}
                className="mb-4 flex items-center justify-between">
                <Button
                  onClick={() => handleTenantClick(tenant)}
                  variant="ghost"
                  className="flex-1 text-muted-foreground hover:text-primary ">
                  {tenant.name}
                </Button>
                {user?.isAdmin && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" onClick={() => openModal(tenant)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Organization</DialogTitle>
                        <DialogDescription>
                          Make changes to the organization details here. Click
                          save when you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-6">
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={form.formState.isSubmitting}
                                      placeholder="HR Tenant"
                                      type="text"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={form.formState.isSubmitting}
                                      placeholder="This tenant is for the HR Team"
                                      type="text"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          {/* <FormErr message={error} /> */}
                          {/* <FormSuc message={success} /> */}
                          <DialogFooter>
                            <Button
                              disabled={form.formState.isSubmitting}
                              type="submit"
                              className="w-full">
                              Save changes
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {sideNavOpen && (
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
                className="mb-4 flex items-center justify-between">
                <Button
                  onClick={() => handleTenantClick(tenant)}
                  variant="ghost"
                  className="flex-1 text-muted-foreground hover:text-primary">
                  {tenant.name}
                </Button>
                {user?.isAdmin && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" onClick={() => openModal(tenant)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-60 sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Organization</DialogTitle>
                        <DialogDescription>
                          Make changes to the organization details here. Click
                          save when you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-6">
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={form.formState.isSubmitting}
                                      placeholder="HR Tenant"
                                      type="text"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={form.formState.isSubmitting}
                                      placeholder="HR Tenant for HR team"
                                      type="text"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              disabled={form.formState.isSubmitting}>
                              Save changes
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
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
                    Manage
                  </span>
                </Link>
                <Link href="/add">
                  <span className="text-xs md:text-base font-medium text-gray-700 hover:text-black ">
                    New Tenant
                  </span>
                </Link>
                <Link href="/admin">
                  <span className="text-xs md:text-base font-medium text-gray-700 hover:text-black">
                    Admin
                  </span>
                </Link>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={toggleNav}
            aria-label="Toggle side navigation">
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
          <h1 className="text-lg font-semibold md:text-2xl mb-4">Members</h1>
          <div className="rounded-lg border shadow-sm">
            <div className="overflow-x-auto">
              {loading ? (
                <p className="text-center p-4">Loading...</p>
              ) : currentTenant ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">Name</th>
                      <th className="border p-2 text-left">Email</th>
                      <th className="border p-2 text-left">Role</th>
                      {(user?.isAdmin ||
                        managers.some(
                          (manager) => manager.userId === user?.id
                        )) && <th className="border p-2 text-left">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id}>
                        <td className="border p-2">{member.user.name}</td>
                        <td className="border p-2">{member.user.email}</td>

                        {user?.isAdmin ||
                        managers.some(
                          (manager) => manager.userId === user?.id
                        ) ? (
                          <td className="border p-2">
                            <Select
                              value={member.role}
                              onValueChange={(role) =>
                                handleRoleChange(member, role)
                              }>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={member.role} />
                              </SelectTrigger>
                              {member.role === "MANAGER" ? (
                                <SelectContent>
                                  <SelectItem value="MANAGER">
                                    MANAGER
                                  </SelectItem>
                                  <SelectItem value="USER">USER</SelectItem>
                                </SelectContent>
                              ) : (
                                <SelectContent>
                                  <SelectItem value="USER">USER</SelectItem>
                                  <SelectItem value="MANAGER">
                                    MANAGER
                                  </SelectItem>
                                </SelectContent>
                              )}
                            </Select>
                          </td>
                        ) : (
                          <td className="border p-2">{member.role}</td>
                        )}
                        {(user?.isAdmin ||
                          (managers.some(
                            (manager) => manager.userId === user?.id
                          ) &&
                            !member.user.isAdmin)) && (
                          <td className="border p-2">
                            <Button
                              variant="outline"
                              onClick={() =>
                                handleRemoveMember(member.id, member.tenantId)
                              }>
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
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to change the role of{" "}
                    {selectedMember.user.name} to {selectedRole}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={cancelRoleChange}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={confirmRoleChange}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
