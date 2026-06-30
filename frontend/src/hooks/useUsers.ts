import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as usersApi from "../api/users";

export function useUsers(params: { page?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => usersApi.listUsers(params),
    placeholderData: (prev) => prev,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] }); // user_count changes
      toast.success("User added");
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || "Couldn't add user."),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: usersApi.UserUpdatePayload }) =>
      usersApi.updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("User updated");
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || "Couldn't save changes."),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("User removed");
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || "Couldn't remove user."),
  });
}
