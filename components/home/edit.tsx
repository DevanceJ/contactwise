"use client";
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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TenantSchema } from "@/schema";
import axios from "axios";
import { useState } from "react";
import { Edit } from "lucide-react";
import { Tenant } from "@prisma/client";
import { FormErr } from "@/components/form-err";
import { FormSuc } from "@/components/form-suc";

type EditTenantDialogProps = {
  tenant: Tenant;
  onTenantUpdated: (tenant: Tenant) => void;
};

export const EditTenantDialog = ({
  tenant,
  onTenantUpdated,
}: EditTenantDialogProps) => {
  const form = useForm<z.infer<typeof TenantSchema>>({
    resolver: zodResolver(TenantSchema),
    defaultValues: {
      name: tenant.name,
      description: tenant.description || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const onSubmit = async (values: z.infer<typeof TenantSchema>) => {
    setLoading(true);
    setError(undefined);
    setSuccess(undefined);
    try {
      await axios.put(`/api/tenants/${tenant.id}`, values);
      onTenantUpdated({ ...tenant, ...values });
      setSuccess("Tenant updated successfully");
    } catch (error) {
      setError("Failed to update tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Edit className="h-4 w-4 text-blue-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-40 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
          <DialogDescription>
            Make changes to the organization details here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        disabled={loading}
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
                        disabled={loading}
                        placeholder="This tenant is for the HR Team"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {error && <FormErr message={error} />}
            {success && <FormSuc message={success} />}
            <DialogFooter>
              <Button disabled={loading} type="submit" className="w-full">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
