/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hook";
import { useGetAllUsersQuery, useBlockUserMutation, useUnblockUserMutation, useUpdateUserRoleMutation } from "@/redux/features/user/user.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Lock, Unlock, Loader2, UserCog } from "lucide-react";
import { toast } from "sonner";

export default function UserManagement() {
  const hasSessionHint = useAppSelector((state) => state.authSession.hasSession);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { data: usersData, isLoading } = useGetAllUsersQuery(
    {
      page,
      limit,
      search: searchTerm || undefined,
      role: roleFilter === "ALL" ? undefined : roleFilter,
      status: statusFilter === "ALL" ? undefined : statusFilter,
    },
    { skip: !hasSessionHint }
  );

  const [blockUser, { isLoading: blockLoading }] = useBlockUserMutation();
  const [unblockUser, { isLoading: unblockLoading }] = useUnblockUserMutation();
  const [updateUserRole, { isLoading: roleUpdateLoading }] = useUpdateUserRoleMutation();

  const totalUsers = usersData?.meta?.total || usersData?.total || 0;
  const totalPages = totalUsers > 0 ? Math.ceil(totalUsers / limit) : 1;
  const users = usersData?.data || [];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await unblockUser(userId).unwrap();
      toast.success("User unblocked successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to unblock user");
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      await blockUser(userId).unwrap();
      toast.success("User blocked successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to block user");
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await updateUserRole({ userId, role: newRole }).unwrap();
      toast.success(`User role updated to ${newRole} successfully`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user role");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all users on the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find users by name, email, role, or status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="rider">Rider</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("ALL");
                setStatusFilter("ALL");
                setPage(1);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>
            Total users: {totalUsers} | Showing {users.length} users per page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user: any) => {
                    const isActive =
                      user.isActive === true ||
                      user.isActive === "true" ||
                      user.status?.toLowerCase() === "active";

                    return (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                              }`}
                          >
                            {isActive ? "Active" : "Blocked"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={user.role}
                              onValueChange={(newRole) => handleUpdateUserRole(user._id, newRole)}
                              disabled={roleUpdateLoading || user.role === "SUPER_ADMIN"}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="DRIVER">Driver</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                              </SelectContent>
                            </Select>

                            {isActive ? (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={blockLoading || user.role === "SUPER_ADMIN"}
                                  >
                                    <Lock className="h-4 w-4 mr-1" />
                                    Block
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogTitle>Block User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to block {user.name}? They
                                    will not be able to use the platform.
                                  </AlertDialogDescription>
                                  <div className="flex justify-end gap-4">
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleBlockUser(user._id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Block User
                                    </AlertDialogAction>
                                  </div>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUnblockUser(user._id)}
                                disabled={unblockLoading || user.role === "SUPER_ADMIN"}
                              >
                                <Unlock className="h-4 w-4 mr-1" />
                                Unblock
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 space-y-4">
            {/* Rows per page selector */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalUsers)} of {totalUsers} users
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select value={limit.toString()} onValueChange={(val) => {
                  setLimit(Number(val));
                  setPage(1);
                }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({totalUsers} total users)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const newPage = Math.max(1, page - 1);
                    setPage(newPage);
                  }}
                  disabled={page === 1 || isLoading}
                >
                  Previous
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {totalPages <= 7 ? (
                    Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(p)}
                        disabled={isLoading}
                        className="w-9 h-9 p-0"
                      >
                        {p}
                      </Button>
                    ))
                  ) : (
                    <>
                      <Button
                        variant={page === 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(1)}
                        disabled={isLoading}
                        className="w-9 h-9 p-0"
                      >
                        1
                      </Button>

                      {page > 3 && <span className="px-1 text-muted-foreground">...</span>}

                      {page > 2 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(page - 1)}
                          disabled={isLoading}
                          className="w-9 h-9 p-0"
                        >
                          {page - 1}
                        </Button>
                      )}

                      {page > 1 && page < totalPages && (
                        <Button
                          variant="default"
                          size="sm"
                          className="w-9 h-9 p-0"
                        >
                          {page}
                        </Button>
                      )}

                      {page < totalPages - 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(page + 1)}
                          disabled={isLoading}
                          className="w-9 h-9 p-0"
                        >
                          {page + 1}
                        </Button>
                      )}

                      {page < totalPages - 2 && <span className="px-1 text-muted-foreground">...</span>}

                      {totalPages > 1 && (
                        <Button
                          variant={page === totalPages ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(totalPages)}
                          disabled={isLoading}
                          className="w-9 h-9 p-0"
                        >
                          {totalPages}
                        </Button>
                      )}
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    const newPage = Math.min(totalPages, page + 1);
                    setPage(newPage);
                  }}
                  disabled={page === totalPages || totalPages === 0 || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}