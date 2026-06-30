import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as rolesApi from "../api/roles";

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: rolesApi.listRoles,
  });
}

export function usePermissionCatalog() {
  return useQuery({
    queryKey: ["roles", "permissions"],
    queryFn: rolesApi.getPermissionCatalog,
    staleTime: Infinity, // the catalog is static, defined in backend code
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rolesApi.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role created");
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || "Couldn't create role."),
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: rolesApi.RolePayload }) =>
      rolesApi.updateRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role updated");
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || "Couldn't save changes."),
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rolesApi.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted");
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || "Couldn't delete role."),
  });
}
