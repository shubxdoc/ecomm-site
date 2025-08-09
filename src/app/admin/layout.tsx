import Container from "@/components/Container";
import { Navbar, NavLink } from "@/components/Navbar";
import { SignedIn, UserButton } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
        <span className="ml-5 h-9">
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "35px",
                    height: "35px",
                  },
                },
              }}
            />
          </SignedIn>
        </span>
      </Navbar>
      <Container className="py-10">{children}</Container>
    </>
  );
}
