import Container from "@/components/Container";
import { Navbar, NavLink } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { checkRole } from "@/utils/roles";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAdmin = await checkRole("admin");

  return (
    <>
      <Navbar>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">My Orders</NavLink>
        {isAdmin && <NavLink href="/admin">Admin</NavLink>}
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
          <SignedOut>
            <SignInButton>
              <Button variant="secondary">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </span>
      </Navbar>
      <Container className="py-10">{children}</Container>
    </>
  );
}
