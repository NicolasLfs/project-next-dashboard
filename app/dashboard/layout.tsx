import React from "react";
import { SessionProvider } from "next-auth/react";
import SideNav from "../ui/dashboard/sidenav";

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // Envolve o layout com o SessionProvider
    <SessionProvider>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}
