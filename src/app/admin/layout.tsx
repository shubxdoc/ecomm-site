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
        <span className="space-x-4">
          <NavLink label="Home" href="/" />
          <NavLink label="Dashboard" href="/admin" />
          <NavLink label="Products" href="/admin/products" />
          <NavLink label="Customers" href="/admin/users" />
          <NavLink label="Sales" href="/admin/orders" />
        </span>
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
