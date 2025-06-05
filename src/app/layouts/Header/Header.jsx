import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { sCountItem } from "../../context/store.js";
import Search from "./Search.jsx";
import GameShortCut from "../../pages/GameShortCut/GameShortCut.jsx";
import API_BASE_URL from "../../apiConfig.js";

const ITEMS_PER_PAGE = 8;

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Kiểm tra token để biết đã đăng nhập hay chưa
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true nếu có token
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/Category`, {
          params: {
            page: 1,
            pageSize: 30,
            sortBy: "categoryid",
            sortOrder: "asc"
          }
        });
        const cats = res?.data?.data?.categories || [];
        setCategories(cats);
        if (cats[0]) setHoveredCategory(cats[0].categoryid);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    })();
  }, []);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const currentItems = categories.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const animatePageChange = (newPage, direction) => {
    if (animating || newPage < 0 || newPage >= totalPages) return;
    setAnimating(true);
    const outClass = `slide-out-${direction}`;
    const inClass = `slide-in-${direction === "left" ? "right" : "left"}`;
    menuRef.current?.classList.add(outClass);
    setTimeout(() => {
      setCurrentPage(newPage);
      menuRef.current?.classList.remove(outClass);
      menuRef.current?.classList.add(inClass);
      setTimeout(() => {
        menuRef.current?.classList.remove(inClass);
        setAnimating(false);
      }, 300);
    }, 300);
  };

  // ✅ Xử lý click vào icon user
  const handleUserClick = () => {
    if (isLoggedIn) {
      navigate("/account/information");
    } else {
      navigate("/login");
    }
  };

  return (
    <header
      className="bg-white shadow-sm sticky top-0 z-50"
      onClick={(e) => {
        if (
          !e.target.closest(
            ".category-panel, .category-trigger, .menu-dropdown, .horizontal-nav-item"
          )
        )
          setShowDropdown(false);
      }}
    >
      {/* <GameShortCut /> */}

      <div className="px-32 grid grid-cols-3 items-center w-full pt-2">
        <div
          onClick={() => navigate("/")}
          className="flex flex-col items-start group ml-10 pt-2 cursor-pointer"
        >
          <img
            src="https://salt.tikicdn.com/ts/upload/0e/07/78/ee828743c9afa9792cf20d75995e134e.png"
            alt="Logo"
            className="h-10 transition-transform group-hover:scale-110"
          />
          <span className="text-sm font-medium text-gray-600 group-hover:text-blue-500">
            Tốt &amp; Nhanh
          </span>
        </div>

        <Search />

        <div className="flex justify-end items-center space-x-5 pr-10">
          {/* ✅ Icon User chuyển theo trạng thái login */}
          <button
            onClick={handleUserClick}
            className="group bg-transparent border-none cursor-pointer"
          >
            <i className="pi pi-user text-xl group-hover:scale-110 transition-transform duration-150"></i>
          </button>

          {/* Cart Icon + Badge */}
          <div
            onClick={() => navigate("/step/cart")}
            className="relative group cursor-pointer"
          >
            <i className="pi pi-shopping-cart text-xl group-hover:scale-110 transition-transform duration-150"></i>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-bounce">
              {sCountItem.use()}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-b border-gray-200 mt-3">
        <nav
          className="flex items-center justify-between py-2"
          onMouseLeave={() => setShowDropdown(false)}
        >
          {categories.length > ITEMS_PER_PAGE && (
            <button
              onClick={() => animatePageChange(currentPage - 1, "right")}
              disabled={currentPage === 0 || animating}
            >
              &lt;
            </button>
          )}

          <div ref={menuRef} className="flex overflow-hidden">
            {currentItems.map((item) => (
              <div key={item.categoryid}>
                <div
                  onClick={() => navigate(`/category/${item.categoryid}`)}
                  className="px-3 py-1 text-gray-700 hover:text-blue-500 cursor-pointer"
                >
                  {item.categoryname}
                </div>
              </div>
            ))}
          </div>

          {categories.length > ITEMS_PER_PAGE && (
            <button
              onClick={() => animatePageChange(currentPage + 1, "left")}
              disabled={currentPage >= totalPages - 1 || animating}
            >
              &gt;
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
