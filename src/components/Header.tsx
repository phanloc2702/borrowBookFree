import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import {
  FiSearch,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiBookOpen,
} from "react-icons/fi";
import { useState } from "react";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  // Mở dropdown khi hover vào
  const handleMouseEnter = () => {
    setIsProfileOpen(true);
  };

  // Đóng dropdown sau độ trễ nhỏ (tránh giật)
  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsProfileOpen(false);
    }, 150);
  };

  // Hàm đăng xuất
  const handleLogout = () => {
    logout();

    setIsProfileOpen(false);

    navigate("/login");
  };

  return (
    <header className="bg-slate-700 shadow-lg sticky top-0 z-10 p-4">
      <div className="flex justify-between items-center h-12">
        {/* Thanh tìm kiếm */}
        <div className="flex items-center w-full max-w-md mr-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm sách, người dùng,..."
              className="w-full pl-10 pr-4 py-2 text-sm text-gray-200 bg-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-150"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>
        </div>

        {/* Icons và menu hồ sơ */}
        <div className="flex items-center space-x-4">
          {/* Nút cài đặt */}
          <button className="text-gray-300 hover:text-amber-400 transition duration-150 p-2 rounded-full hover:bg-slate-600">
            <FiSettings className="text-xl" />
          </button>

          {/* Nút thông báo */}
          <button className="relative text-gray-300 hover:text-amber-400 transition duration-150 p-2 rounded-full hover:bg-slate-600">
            <FiBell className="text-xl" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full ring-2 ring-slate-700 bg-red-500"></span>
          </button>

          {/* Dropdown hồ sơ */}
          <div
            className="relative h-full flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Nút hiển thị Admin */}
            <div
              className={`flex items-center cursor-pointer p-2 rounded-lg transition duration-150 ${
                isProfileOpen ? "bg-slate-600" : "hover:bg-slate-600"
              }`}
            >
              <span className="text-sm font-medium text-gray-200 mr-2 hidden sm:block">
                Admin
              </span>

              <div className="h-9 w-9 bg-amber-500 rounded-full flex items-center justify-center text-white">
                <FiUser className="text-lg" />
              </div>

              <FiChevronDown
                className={`text-gray-400 ml-1 transition duration-150 ${
                  isProfileOpen ? "transform rotate-180 text-amber-400" : ""
                }`}
              />
            </div>

            {/* Dropdown menu */}
            {isProfileOpen && (
              <div
                className="absolute right-0 top-full w-48 bg-slate-800 rounded-lg shadow-xl py-2 border border-slate-700 origin-top-right"
                style={{ zIndex: 20 }}
              >
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-amber-400 transition duration-150"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <FiUser className="mr-3" /> Hồ sơ
                </Link>

                <Link
                  to="/my-borrowings"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-amber-400 transition duration-150"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <FiBookOpen className="mr-3" /> Sách đang mượn
                </Link>

                <div className="border-t border-slate-700 my-1"></div>

                {/* Nút đăng xuất */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition duration-150 text-left"
                >
                  <FiLogOut className="mr-3" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
