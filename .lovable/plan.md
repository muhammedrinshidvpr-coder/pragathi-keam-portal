

## Plan: Remove Admin Button from Header

**What**: Remove the "Admin" button/link from the header navigation so that the admin dashboard is only accessible by manually navigating to `/admin`.

**Changes**:
- **`src/components/Header.tsx`** — Remove the `<a href="/admin">Admin</a>` element from the nav section, keeping only the "Home" link.

