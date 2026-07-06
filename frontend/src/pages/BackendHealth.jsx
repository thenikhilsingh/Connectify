import { LoaderCircle, Rocket } from "lucide-react";

export default function BackendHealth() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-xl p-12 max-w-lg w-full text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-violet-100 flex items-center justify-center mb-6">
          <Rocket size={40} className="text-violet-600" />
        </div>

        <h1 className="text-4xl font-bold text-violet-600">Connectify</h1>

        <h2 className="text-2xl font-semibold mt-6">Starting Backend...</h2>

        <p className="text-gray-500 mt-4 leading-7">
          Our backend is waking up because it has been idle.
          <br />
          This usually takes{" "}
          <span className="font-semibold">20–60 seconds</span>.
          <br />
          Please keep this page open while we connect you.
        </p>

        <div className="mt-10 flex justify-center">
          <LoaderCircle size={48} className="text-violet-600 animate-spin" />
        </div>

        <p className="mt-6 text-violet-600 font-medium animate-pulse">
          Connecting to server...
        </p>

        <div className="mt-8 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-violet-600 h-full animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  );
}
