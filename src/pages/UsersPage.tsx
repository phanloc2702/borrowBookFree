import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiLock,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import userService from "../services/userService";


interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "USER";
  createdAt: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // --- Hàm gọi API ---
  const fetchUsers = async (pageNumber = 0, search = "") => {
    try {
      setLoading(true);
      const res = await userService.getUsers(pageNumber, size, search);
      const data = (res.data as { data: { content: User[]; totalPages: number } }).data;
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Lần đầu load: tải toàn bộ user ---
  useEffect(() => {
    fetchUsers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // --- Tìm kiếm (debounce 300ms) ---
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(0);
      fetchUsers(0, searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // --- Khi gõ vào ô tìm kiếm ---
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // --- Chuyển trang ---
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  // --- Xóa user ---
  const handleDelete = async (id: number, username: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${username}" không?`)) {
      try {
        await userService.deleteUser(id);
        setUsers((prev) => prev.filter((user) => user.id !== id));
        alert("Xóa người dùng thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        alert("Không thể xóa người dùng này!");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8">
        Danh Sách Người Dùng
      </h2>

      {/* Thanh công cụ */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, username, email..."
            className="w-full pl-10 pr-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-150 shadow-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <Link
          to="/users/create"
          className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition duration-150 shadow-md"
        >
          <FiPlus className="mr-2" /> Thêm người dùng mới
        </Link>
      </div>

      {/* Bảng người dùng */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Tên đầy đủ",
                  "Username",
                  "Email",
                  "Vai trò",
                  "Ngày tạo",
                  "Thao tác",
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-amber-50 transition duration-100"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                          user.role === "ADMIN"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role === "ADMIN" ? (
                          <FiLock className="mr-1" />
                        ) : (
                          <FiUser className="mr-1" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/users/${user.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition"
                          title="Xem chi tiết"
                        >
                          <FiEye className="text-lg" />
                        </Link>
                        <Link
                          to={`/users/edit/${user.id}`}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition"
                          title="Sửa"
                        >
                          <FiEdit className="text-lg" />
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id, user.username)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
                          title="Xóa"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500 italic"
                  >
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="p-4 flex justify-between items-center bg-slate-50 border-t border-gray-200 text-sm text-gray-600">
          <span>
            Trang {page + 1} / {totalPages}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              className="flex items-center px-3 py-1 border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <FiChevronLeft className="mr-1" /> Trước
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className="flex items-center px-3 py-1 border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Sau <FiChevronRight className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
