"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RoleGate } from "@/components/auth/role-gate";
import { Tenant, User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const AddUserSchema = z.object({
  tenantId: z.string(),
  userId: z.string(),
  role: z.enum(["MANAGER", "USER"]),
});

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof AddUserSchema>>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      tenantId: "",
      userId: "",
      role: "USER",
    },
  });

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const tenantsResponse = await axios.get("/api/tenants");
        setTenants(tenantsResponse.data);
      } catch (error) {
        console.error("Failed to fetch tenants", error);
      }
    };

    fetchTenants();
  }, []);

  useEffect(() => {
    const tenantId = form.getValues("tenantId");
    if (tenantId) {
      const fetchUsers = async () => {
        try {
          const usersResponse = await axios.get(
            `/api/users/verified?tenantId=${tenantId}`
          );
          setUsers(usersResponse.data);
        } catch (error) {
          console.error("Failed to fetch users", error);
        }
      };

      fetchUsers();
    }
  }, [form.watch("tenantId")]);

  const onSubmit = async (values: z.infer<typeof AddUserSchema>) => {
    setError("");
    setSuccess("");
    try {
      await axios.post(`/api/tenants/${values.tenantId}/add-member`, values);
      setSuccess("User added to tenant successfully");
      // reload page
      window.location.reload();
    } catch (error) {
      setError("Failed to add user to tenant");
    }
  };

  return (
    <RoleGate>
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Manage Tenant Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="my-3" />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="tenantId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tenant</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a tenant" />
                            </SelectTrigger>
                            <SelectContent>
                              {tenants.map((tenant) => (
                                <SelectItem key={tenant.id} value={tenant.id}>
                                  {tenant.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name} ({user.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USER">User</SelectItem>
                              <SelectItem value="MANAGER">Manager</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {error && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-500">{success}</div>}
                <Button type="submit" className="w-full">
                  Add User to Tenant
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
};

export default AdminPage;
