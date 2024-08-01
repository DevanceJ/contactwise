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
import { Tenant, User } from "@prisma/client";
import { AddUserSchema } from "@/schema";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormErr } from "../form-err";
import { FormSuc } from "../form-suc";
import { useTransition, useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { addMember } from "@/actions/addMember";
import { LoadingSpinner } from "../ui/spinner";
export const MemberForm = () => {
  const form = useForm<z.infer<typeof AddUserSchema>>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      tenantId: "",
      userId: "",
      role: "USER",
    },
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState<boolean>(true);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

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

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const usersResponse = await axios.get(
        `/api/admin/users/verified?tenantId=${form.watch("tenantId")}`
      );
      setUsers(usersResponse.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoadingUsers(false);
    }
  };
  useEffect(() => {
    if (form.watch("tenantId")) {
      fetchUsers();
    }
  }, [form.watch("tenantId")]);

  const onSubmit = (values: z.infer<typeof AddUserSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      addMember(values).then((data) => {
        if (data) {
          setError(data.error);
          setSuccess(data?.success);
          if (data.success) {
            fetchUsers();
          }
        }
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="Add Member"
      backButtonLabel="Back to Home"
      backButtonHref="/home">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <div className=" space-y-4">
            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Tenants</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isPending || loadingTenants}
                        defaultValue={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Tenant"></SelectValue>
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
              disabled={loadingUsers || isPending}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Users</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isPending || loadingUsers}
                        defaultValue={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select User"></SelectValue>
                          {loadingUsers && <LoadingSpinner className="mr-4" />}
                        </SelectTrigger>
                        <SelectContent>
                          {users.length === 0 && (
                            <SelectItem disabled={true} value="all" key="all">
                              No users available
                            </SelectItem>
                          )}
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
              disabled={isPending}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isPending}
                        defaultValue={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <FormErr message={error} />
          <FormSuc message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Add Member
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
