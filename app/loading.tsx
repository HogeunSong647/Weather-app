export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="text-6xl mb-4 animate-bounce">🌤️</div>
        <p className="text-lg font-semibold animate-pulse">날씨 정보를 불러오는 중...</p>
      </div>
    </div>
  );
}
