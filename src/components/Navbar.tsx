import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import {
  BookOpen,
  ShoppingBag,
  LogOut,
  User as UserIcon,
  LogIn,
} from "lucide-react";

interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
}

const Navbar: React.FC = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<AuthUser | null>(null);

  // Sync user từ localStorage mỗi lần đổi route
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all duration-300">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-slate-900 tracking-tight leading-none">
                LibriShare
              </span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                Thư viện cộng đồng
              </span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            {user ? (
              <>
                {/* Cart */}
                <Link
                  to="/cart"
                  className={`relative group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive("/cart")
                      ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                      : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <div className="relative">
                    <ShoppingBag
                      size={22}
                      className={isActive("/cart") ? "fill-amber-200" : ""}
                    />
                    {cart.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                        {cart.length}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline font-medium">Giỏ sách</span>
                </Link>

                {/* Profile */}
                <Link
                  to="/profile"
                  className={`hidden md:flex items-center gap-3 pl-4 border-l border-slate-200 group transition-colors ${
                    isActive("/profile")
                      ? "opacity-100"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="flex flex-col items-end mr-1">
                    <span
                      className={`text-sm font-semibold leading-none ${
                        isActive("/profile")
                          ? "text-amber-600"
                          : "text-slate-800"
                      }`}
                    >
                      {user.fullName || user.email}
                    </span>
                    <span className="text-xs text-slate-400">
                      {user.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
                    </span>
                  </div>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm transition-all ${
                      isActive("/profile")
                        ? "bg-amber-500 text-white"
                        : "bg-amber-100 text-amber-700 group-hover:bg-amber-200"
                    }`}
                  >
                    <UserIcon size={18} />
                  </div>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                  title="Đăng xuất"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 text-white font-medium hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30 active:scale-95"
              >
                <LogIn size={18} />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
