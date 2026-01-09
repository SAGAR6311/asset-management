import { useState } from "react";
import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <header className="bg-white border-b border-slate-200 lg:hidden sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-slate-600 hover:text-slate-900"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-slate-900">Asset Manager</h1>
            <div className="w-6" />
          </div>
        </header>
        
        <main className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
