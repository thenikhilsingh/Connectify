import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import BackendHealth from "./pages/BackendHealth";
import useAxios from "./hooks/useAxios";

function App() {
  const api = useAxios();
  const [backendReady, setBackendReady] = useState(false);
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.get("/api/health");

        if (response.status === 200) {
          setBackendReady(true);
        }
      } catch {
        setTimeout(checkBackend, 3000); // retry after 3 seconds
      }
    };

    checkBackend();
  }, []);

  if (!backendReady) {
    return <BackendHealth />;
  }
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
