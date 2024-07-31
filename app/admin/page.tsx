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
import { Button } from "@/components/ui/button";
import axios from "axios";
import { User } from "@prisma/client";
const AdminAccess = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/api/users/requestedaccess`);
      // console.log("fetchUsers -> response", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch tenants", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const makeAdmin = async (userId: string) => {
    try {
      await axios.put(`/api/users/${userId}/makeadmin`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to make user admin", error);
    }
  };

  return (
    <main className="flex-1 p-4 lg:p-6">
      <h1 className="text-lg font-semibold md:text-2xl mb-4">Users</h1>
      <div className="rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center p-4">Loading...</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button variant="default">Make Admin</Button>
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
      {/* {selectedMember && (
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
      )} */}
    </main>
  );
};

export default AdminAccess;
