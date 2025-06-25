export default function ChatHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-white fixed top-0 right-0 w-full z-40">
      <div className="flex items-center gap-2">
        {/* 768px 미만에서만 햄버거 버튼 */}
        <button id="mobile-sidebar-trigger" className="p-2 rounded-full bg-gray-100 block md:hidden">
          <span className="sr-only">Open sidebar</span>
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-xl text-blue ml-2">The First Take</span>
      </div>
      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
        U
      </div>
    </div>
  );
}
