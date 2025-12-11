// src/pages/admin/HomePage.tsx
import React, { useEffect, useState } from "react";
import {
  FiBook,
  FiUsers,
  FiArrowUpCircle,
  FiAlertTriangle,
  FiActivity,
} from "react-icons/fi";
import { toast } from "react-toastify";
import dashboardService, {
  DashboardSummary,
  RecentActivity,
} from "../../services/dashboardService";

const HomePage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);
      const res = await dashboardService.getSummary();
      const data = res.data.data || res.data;
      setSummary(data);
    } catch (error) {
      console.error("Lỗi load dashboard summary:", error);
      toast.error("Không tải được thống kê tổng quan");
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      const res = await dashboardService.getRecentActivities(5);
      const data = res.data.data || res.data;
      setActivities(data || []);
    } catch (error) {
      console.error("Lỗi load hoạt động gần đây:", error);
      toast.error("Không tải được hoạt động gần đây");
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchActivities();
  }, []);

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("vi-VN");
  };

  // Map từ action hệ thống -> label & màu hiển thị
  const renderActionBadge = (action: RecentActivity["action"]) => {
    switch (action) {
      case "BORROW":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            Mượn
          </span>
        );
      case "RETURN":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Trả
          </span>
        );
      case "OVERDUE":
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Quá hạn
          </span>
        );
    }
  };

  // Chuẩn bị dữ liệu cho 4 thẻ thống kê
  const dashboardStats = [
    {
      title: "Tổng số sách",
      value: summary ? summary.totalBooks.toLocaleString("vi-VN") : "...",
      icon: <FiBook className="text-3xl text-amber-400" />,
      bgColor: "bg-slate-700",
    },
    {
      title: "Tổng số người dùng",
      value: summary ? summary.totalUsers.toLocaleString("vi-VN") : "...",
      icon: <FiUsers className="text-3xl text-amber-400" />,
      bgColor: "bg-slate-700",
    },
    {
      title: "Đang được mượn",
      value: summary ? summary.borrowingCount.toLocaleString("vi-VN") : "...",
      icon: <FiArrowUpCircle className="text-3xl text-amber-400" />,
      bgColor: "bg-slate-700",
    },
    {
      title: "Sách quá hạn",
      value: summary ? summary.overdueCount.toLocaleString("vi-VN") : "...",
      icon: <FiAlertTriangle className="text-3xl text-red-500" />,
      bgColor: "bg-slate-700",
    },
  ];

  return (
    <div className="flex-grow p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8">
        Tổng quan Dashboard
      </h2>

      {/* Các thẻ thống kê chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} p-6 rounded-lg shadow-xl flex items-center justify-between text-white border-b-4 border-amber-500`}
          >
            <div>
              <p className="text-sm font-medium text-gray-300">{stat.title}</p>
              <p className="text-4xl font-bold mt-1">
                {loadingSummary && !summary ? "..." : stat.value}
              </p>
            </div>
            <div className="ml-4">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Hoạt động gần đây */}
      <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-amber-500">
        <div className="flex items-center text-gray-800 mb-6">
          <FiActivity className="text-2xl mr-3 text-amber-500" />
          <h3 className="text-xl font-semibold">Hoạt động gần đây</h3>
        </div>

        {loadingActivities ? (
          <div className="py-6 text-sm text-gray-500">
            Đang tải hoạt động gần đây...
          </div>
        ) : activities.length === 0 ? (
          <div className="py-6 text-sm text-gray-500">
            Chưa có hoạt động nào gần đây.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sách
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {activity.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {activity.bookTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {renderActionBadge(activity.action)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(activity.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
