import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <>
      <div className="flex min-h-screen bg-[#f5f7fb]">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
