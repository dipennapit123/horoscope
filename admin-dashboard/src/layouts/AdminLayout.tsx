import type { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";

interface Props {
  children: ReactNode;
}

export const AdminLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#050316] via-[#05021A] to-[#0B061F] text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {children}
      </main>
    </div>
  );
};

