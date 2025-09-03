import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="flex h-16 items-center justify-center">
      <div className="max-w-fd-container w-fit px-3">
        <p className="text-muted-foreground text-sm font-medium tracking-tight">
          Made by{" "}
          <Link
            href="https://github.com/shubxdoc"
            target="_blank"
            className="text-foreground underline-offset-4 hover:underline"
            prefetch
          >
            shubxdoc.
          </Link>
        </p>
      </div>
    </footer>
  );
};
