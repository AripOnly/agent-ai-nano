// apps/web/src/layout/index.jsx

import Sidebar from "./Sidebar.jsx";
import MainContent from "./MainContent.jsx";

export default function MainLayout() {
  return (
    <>
      <div className="flex w-full h-screen relative overflow-hidden">
        {/* sidebar */}
        <Sidebar></Sidebar>

        {/* main content */}
        <MainContent></MainContent>
      </div>
    </>
  );
}
