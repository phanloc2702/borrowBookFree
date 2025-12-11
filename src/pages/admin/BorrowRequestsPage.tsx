// src/pages/admin/BorrowRequestsPage.tsx
import React, { useEffect, useState } from "react";
import { Search, RefreshCw, Check, XCircle } from "lucide-react";
import borrowRequestService, {
  BorrowRequestResponse,
  BorrowRequestStatus,
} from "../../services/borrowRequestService";
import { toast } from "react-toastify";

const BorrowRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<BorrowRequestResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await borrowRequestService.getBorrowRequests(
        page,
        size,
        keyword
      );
      const data = res.data.data || res.data;

      const content = data.content || [];
      setRequests(content);
      setTotalPages(data.totalPages ?? 0);
    } catch (error) {
      console.error("Fetch borrow requests error:", error);
      toast.error("Không tải được danh sách yêu cầu mượn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, keyword]);

  const handleUpdateStatus = async (
    id: number,
    status: BorrowRequestStatus
  ) => {
    try {
      await borrowRequestService.updateBorrowRequestStatus(id, status);
      toast.success("Cập nhật trạng thái đơn mượn thành công");

      // Cập nhật lại state cho nhanh
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (error) {
      console.error("Update request status error:", error);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const renderStatusText = (status: BorrowRequestStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
            Chờ duyệt
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            Đã duyệt
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            Từ chối
          </span>
        );
      case "CANCELED":
        return (
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            Đã hủy
          </span>
        );
      default:
        return status;
    }
  };

  // Hiển thị danh sách tên sách trong một ô (tối đa 2 dòng + “+N cuốn nữa”)
  const renderBookTitles = (r: BorrowRequestResponse) => {
    const borrowings = r.borrowings || [];
    if (!borrowings.length) {
      return (
        <span className="text-xs text-gray-400 italic">
          Chưa có thông tin sách
        </span>
      );
    }

    const titles = borrowings.map((b) => b.book?.title || "Không rõ");
    const firstTwo = titles.slice(0, 2);
    const remainCount = titles.length - firstTwo.length;

    return (
      <div className="flex flex-col gap-1 max-w-xs">
        {firstTwo.map((t, idx) => (
          <span
            key={idx}
            className="text-sm text-gray-800 truncate"
            title={t}
          >
            • {t}
          </span>
        ))}
        {remainCount > 0 && (
          <span className="text-xs text-gray-500">
            +{remainCount} cuốn nữa
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý yêu cầu mượn sách
          </h1>
          <p className="text-sm text-gray-500">
            Duyệt hoặc từ chối các đơn mượn sách do người dùng gửi lên.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Tìm theo tên, email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setKeyword(searchInput.trim());
              setPage(0);
            }}
            className="px-3 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            Tìm
          </button>
          <button
            onClick={() => {
              setKeyword("");
              setSearchInput("");
              setPage(0);
            }}
            className="p-2 border rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-10 text-center text-gray-500 text-sm">
            Đang tải dữ liệu...
          </div>
        ) : requests.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-sm">
            Không có yêu cầu mượn nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Mã đơn</th>
                  <th className="px-4 py-3 text-left">Người mượn</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Sách mượn</th>
                  <th className="px-4 py-3 text-left">Ngày tạo</th>
                  <th className="px-4 py-3 text-left">Trạng thái</th>
                  <th className="px-4 py-3 text-left">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/70">
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      #{r.id.toString().padStart(5, "0")}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {r.userFullName || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {r.userEmail || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {renderBookTitles(r)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {r.createdAt}
                    </td>
                    <td className="px-4 py-3">
                      {renderStatusText(r.status)}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        disabled={r.status !== "PENDING"}
                        onClick={() => handleUpdateStatus(r.id, "APPROVED")}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
                      >
                        <Check size={14} />
                        Duyệt
                      </button>
                      <button
                        disabled={r.status !== "PENDING"}
                        onClick={() => handleUpdateStatus(r.id, "REJECTED")}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        Từ chối
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            Trang {page + 1} / {totalPages}
          </span>
          <div className="space-x-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Trước
            </button>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowRequestsPage;
