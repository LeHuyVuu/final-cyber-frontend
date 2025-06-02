import { useState, useEffect, useRef } from "react";
import { getData } from "../../context/api"; // Giả sử đây là utility API của bạn
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

const Search = () => {

    const [keyword, setKeyword] = useState(""); // Lưu từ khóa tìm kiếm
    const [suggestions, setSuggestions] = useState([]); // Lưu danh sách gợi ý
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Kiểm tra dropdown có mở hay không
    const [isLoading, setIsLoading] = useState(false); // Kiểm tra trạng thái đang tải
    const [error, setError] = useState(null); // Lỗi khi gọi API
    const dropdownRef = useRef(null); // Ref cho dropdown để kiểm tra click ngoài
    const navigate = useNavigate();
    const [isListening, setIsListening] = useState(false); // Kiểm tra trạng thái mic

    // Hàm lấy giá trị cookie
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    // Hàm thiết lập trackity_id
    const getTrackityId = () => {
        let trackityId = getCookie("trackity");
        if (!trackityId) {
            console.warn(
                "Không tìm thấy trackity_id trong cookie, sử dụng giá trị giả lập"
            );
            trackityId = "9ca266ff-e45f-a26c-c34b-403e42e1af4c";
        }
        return trackityId;
    };

    // Hàm gọi API tìm kiếm gợi ý
    const fetchSuggestions = async (query) => {
        const trackityId = getTrackityId();
        if (!trackityId) {
            setError("Không thể lấy trackity_id");
            return [];
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await getData(
                `https://tiki.vn/api/v2/search/suggestion?q=${query}`
            );
            setIsLoading(false);
            return response.data.data || [];
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            setError(
                error.response?.data?.message || "Lỗi khi gọi API (có thể do CORS)"
            );
            setIsLoading(false);
            return [];
        }
    };

    // Xử lý khi người dùng nhập từ khóa
    useEffect(() => {
        if (keyword.length < 2) {
            setSuggestions([]);
            setIsDropdownOpen(false);
            setError(null);
            return;
        }

        // Debounce
        const debounceTimeout = setTimeout(async () => {
            const results = await fetchSuggestions(keyword);
            setSuggestions(results);
            setIsDropdownOpen(results.length > 0);
        }, 300); // 300ms debounce time

        return () => clearTimeout(debounceTimeout); // Clear previous timeout
    }, [keyword]);

    // Ẩn dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Xử lý khi nhấn Enter để tìm kiếm
    const handleSearch = async () => {
        if (keyword.length < 2) {
            setError("Vui lòng nhập ít nhất 2 ký tự để tìm kiếm!");
            return;
        }

        // Gọi API tìm kiếm sản phẩm
        try {
            setIsLoading(true);
            const trackityId = getTrackityId();
            const response = await getData(
                `https://tiki.vn/api/v2/products?limit=40&include=advertisement&aggregations=2&trackity_id=${trackityId}&q=${encodeURIComponent(keyword)}`
            );
            setIsLoading(false);

            // Extract filter data and search results
            const dataSearch = response.data;
            const filterData = response.data.aggregations?.filters || [];

            // Navigate to search results page with both data and filter information
            navigate(`/search?q=${keyword}`, {
                state: {
                    dataSearch,
                    filters: {
                        attributes: filterData,
                    },
                },
            });
        } catch (error) {
            console.error("Lỗi khi gọi API tìm kiếm sản phẩm:", error);
            setError("Không thể tìm thấy sản phẩm!");
            setIsLoading(false);
        }
    };

    // Xử lý khi click vào item trong danh sách gợi ý
    const handleItemClick = async (item) => {
        try {
            setIsLoading(true);
            const trackityId = getTrackityId();
            // Gọi API tìm kiếm sản phẩm khi click vào item
            const response = await getData(
                `https://tiki.vn/api/v2/products?limit=40&include=advertisement&aggregations=2&trackity_id=${trackityId}&q=${encodeURIComponent(item.keyword)}`
            );
            setIsLoading(false);

            // Extract filter data and search results
            const dataSearch = response.data;
            const filterData = response.data.aggregations?.filters || [];

            // Navigate with both product data and filter information
            navigate(`/search?q=${item.keyword}`, {
                state: {
                    dataSearch,
                    filters: {
                        attributes: filterData,
                    },
                },
            });
        } catch (error) {
            console.error("Lỗi khi gọi API tìm kiếm sản phẩm:", error);
            setError("Không thể tìm thấy sản phẩm!");
            setIsLoading(false);
        }
    };

    // Xử lý khi bật/tắt mic
    const handleMicClick = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'vi-VN'; // Chọn ngôn ngữ là tiếng Việt
        recognition.interimResults = true; // Cho phép kết quả tạm thời

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setKeyword(transcript); // Đặt từ khóa từ giọng nói

            // Sau khi có kết quả, tự động gọi handleSearch để tìm kiếm
            handleSearch();
        };

        recognition.start();
    };


    return (
        <div className="relative flex justify-end items-center pr-4 md:pr-8">
            <div className="relative group w-full max-w-xl sm:max-w-2xl md:max-w-4xl lg:max-w-5xl">
                <div className="relative">
                    <input
                        type="search"
                        name="q"
                        id="HeaderSearchInput"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)} // Cập nhật keyword khi người dùng nhập
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch(); // Xử lý khi nhấn Enter
                        }}
                        className="w-full border border-gray-200 rounded-full py-2 px-6 pl-14 text-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                        placeholder="Search products..."
                    />
                    <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>


            <Button
                onClick={handleMicClick}
                icon="pi pi-microphone"
                className="p-button-rounded p-button-info absolute -right-7 top-1/2 transform -translate-y-1/2 p-2 hover:bg-blue-300 transition-colors duration-200 focus:shadow-outline focus:ring-2 focus:ring-blue-300"
                aria-label="Search by voice"
            />
            {/* Loading state */}
            {isLoading && (
                <div className="absolute top-full left-0 w-full max-w-xl sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20 text-gray-500 text-base">
                    Đang tải...
                </div>
            )}
            {/* Error state */}
            {error && (
                <div className="absolute top-full left-0 w-full max-w-xl sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mt-2 bg-white border border-red-200 rounded-lg shadow-lg p-4 z-20 text-red-600 text-base">
                    {error}
                </div>
            )}
            {/* Suggestions dropdown */}
            {isDropdownOpen && suggestions.length > 0 && !isLoading && !error && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 w-full max-w-xl sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto"
                    style={{
                        fontSize: "1.125rem", // Điều chỉnh kích thước chữ trong gợi ý
                        padding: "0.75rem", // Điều chỉnh padding giữa các item
                        width: "95%", // Điều chỉnh chiều rộng của dropdown
                    }}
                >
                    {suggestions.map((item, index) => (
                        <div
                            key={index}
                            className="p-4 text-gray-700 text-base cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150 flex items-center justify-between"
                            onClick={() => handleItemClick(item)} // Gọi API khi nhấn vào item
                        >
                            <span className="flex-1">{item.keyword}</span>
                            <button
                                className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
                                onClick={(e) => {
                                    e.stopPropagation(); // Ngừng sự kiện click cho item khi nhấn vào kính lúp
                                    console.log("Search for: ", item.keyword);
                                    // Bạn có thể xử lý tìm kiếm hoặc điều hướng ở đây
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 cursor-pointer"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    onClick={() => setKeyword("")} // Khi nhấn vào kính lúp, xóa nội dung ô tìm kiếm
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
