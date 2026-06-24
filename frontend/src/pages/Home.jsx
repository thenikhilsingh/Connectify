export default function Home() {
  return (
    <div className="grid grid-cols-[1fr_320px] gap-6 p-6">
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          Create Post Card
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm h-80">
          Feed Posts
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">Who To Follow</div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">Trending</div>
      </div>
    </div>
  );
}
