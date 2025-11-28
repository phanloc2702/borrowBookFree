import React, { useState, useEffect } from 'react'; // <-- Đã thêm useEffect
import { Link, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiBookOpen, 
  FiLayers, 
  FiUsers, 
  FiSend,
  FiChevronDown, 
  FiChevronUp,
  FiList,
  FiPlusCircle
} from "react-icons/fi";

// --- START --- Logic của Sidebar
const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // State để quản lý menu con nào đang mở
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // --- THAY ĐỔI QUAN TRỌNG: Đóng submenu nếu đường dẫn chính thay đổi ---
  useEffect(() => {
    // Lấy ra phần đầu của đường dẫn hiện tại (ví dụ: '/books' từ '/books/create')
    const currentMainPath = "/" + currentPath.split('/')[1]; 

    // Nếu main path hiện tại không khớp với submenu đang mở, thì đóng nó
    if (openSubmenu && openSubmenu !== currentMainPath) {
        setOpenSubmenu(null);
    }
    
    // Nếu đang ở một đường dẫn con, tự động mở submenu tương ứng
    if (currentMainPath && currentMainPath !== "/" && !openSubmenu) {
      setOpenSubmenu(currentMainPath);
    }
  }, [currentPath]); // Chạy lại mỗi khi đường dẫn thay đổi

  // Toggle menu con
  const handleToggleSubmenu = (menuPath) => {
    setOpenSubmenu(openSubmenu === menuPath ? null : menuPath);
  };

  // --- CSS Classes ---
  const baseClass = "flex items-center p-3 rounded-lg transition duration-150 ease-in-out font-medium justify-between";
  const inactiveClass = "text-gray-200 hover:bg-slate-700 hover:text-amber-400";
  // Active Class chỉ dùng cho mục cha và mục con
  const activeParentClass = "bg-amber-500 text-white shadow-md"; 
  const subLinkClass = "flex items-center p-2 pl-10 text-sm font-normal rounded-lg text-gray-300 hover:bg-slate-700 hover:text-amber-400 transition duration-150 ease-in-out";
  const subLinkActiveClass = "flex items-center p-2 pl-10 text-sm font-semibold rounded-lg bg-amber-600 text-white transition duration-150 ease-in-out";

  // Hàm kiểm tra đường dẫn cho mục cha (Parent Item)
  const getNavItemClass = (path) => {
    // Logic Home: Chỉ sáng khi path chính xác là "/"
    if (path === "/") {
        return `${baseClass} ${currentPath === path ? activeParentClass : inactiveClass}`;
    }
    
    // Logic cho các mục cha khác: Sáng nếu đường dẫn hiện tại BẮT ĐẦU bằng path
    const isActive = currentPath.startsWith(path);
    return `${baseClass} ${isActive ? activeParentClass : inactiveClass}`;
  };

  // Hàm kiểm tra đường dẫn cho mục con (Submenu Item)
  const getSubLinkClass = (path) => {
    return currentPath === path ? subLinkActiveClass : subLinkClass;
  };
  
  // Component cho nút đóng/mở
  const ParentNavItem = ({ title, path, icon, hasSubmenu = false }) => {
    
    // Kiểm tra xem mục con có đang hoạt động (active) không (dùng để highlight)
    const isParentActive = currentPath.startsWith(path) && path !== "/";
    
    // Quyết định icon mũi tên
    const ChevronIcon = openSubmenu === path ? FiChevronUp : FiChevronDown;

    return (
        <div>
            {/* Mục cha */}
            <button 
                onClick={() => hasSubmenu && handleToggleSubmenu(path)} 
                className={`${getNavItemClass(path)} w-full`}
            >
                <div className="flex items-center">
                    {React.cloneElement(icon, { className: 'text-xl mr-3' })}
                    <span>{title}</span>
                </div>
                {/* Icon mũi tên */}
                {hasSubmenu && <ChevronIcon className="text-xl" />}
            </button>
            
            {/* Menu con */}
            {(hasSubmenu && (isParentActive || openSubmenu === path)) && ( // THAY ĐỔI: Chỉ hiển thị nếu active HOẶC đang mở
                <div className="flex flex-col space-y-1 mt-1 pb-2">
                    {/* List/Read (Thường là path gốc) */}
                    <Link to={path} className={getSubLinkClass(path)}>
                        <FiList className="mr-2" />
                        Danh sách
                    </Link>
                    {/* Create */}
                    <Link to={`${path}/create`} className={getSubLinkClass(`${path}/create`)}>
                        <FiPlusCircle className="mr-2" />
                        Thêm mới
                    </Link>
                </div>
            )}
        </div>
    );
  };
  
  return (
    <aside className="w-64 bg-slate-800 text-white p-4 h-screen shadow-2xl sticky top-0 overflow-y-auto">
      
      {/* Tiêu đề Admin Panel */}
      <div className="flex items-center mb-8 border-b border-slate-700 pb-4">
        <span className="text-2xl font-extrabold text-amber-400">📚</span>
        <h1 className="text-2xl font-extrabold ml-2 tracking-wide text-gray-100">
          Admin Panel
        </h1>
      </div>

      {/* Thanh điều hướng */}
      <nav className="flex flex-col space-y-2">
        
        {/* Home */}
        <Link to="/" className={getNavItemClass("/")}>
          <div className="flex items-center">
             <FiHome className="text-xl mr-3" /> Home
          </div>
        </Link>
        
        {/* Books */}
        <ParentNavItem title="Books" path="/books" icon={<FiBookOpen />} hasSubmenu={true} />
        
        {/* Categories */}
        <ParentNavItem title="Categories" path="/categories" icon={<FiLayers />} hasSubmenu={true} />
        
        {/* Users */}
        <ParentNavItem title="Users" path="/users" icon={<FiUsers />} hasSubmenu={true} />
        
        {/* Borrowings */}
        <ParentNavItem title="Borrowings" path="/borrowings" icon={<FiSend />} hasSubmenu={true} />
        
      </nav>
    </aside>
  );
};

export default Sidebar;