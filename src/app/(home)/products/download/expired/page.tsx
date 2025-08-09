import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Expired() {
  return (
    <>
      <div className="space-y-10 text-center">
        <h1 className="text-2xl font-bold">
          *This link has expired and is no longer valid. This usually happens
          for security reasons after a certain period of time.
        </h1>
        <div>
          <Button variant={"outline"} asChild size="lg">
            <Link href="/orders">Get New Link</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
