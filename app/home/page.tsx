"use client";
import Link from "next/link";
import { FaRegCircleUser } from "react-icons/fa6";
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
import { FormErr } from "@/components/form-err";
import { FormSuc } from "@/components/form-suc";
import { Tenant } from "@prisma/client";

type MemberWithUser = Prisma.MemberGetPayload<{
  include: {
    user: true;
  };
}>;

const Home = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [members, setMembers] = useState<MemberWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [managers, setManagers] = useState<MemberWithUser[]>([]);
  const user = useCurrentUser();

  const form = useForm<z.infer<typeof TenantSchema>>({
    resolver: zodResolver(TenantSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchTenants = async (userId: string) => {
      try {
        const response = await axios.get(`/api/tenants?id=${userId}`);
        setTenants(response.data);
      } catch (error) {
        console.error("Failed to fetch tenants", error);
      }
    };
    if (user?.id) {
      fetchTenants(user.id);
    }
  }, [user?.id]);

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
    setError("");
    setSuccess("");
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
                          save when you’re done.
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
                          <FormErr message={error} />
                          <FormSuc message={success} />
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

      {/* Main Content */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            {user?.isAdmin && (
              <Link href="/manage">
                <span className="text-lg text-gray-800 underline">
                  Manage users
                </span>
              </Link>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <FaRegCircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
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
                      <th className="border p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id}>
                        <td className="border p-2">{member.user.name}</td>
                        <td className="border p-2">{member.user.email}</td>
                        <td className="border p-2">{member.role}</td>
                        <td className="border p-2">
                          {(user?.isAdmin ||
                            managers.some(
                              (manager) => manager.userId === user?.id
                            )) && (
                            <Button
                              variant="outline"
                              onClick={() =>
                                handleRemoveMember(member.id, member.tenantId)
                              }>
                              Remove
                            </Button>
                          )}
                        </td>
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
        </main>
      </div>
    </div>
  );
};

export default Home;
