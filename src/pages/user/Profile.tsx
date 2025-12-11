// src/pages/user/Profile.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import borrowingService, {
  Borrowing,
  BorrowStatus,
} from "../../services/borrowingService";
import borrowRequestService, {
  BorrowRequestResponse,
  BorrowRequestStatus,
} from "../../services/borrowRequestService";

interface AuthUser {
  id: number;
  fullName: string | null;
  email: string;
  role: "USER" | "ADMIN";
}

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(null);

  // Lịch sử mượn (Borrowings)
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loadingBorrowings, setLoadingBorrowings] = useState(true);

  // Đơn mượn (BorrowRequests)
  const [requests, setRequests] = useState<BorrowRequestResponse[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Lấy user từ localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      }
    } catch {
      setUser(null);
    }
  }, []);

  // Gọi API lịch sử mượn (Borrowings)
  useEffect(() => {
    if (!user) {
      setLoadingBorrowings(false);
      return;
    }

    const fetchBorrowings = async () => {
      try {
        const res = await borrowingService.getMyBorrowings(user.id);
        const data = res.data.data || res.data;
        setBorrowings(data || []);
      } catch (err) {
        console.error("Lỗi load lịch sử mượn:", err);
        setBorrowings([]);
      } finally {
        setLoadingBorrowings(false);
      }
    };

    fetchBorrowings();
  }, [user]);

  // Gọi API đơn mượn của user (BorrowRequests)
  useEffect(() => {
    if (!user) {
      setLoadingRequests(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        const res = await borrowRequestService.getMyBorrowRequests(user.id);
        const data = res.data.data || res.data;
        setRequests(data || []);
      } catch (err) {
        console.error("Lỗi load danh sách đơn mượn:", err);
        setRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchRequests();
  }, [user]);

  const getBorrowStatusBadge = (status: BorrowStatus) => {
    switch (status) {
      case "RETURNED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} /> Đã trả
          </span>
        );
      case "BORROWED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock size={12} /> Đang mượn
          </span>
        );
      case "OVERDUE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle size={12} /> Quá hạn
          </span>
        );
      default:
        return null;
    }
  };

  const getRequestStatusBadge = (status: BorrowRequestStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
            <Clock size={12} /> Chờ duyệt
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle size={12} /> Đã duyệt
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertCircle size={12} /> Từ chối
          </span>
        );
      case "CANCELED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Đã hủy
          </span>
        );
      default:
        return status;
    }
  };

  // Tính thống kê từ lịch sử mượn
  const stats = useMemo(() => {
    if (!borrowings.length) {
      return {
        total: 0,
        onTimePercent: 0,
        borrowingCount: 0,
      };
    }

    const total = borrowings.length;
    const returned = borrowings.filter((b) => b.status === "RETURNED");
    const overdue = borrowings.filter((b) => b.status === "OVERDUE");
    const borrowingCount = borrowings.filter(
      (b) => b.status === "BORROWED"
    ).length;

    const onTimeBase = returned.length + overdue.length;
    const onTimePercent =
      onTimeBase === 0
        ? 100
        : Math.round((returned.length / onTimeBase) * 100);

    return {
      total,
      onTimePercent,
      borrowingCount,
    };
  }, [borrowings]);

  // Cảnh báo quá hạn / sắp đến hạn
  const alerts = useMemo(() => {
    const now = new Date();
    const ONE_DAY = 24 * 60 * 60 * 1000;

    let overdueCount = 0;
    let dueSoonCount = 0;

    borrowings.forEach((b) => {
      if (b.status === "RETURNED") return;
      if (!b.dueDate) return;

      const due = new Date(b.dueDate);
      if (Number.isNaN(due.getTime())) return;

      const diffMs = due.getTime() - now.getTime();
      const diffDays = diffMs / ONE_DAY;

      if (b.status === "OVERDUE" || diffDays < 0) {
        overdueCount += 1;
      } else if (diffDays <= 2) {
        dueSoonCount += 1;
      }
    });

    return { overdueCount, dueSoonCount };
  }, [borrowings]);

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("vi-VN");
  };

  // Lấy 3 đơn mượn gần nhất
  const recentRequests = useMemo(() => {
    if (!requests || !requests.length) return [];
    return requests.slice(0, 3);
  }, [requests]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        Chưa có thông tin người dùng. Vui lòng đăng nhập lại.
      </div>
    );
  }

  const displayName =
    user.fullName && user.fullName.trim().length > 0
      ? user.fullName
      : user.email;
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header Banner */}
      <div className="h-48 bg-gradient-to-r from-amber-500 to-amber-600 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217121-9e9f1929c5f7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: User Card */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full p-1 bg-white shadow-md mb-4">
                <div className="w-full h-full rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-4xl font-bold">
                  {avatarLetter}
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                {displayName}
              </h2>
              <p className="text-slate-500 text-sm mb-2">
                {user.role === "ADMIN" ? "Quản trị viên" : "Thành viên thư viện"}
              </p>

              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium mb-6">
                <UserIcon size={14} />
                ID: {user.id}
              </div>

              <div className="w-full space-y-4 text-left border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail size={18} className="text-slate-400" />
                  <span className="text-sm truncate" title={user.email}>
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar size={18} className="text-slate-400" />
                  <span className="text-sm">
                    Ngày tham gia: {/* nếu BE trả createdAt thì hiển thị ở đây */}
                    Chưa cập nhật
                  </span>
                </div>

                {/* Nút đổi mật khẩu */}
                <button
                  onClick={() => navigate("/change-password")}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
                >
                  <Lock size={16} />
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Alerts, Stats, Requests, History */}
          <div className="flex-1 space-y-6">
            {/* Alert: sắp đến hạn / quá hạn */}
            {(alerts.overdueCount > 0 || alerts.dueSoonCount > 0) && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <div className="text-sm font-medium">
                    {alerts.overdueCount > 0 && (
                      <div>
                        Bạn có{" "}
                        <span className="font-bold">
                          {alerts.overdueCount} sách
                        </span>{" "}
                        đã quá hạn trả. Vui lòng sớm trả lại cho thư viện.
                      </div>
                    )}
                    {alerts.dueSoonCount > 0 && alerts.overdueCount === 0 && (
                      <div>
                        Bạn có{" "}
                        <span className="font-bold">
                          {alerts.dueSoonCount} sách
                        </span>{" "}
                        sắp đến hạn trả trong 2 ngày tới.
                      </div>
                    )}
                    {alerts.dueSoonCount > 0 && alerts.overdueCount > 0 && (
                      <div className="mt-1 text-xs text-red-700">
                        Ngoài ra còn{" "}
                        <span className="font-semibold">
                          {alerts.dueSoonCount} sách
                        </span>{" "}
                        sắp đến hạn.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Lượt mượn sách
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.total}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Trả đúng hạn
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.onTimePercent}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Đang mượn
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.borrowingCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Đơn mượn gần đây – hiển thị tên sách */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900">
                  Đơn mượn gần đây
                </h3>
              </div>

              {loadingRequests ? (
                <div className="p-6 text-sm text-slate-500">
                  Đang tải danh sách đơn mượn...
                </div>
              ) : recentRequests.length === 0 ? (
                <div className="p-6 text-sm text-slate-500">
                  Bạn chưa có đơn mượn nào.
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {recentRequests.map((r) => {
                    const booksSummary =
                      r.borrowings && r.borrowings.length > 0
                        ? r.borrowings
                            .map((br) => br.book?.title || "Không rõ")
                            .join(", ")
                        : "Chưa có thông tin sách";

                    return (
                      <li
                        key={r.id}
                        className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            Đơn #{r.id.toString().padStart(5, "0")}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Tạo lúc: {formatDate(r.createdAt)}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Sách:{" "}
                            <span className="font-medium">
                              {booksSummary}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Địa chỉ: {r.address}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getRequestStatusBadge(r.status)}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* History Table – Lịch sử mượn sách */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900">
                  Lịch sử mượn sách
                </h3>
              </div>

              {loadingBorrowings ? (
                <div className="p-8 text-center text-slate-500">
                  Đang tải lịch sử mượn...
                </div>
              ) : borrowings.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  Chưa có lịch sử mượn sách (hoặc đơn đang chờ duyệt).
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-4">Mã phiếu</th>
                        <th className="px-6 py-4">Tên sách</th>
                        <th className="px-6 py-4">Ngày mượn</th>
                        <th className="px-6 py-4">Hạn trả</th>
                        <th className="px-6 py-4">Ngày trả</th>
                        <th className="px-6 py-4">Trạng thái</th>
                        <th className="px-6 py-4">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {borrowings.map((b) => (
                        <tr
                          key={b.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-slate-900">
                            #{b.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-900 font-semibold">
                                {b.book?.title || "Không rõ"}
                              </span>
                              {b.book?.author && (
                                <span className="text-xs text-slate-500">
                                  {b.book.author}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {formatDate(b.borrowDate)}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {formatDate(b.dueDate)}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {formatDate(b.returnDate)}
                          </td>
                          <td className="px-6 py-4">
                            {getBorrowStatusBadge(b.status)}
                          </td>
                          <td className="px-6 py-4">
                            {(b.status === "BORROWED" ||
                              b.status === "OVERDUE") ? (
                              <button
                                onClick={() =>
                                  navigate(`/return-guide/${b.id}`)
                                }
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                              >
                                Trả sách
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          {/* end Right Column */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
