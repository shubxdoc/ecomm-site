import Container from "@/components/Container";
import { Navbar, NavLink } from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/customers">Customers</NavLink>
        <NavLink href="/admin/sales">Sales</NavLink>
      </Navbar>
      <Container className="py-10">{children}</Container>
    </>
  );
}
