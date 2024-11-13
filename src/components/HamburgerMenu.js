import { MenuOutlined } from "@ant-design/icons";

export default function HamburgerMenu({ isOpen, toggleSidebar }) {
  return (
    <button
      className={`flex items-center space-x-2 text-lg md:text-2xl  px-4 py-2 rounded-lg transition-colors duration-300 ${
        isOpen ? "text-black bg-white" : "text-black bg-white"
      }`}
      onClick={toggleSidebar}
    >
      <MenuOutlined />
      <span className="text-xs md:text-sm font-semibold">
        {isOpen ? "Close navigation" : "Click to show navigation links"}
      </span>
    </button>
  );
}