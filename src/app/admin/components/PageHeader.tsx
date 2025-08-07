export const PageHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-5">
      {children}
    </h2>
  );
};
