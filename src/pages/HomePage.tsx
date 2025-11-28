// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FiBook, FiUsers, FiBookOpen } from 'react-icons/fi';

// // Fake type
// interface DashboardStats {
//   totalBooks: number;
//   totalCategories: number;
//   totalUsers: number;
// }

// const HomePage: React.FC = () => {
//   // Fake auth
//   const [isAuthenticated] = useState(false);

//   // Fake stats
//   const [stats, setStats] = useState<DashboardStats | null>(null);

//   useEffect(() => {
//     // Thay vì gọi API thì fake data
//     const fakeStats: DashboardStats = {
//       totalBooks: 123,
//       totalCategories: 12,
//       totalUsers: 45,
//     };
//     setStats(fakeStats);
//   }, []);

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-20">
//         <div className="container mx-auto px-4">
//           <div className="max-w-3xl mx-auto text-center">
//             <h1 className="text-5xl font-bold mb-6">
//               Chào mừng đến với BookLibrary
//             </h1>
//             <p className="text-xl mb-8 text-primary-100">
//               Hệ thống quản lý thư viện hiện đại - Mượn sách dễ dàng, quản lý thông minh
//             </p>
//             <div className="flex justify-center space-x-4">
//               {isAuthenticated ? (
//                 <>
//                   <Link
//                     to="/books"
//                     className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
//                   >
//                     Xem sách
//                   </Link>
//                   <Link
//                     to="/dashboard"
//                     className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition border border-white"
//                   >
//                     Dashboard
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     to="/register"
//                     className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
//                   >
//                     Đăng ký ngay
//                   </Link>
//                   <Link
//                     to="/login"
//                     className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition border border-white"
//                   >
//                     Đăng nhập
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       {stats && (
//         <section className="py-16 bg-white">
//           <div className="container mx-auto px-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div className="text-center p-8 bg-primary-50 rounded-lg">
//                 <FiBook className="text-5xl text-primary-600 mx-auto mb-4" />
//                 <h3 className="text-4xl font-bold text-gray-800 mb-2">
//                   {stats.totalBooks}
//                 </h3>
//                 <p className="text-gray-600">Tổng số sách</p>
//               </div>
//               <div className="text-center p-8 bg-green-50 rounded-lg">
//                 <FiBookOpen className="text-5xl text-green-600 mx-auto mb-4" />
//                 <h3 className="text-4xl font-bold text-gray-800 mb-2">
//                   {stats.totalCategories}
//                 </h3>
//                 <p className="text-gray-600">Danh mục</p>
//               </div>
//               <div className="text-center p-8 bg-blue-50 rounded-lg">
//                 <FiUsers className="text-5xl text-blue-600 mx-auto mb-4" />
//                 <h3 className="text-4xl font-bold text-gray-800 mb-2">
//                   {stats.totalUsers}
//                 </h3>
//                 <p className="text-gray-600">Người dùng</p>
//               </div>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Features Section */}
//       <section className="py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
//             Tính năng nổi bật
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
//                 <FiBook className="text-2xl text-primary-600" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Thư viện phong phú</h3>
//               <p className="text-gray-600">
//                 Hàng nghìn đầu sách đa dạng từ nhiều thể loại khác nhau
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
//                 <FiBookOpen className="text-2xl text-green-600" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Mượn sách dễ dàng</h3>
//               <p className="text-gray-600">
//                 Quy trình mượn sách nhanh chóng và tiện lợi chỉ với vài click
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
//                 <FiUsers className="text-2xl text-blue-600" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Quản lý thông minh</h3>
//               <p className="text-gray-600">
//                 Theo dõi lịch sử mượn sách và quản lý tài khoản dễ dàng
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       {!isAuthenticated && (
//         <section className="py-16 bg-primary-600 text-white">
//           <div className="container mx-auto px-4 text-center">
//             <h2 className="text-3xl font-bold mb-4">
//               Sẵn sàng khám phá thư viện?
//             </h2>
//             <p className="text-xl mb-8 text-primary-100">
//               Đăng ký ngay để bắt đầu mượn sách yêu thích của bạn
//             </p>
//             <Link
//               to="/register"
//               className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
//             >
//               Đăng ký miễn phí
//             </Link>
//           </div>
//         </section>
//       )}
//     </div>
//   );
// };

// export default HomePage;


import { 
  FiBook, 
  FiUsers, 
  FiArrowUpCircle, 
  FiAlertTriangle,
  FiActivity 
} from 'react-icons/fi'; // Import thêm icon cần thiết

const HomePage = () => {
  // Dữ liệu giả định cho Dashboard (thực tế sẽ lấy từ API)
  const dashboardStats = [
    {
      title: "Tổng số sách",
      value: "1,245",
      icon: <FiBook className="text-3xl text-amber-400" />,
      bgColor: "bg-slate-700",
    },
    {
      title: "Tổng số người dùng",
      value: "320",
      icon: <FiUsers className="text-3xl text-amber-400" />,
      bgColor: "bg-slate-700",
    },
    {
      title: "Đang được mượn",
      value: "128",
      icon: <FiArrowUpCircle className="text-3xl text-amber-400" />,
      bgColor: "bg-slate-700",
    },
    {
      title: "Sách quá hạn",
      value: "12",
      icon: <FiAlertTriangle className="text-3xl text-red-500" />, // Màu đỏ cho cảnh báo
      bgColor: "bg-slate-700",
    },
  ];

  // Dữ liệu giả định cho hoạt động gần đây
  const recentActivities = [
    { id: 1, user: "Nguyễn Văn A", book: "Lập trình React", action: "Mượn", date: "2023-10-26" },
    { id: 2, user: "Trần Thị B", book: "Cấu trúc dữ liệu", action: "Trả", date: "2023-10-25" },
    { id: 3, user: "Lê Văn C", book: "Thuật toán nâng cao", action: "Mượn", date: "2023-10-25" },
    { id: 4, user: "Phạm Thị D", book: "Clean Code", action: "Quá hạn", date: "2023-10-24" },
    { id: 5, user: "Hoàng Văn E", book: "Design Patterns", action: "Trả", date: "2023-10-24" },
  ];

  return (
    // Toàn bộ trang Home, flex-grow để chiếm hết không gian còn lại
    <div className="flex-grow p-8 bg-gray-100 min-h-screen"> 
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8">Tổng quan Dashboard</h2>

      {/* Các thẻ thống kê chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {dashboardStats.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.bgColor} p-6 rounded-lg shadow-xl flex items-center justify-between text-white border-b-4 border-amber-500`}
          >
            <div>
              <p className="text-sm font-medium text-gray-300">{stat.title}</p>
              <p className="text-4xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className="ml-4">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Hoạt động gần đây */}
      <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-amber-500">
        <div className="flex items-center text-gray-800 mb-6">
          <FiActivity className="text-2xl mr-3 text-amber-500" />
          <h3 className="text-xl font-semibold ">Hoạt động gần đây</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sách
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {activity.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {activity.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {activity.book}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      activity.action === 'Mượn' ? 'bg-blue-100 text-blue-800' :
                      activity.action === 'Trả' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800' // Quá hạn
                    }`}>
                      {activity.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {activity.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomePage;