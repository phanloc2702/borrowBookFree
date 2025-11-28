
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const LayoutRoot = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar bên trái */}
      <Sidebar />

      {/* Phần bên phải gồm Header + Nội dung */}
      <div className="flex flex-col flex-1">
        <Header /> 
        <main className="flex-1 p-6 bg-gray-100">
          <Outlet /> {/* render route con */}
        </main>
      </div>
    </div>
  );
};

export default LayoutRoot;
