from pathlib import Path

# Patch App.tsx
app_path = Path('frontend/src/App.tsx')
text = app_path.read_text(encoding='utf-8')
route_marker = '              <Route path="/pos" element={<Navigate to="/sales/pos" replace />} />\n              <Route path="/invoices" element={<InvoicesPage />} />\n'
route_block = route_marker + '              <Route path="/contacts" element={<ContactsLayout />}>\n                <Route index element={<Navigate to="customers" replace />} />\n                <Route path="customers" element={<CustomersPage />} />\n                <Route path="suppliers" element={<SuppliersPage />} />\n                <Route path="import/customers" element={<ImportCustomersPage />} />\n                <Route path="import/suppliers" element={<ImportSuppliersPage />} />\n              </Route>\n'
if 'path="/contacts" element={<ContactsLayout />}' not in text:
    if route_marker in text:
        text = text.replace(route_marker, route_block)
        app_path.write_text(text, encoding='utf-8')
        print('App.tsx patched with contacts routes')
    else:
        raise SystemExit('Route marker not found in App.tsx')
else:
    print('App.tsx already contains contacts route')

# Patch customers API
cust_api = Path('frontend/src/api/customers.ts')
text = cust_api.read_text(encoding='utf-8')
if 'export async function importCustomers(file: File)' not in text:
    marker = 'export async function createCustomer(payload: CustomerPayload) {\n  const { data } = await apiClient.post<Customer>("/customers", payload);\n  return data;\n}\n\n'
    insert = marker + 'export async function importCustomers(file: File) {\n  const formData = new FormData();\n  formData.append("file", file);\n\n  const { data } = await apiClient.post<{ imported: number }>("/customers/import", formData, {\n    headers: { "Content-Type": "multipart/form-data" },\n  });\n  return data;\n}\n\n'
    if marker in text:
        text = text.replace(marker, insert)
        cust_api.write_text(text, encoding='utf-8')
        print('customers.ts patched with importCustomers')
    else:
        raise SystemExit('customers.ts marker not found')
else:
    print('customers.ts already has importCustomers')

# Patch useCustomers hook
hook_path = Path('frontend/src/hooks/useCustomers.ts')
text = hook_path.read_text(encoding='utf-8')
if 'export function useImportCustomers()' not in text:
    marker = 'export function useDeleteCustomer() {\n  const queryClient = useQueryClient();\n  return useMutation({\n    mutationFn: customersApi.deleteCustomer,\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ["customers"] });\n      toast.success("Customer removed");\n    },\n    onError: () => toast.error("Couldn't remove customer."),\n  });\n}\n'
    insert = marker + '\nexport function useImportCustomers() {\n  const queryClient = useQueryClient();\n  return useMutation({\n    mutationFn: customersApi.importCustomers,\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ["customers"] });\n      toast.success("Customers imported successfully.");\n    },\n    onError: () => toast.error("Couldn't import customers. Check the file and try again."),\n  });\n}\n'
    if marker in text:
        text = text.replace(marker, insert)
        hook_path.write_text(text, encoding='utf-8')
        print('useCustomers.ts patched with useImportCustomers')
    else:
        raise SystemExit('useCustomers.ts marker not found')
else:
    print('useCustomers.ts already contains useImportCustomers')

# Patch types
types_path = Path('frontend/src/types/index.ts')
text = types_path.read_text(encoding='utf-8')
if 'export interface Supplier' not in text:
    insert = '\nexport interface Supplier {\n  id: number;\n  name: string;\n  mobile: string | null;\n  email: string | null;\n  phone: string | null;\n  gst_number: string | null;\n  tax_number: string | null;\n  opening_balance: number;\n  country: string | null;\n  state: string | null;\n  city: string | null;\n  postcode: string | null;\n  address: string | null;\n}\n'
    if 'export interface Product' in text:
        idx = text.index('export interface Product')
        text = text[:idx] + insert + text[idx:]
        types_path.write_text(text, encoding='utf-8')
        print('types/index.ts patched with Supplier')
    else:
        raise SystemExit('Product interface not found in types/index.ts')
else:
    print('types/index.ts already contains Supplier')
