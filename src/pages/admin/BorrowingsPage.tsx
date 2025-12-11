// src/pages/admin/BorrowingsPage.tsx
import React, { useEffect, useState } from "react";
import { FiSearch, FiRefreshCcw } from "react-icons/fi";
import { toast } from "react-toastify";
import borrowingService, {
  Borrowing,
  BorrowStatus,
} from "../../services/borrowingService";

const BorrowingsPage: React.FC = () => {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const res = await borrowingService.getBorrowings(page, size, search);

      const data = res.data.data || res.data;
      const content: Borrowing[] = data.content || [];
      setBorrowings(content);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
    } catch (error) {
      console.error("Fetch borrowings error:", error);
      toast.error("Lỗi khi tải danh sách phiếu mượn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchBorrowings();
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN");
    } catch {
      return dateStr;
    }
  };

  const renderStatusBadge = (status: Borrowing["status"]) => {
    switch (status) {
      case "BORROWED":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600">
            Đang mượn
          </span>
        );
      case "RETURNED":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-600">
            Đã trả
          </span>
        );
      case "OVERDUE":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-600">
            Quá hạn
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  const handleChangePage = (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;
    setPage(newPage);
  };

  const handleReload = () => {
    fetchBorrowings();
    toast.info("Đã làm mới danh sách");
  };

  // NEW: admin bấm chuyển trạng thái
  const handleUpdateStatus = async (id: number, status: BorrowStatus) => {
    try {
      await borrowingService.updateBorrowingStatus(id, status);
      toast.success("Cập nhật trạng thái phiếu mượn thành công");

      // Cập nhật lại ngay trên UI
      setBorrowings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                status,
                returnDate:
                  status === "RETURNED"
                    ? new Date().toISOString()
                    : b.returnDate,
              }
            : b
        )
      );
    } catch (error) {
      console.error("Update borrowing status error:", error);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Quản lý phiếu mượn
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tổng cộng{" "}
            <span className="font-semibold text-amber-600">
              {totalElements}
            </span>{" "}
            phiếu mượn trong hệ thống
          </p>
        </div>

        {/* Search + Reload */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <FiSearch />
              </span>
              <input
                type="text"
                className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white min-w-[220px]"
                placeholder="Tìm tên sách, người mượn..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="ml-2 px-3 py-2 text-sm rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
            >
              Tìm
            </button>
          </form>

          <button
            type="button"
            onClick={handleReload}
            className="inline-flex items-center justify-center px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <FiRefreshCcw className="mr-1" /> Làm mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-4 py-3">Mã phiếu</th>
                <th className="px-4 py-3">Người mượn</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Sách</th>
                <th className="px-4 py-3">Ngày mượn</th>
                <th className="px-4 py-3">Hạn trả</th>
                <th className="px-4 py-3">Ngày trả</th>
                <th className="px-4 py-3">Trạng thái</th>
                {/* NEW */}
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : borrowings.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Không có phiếu mượn nào.
                  </td>
                </tr>
              ) : (
                borrowings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      #{b.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">
                        {b.userFullName || "—"}
                      </div>
                      <div className="text-xs text-slate-500">
                        ID: {b.userId}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {b.userEmail}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">
                        {b.book?.title || "—"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {b.book?.author}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(b.borrowDate)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(b.dueDate)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(b.returnDate)}
                    </td>
                    <td className="px-4 py-3">
                      {renderStatusBadge(b.status)}
                    </td>
                    {/* NEW: nút xác nhận đã trả */}
                    <td className="px-4 py-3">
                      {(b.status === "BORROWED" ||
                        b.status === "OVERDUE") && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Xác nhận đã nhận lại sách và đánh dấu phiếu này là ĐÃ TRẢ?"
                              )
                            ) {
                              handleUpdateStatus(b.id, "RETURNED");
                            }
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          Xác nhận đã trả
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
            <div className="text-xs text-slate-500">
              Trang{" "}
              <span className="font-semibold">
                {page + 1}/{totalPages}
              </span>{" "}
              • Tổng{" "}
              <span className="font-semibold">{totalElements}</span> phiếu
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
              >
                Trước
              </button>
              <button
                onClick={() => handleChangePage(page + 1)}
                disabled={page + 1 >= totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowingsPage;
