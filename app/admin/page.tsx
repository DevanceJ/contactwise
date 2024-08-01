"use client";
import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EnterIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { User } from "@prisma/client";
import { RoleGate } from "@/components/auth/role-gate";

const AdminAccess = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/admin/users/all`);
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const makeAdmin = async (userId: string) => {
    try {
      await axios.put(`/api/admin/users/promote/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to make user admin", error);
    }
  };

  return (
    <RoleGate>
      <main className="flex-1 p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => window.location.replace("/home")}
            className="text-lg px-4">
            &larr; Back
          </Button>
          <h1 className="text-lg font-semibold md:text-xl">Manage Users</h1>
        </div>

        <div className="rounded-lg border shadow-sm bg-white">
          <div className="overflow-x-auto">
            {loading ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Email</th>
                    <th className="border p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="">
                      <td className="border p-2">
                        <Skeleton className="h-4 w-3/4" />{" "}
                        {/* Skeleton for user name */}
                      </td>
                      <td className="border p-2">
                        <Skeleton className="h-4 w-3/4" />{" "}
                        {/* Skeleton for user email */}
                      </td>
                      <td className="border p-2">
                        <Skeleton className="h-4 w-12" />{" "}
                        {/* Skeleton for action button */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Email</th>
                    <th className="border p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-100">
                      <td className="border capitalize p-2">{user.name}</td>
                      <td className="border  p-2">
                        <a
                          className="cursor-pointer text-blue-800 hover:text-blue-400"
                          href={`mailto:${user.email}`}>
                          {user.email}
                        </a>
                      </td>
                      <td className="border p-2">
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button
                              variant="outline"
                              className="text-blue-600 hover:bg-blue-100">
                              <span>Make Admin</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to change the role of{" "}
                                {user.name} to Admin?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => makeAdmin(user.id)}>
                                Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </RoleGate>
  );
};

export default AdminAccess;
