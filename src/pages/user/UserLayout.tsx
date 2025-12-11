import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar" // đường dẫn chỉnh theo project của bạn

const UserLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} LibriShare. Thư viện sách cộng
          đồng miễn phí.
        </p>
      </footer>
    </div>
  );
};

export default UserLayout;
