from pathlib import Path

path = Path('frontend/src/pages/contacts/SuppliersPage.tsx')
text = path.read_text(encoding='utf-8')
old = '''          <tbody>
            {isLoading ? (
              <TableSkeleton rows={6} cols={5} />
            ) : data?.items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                  No suppliers found matching your search.
                </td>
              </tr>
'''
new = '''          <tbody>
            {isLoading ? (
              <TableSkeleton rows={6} cols={5} />
            ) : !data?.items?.length ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                  No suppliers found matching your search.
                </td>
              </tr>
'''
if old not in text:
    raise SystemExit('Pattern not found in SuppliersPage.tsx')
path.write_text(text.replace(old, new), encoding='utf-8')
print('Patched SuppliersPage.tsx')
