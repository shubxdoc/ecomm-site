import { Loader } from "lucide-react";

export const FullScreenLoader = () => {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
};
