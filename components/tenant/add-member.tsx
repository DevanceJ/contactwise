"use client";
import { CardWrapper } from "@/components/auth/card-wrapper";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AddUserSchema } from "@/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormErr } from "../form-err";
import { FormSuc } from "../form-suc";
import { useTransition, useState } from "react";
import { Tenant, User } from "@prisma/client";
import axios from "axios";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/spinner";

export const AddUserForm = () => {
  const form = useForm<z.infer<typeof AddUserSchema>>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      tenantId: "",
      userId: "",
      role: "USER",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoadingTenants(true);
        const tenantsResponse = await axios.get("/api/tenants");
        setTenants(tenantsResponse.data);
      } catch (error) {
        console.error("Failed to fetch tenants", error);
      } finally {
        setLoadingTenants(false);
      }
    };

    fetchTenants();
  }, []);

  useEffect(() => {
    const tenantId = form.getValues("tenantId");
    if (tenantId) {
      const fetchUsers = async () => {
        try {
          setLoadingUsers(true);
          const usersResponse = await axios.get(
            `/api/users/verified?tenantId=${tenantId}`
          );
          setUsers(usersResponse.data);
        } catch (error) {
          console.error("Failed to fetch users", error);
        } finally {
          setLoadingUsers(false);
        }
      };

      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [form, form.watch("tenantId")]);

  const onSubmit = async (values: z.infer<typeof AddUserSchema>) => {
    setError("");
    setSuccess("");
    try {
      startTransition(async () => {
        await axios.post(`/api/tenants/${values.tenantId}/add-member`, values);
        setSuccess("User added to tenant successfully");
        form.reset();
      });
    } catch (error) {
      setError("Failed to add user to tenant");
    }
  };

  return (
    <CardWrapper
      headerLabel="Add Member"
      backButtonHref="/home"
      backButtonLabel="Back to Home">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <div className=" space-y-4">
            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Tenant</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isPending || loadingTenants}
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tenant" />
                          {loadingTenants && (
                            <LoadingSpinner className="mr-4" />
                          )}
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
                );
              }}
            />
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isPending || loadingUsers}
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                          {loadingUsers && <LoadingSpinner />}
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
                );
              }}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isPending}
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
          <FormErr message={error} />
          <FormSuc message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Add User
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
