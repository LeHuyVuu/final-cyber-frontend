import { useState, useEffect, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Rating } from "primereact/rating";
import { Badge } from "primereact/badge";
import { OverlayPanel } from "primereact/overlaypanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faTag,
  faChevronDown,
  faHeart,
  faShoppingCart,
  faStar,
  faTimes,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

function ShowingProduct({ categoryId, categoryName, categoryUrlKey }) {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  });

  // API Configuration
  const API_BASE_URL = "https://tiki.vn/api/personalish/v1/blocks/listings";
  const API_PARAMS = {
    limit: 10,
    sort: "top_seller",
    page: 1,
    urlKey: categoryUrlKey || "dam-dang-xoe",
    category: categoryId || 27582,
  };

  const [sortOptions] = useState([
    { label: "Phổ biến", value: "default" },
    { label: "Bán chạy", value: "top_seller" },
    { label: "Hàng mới", value: "newest" },
    { label: "Giá thấp đến cao", value: "price,asc" },
    { label: "Giá cao đến thấp", value: "price,desc" },
  ]);

  const [sortKey, setSortKey] = useState("top_seller");
  const [filters, setFilters] = useState({
    materials: [],
    patterns: [],
    colors: [],
  });

  const [checkboxFilters, setCheckboxFilters] = useState({
    fastDelivery: false,
    freeShip: false,
    fourPlusStar: false,
    topDeal: false,
  });

  const colorPanelRef = useRef(null);
  const [hoverProduct, setHoverProduct] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState(0);

  // Materials, patterns, and colors options
  const materials = [
    { name: "Dơi", key: "bat" },
    { name: "Cotton", key: "cotton" },
    { name: "Len", key: "wool" },
    { name: "Ren", key: "lace" },
    { name: "Lụa", key: "silk" },
    { name: "Vải thun", key: "jersey" },
    { name: "Vải lanh", key: "linen" },
    { name: "Vải nhung", key: "velvet" },
    { name: "Vải cotton pha", key: "cottonBlend" },
    { name: "Vải polyester", key: "polyester" },
    { name: "Vải chiffon", key: "chiffon" },
    { name: "Vải satin", key: "satin" },
  ];

  const patterns = [
    { name: "Trơn", key: "plain" },
    { name: "Hoa lá", key: "floral" },
    { name: "Chấm bi", key: "polka" },
    { name: "Kẻ sọc", key: "striped" },
    { name: "Hình học", key: "geometric" },
    { name: "Cổ điển", key: "vintage" },
    { name: "Thể thao", key: "sporty" },
    { name: "Hoạt hình", key: "cartoon" },
    { name: "Đường kẻ", key: "lined" },
  ];

  const colors = [
    { name: "Xanh dương", key: "blue", hex: "#3b82f6" },
    { name: "Nâu", key: "brown", hex: "#92400e" },
    { name: "Đen", key: "black", hex: "#000000" },
    { name: "Hồng", key: "pink", hex: "#ec4899" },
    { name: "Trắng", key: "white", hex: "#ffffff" },
    { name: "Kem", key: "cream", hex: "#fef9c3" },
    { name: "Xám", key: "gray", hex: "#6b7280" },
    { name: "Đỏ", key: "red", hex: "#ef4444" },
    { name: "Xanh lá", key: "green", hex: "#22c55e" },
    { name: "Vàng", key: "yellow", hex: "#facc15" },
    { name: "Tím", key: "purple", hex: "#a855f7" },
  ];

  // Fetch data from Tiki API
  const fetchProducts = async (page = 1, sort = sortKey) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        ...API_PARAMS,
        page: page.toString(),
        sort: sort,
      });

      const response = await fetch(`${API_BASE_URL}?${queryParams}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Transform API data to match our component structure
      const transformedProducts = data.data.map((item) => ({
        id: item.id,
        name: item.name,
        brand: item.brand_name,
        price: item.price,
        originalPrice: item.original_price,
        discount: item.discount_rate,
        variations:
          item.badges_new
            ?.find((badge) => badge.code === "variant_count")
            ?.arr_text?.map((text) => text.value) || [],
        delivery:
          item.badges_new?.find((badge) => badge.code === "delivery_info_badge")
            ?.text || "Giao hàng tiêu chuẩn",
        promo:
          item.discount > 0 ? `Giảm ${item.discount.toLocaleString()}đ` : null,
        image: item.thumbnail_url,
        freeShip:
          item.visible_impression_info?.amplitude?.is_freeship_xtra || false,
        materials: [], // API doesn't provide this
        patterns: [], // API doesn't provide this
        colors: item.option_color || [],
        rating: item.rating_average,
        fastDelivery:
          item.badges_new?.some((badge) => badge.code === "tikinow") || false,
        reviews: item.review_count,
        authentic:
          item.badges_new?.some((badge) => badge.code === "authentic_brand") ||
          false,
        quantitySold: item.quantity_sold?.value || 0,
      }));

      // Update pagination info
      setPagination({
        currentPage: data.paging.current_page,
        totalPages: data.paging.last_page,
        totalItems: data.paging.total,
        perPage: data.paging.per_page,
      });

      setAllProducts(transformedProducts);
      setProducts(transformedProducts);
    } catch (err) {
      setError("Không thể tải dữ liệu sản phẩm");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and when category changes
  useEffect(() => {
    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  // Handle sort change
  useEffect(() => {
    if (categoryId) {
      fetchProducts(1, sortKey);
    }
  }, [sortKey, categoryId]);

  // Handle page change
  const handlePageChange = (page) => {
    fetchProducts(page, sortKey);
  };

  // Count total active filters
  useEffect(() => {
    let count = 0;
    count += filters.materials.length;
    count += filters.patterns.length;
    count += filters.colors.length;

    if (checkboxFilters.fastDelivery) count++;
    if (checkboxFilters.freeShip) count++;
    if (checkboxFilters.topDeal) count++;
    if (checkboxFilters.fourPlusStar) count++;

    setFiltersApplied(count);
  }, [filters, checkboxFilters]);

  // Apply filters and sorting
  useEffect(() => {
    let filteredProducts = [...allProducts];

    // Apply material filters
    if (filters.materials.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.materials?.some((material) =>
          filters.materials.includes(material)
        )
      );
    }

    // Apply pattern filters
    if (filters.patterns.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.patterns?.some((pattern) => filters.patterns.includes(pattern))
      );
    }

    // Apply color filters
    if (filters.colors.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.colors?.some((color) => filters.colors.includes(color))
      );
    }

    // Apply checkbox filters
    if (checkboxFilters.fastDelivery) {
      filteredProducts = filteredProducts.filter(
        (product) => product.fastDelivery
      );
    }

    if (checkboxFilters.freeShip) {
      filteredProducts = filteredProducts.filter((product) => product.freeShip);
    }
    if (checkboxFilters.topDeal) {
      filteredProducts = filteredProducts.filter((product) => product.topDeal);
    }

    if (checkboxFilters.fourPlusStar) {
      filteredProducts = filteredProducts.filter(
        (product) => product.rating >= 4
      );
    }

    // Apply sorting
    if (sortKey) {
      if (sortKey === "price-asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (sortKey === "price-desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else if (sortKey === "rating-desc") {
        filteredProducts.sort((a, b) => b.rating - a.rating);
      } else if (sortKey === "newest") {
        // For demo purposes, we'll just reverse the array to simulate newest
        filteredProducts.reverse();
      }
    }

    setProducts(filteredProducts);
  }, [allProducts, filters, checkboxFilters, sortKey]);

  // Handle filter change
  const onFilterChange = (e, category, item) => {
    const checked = e.checked;
    let newFilters = { ...filters };

    if (checked) {
      newFilters[category] = [...newFilters[category], item.key];
    } else {
      newFilters[category] = newFilters[category].filter(
        (key) => key !== item.key
      );
    }

    setFilters(newFilters);
  };

  // Handle checkbox filter change
  const handleCheckboxChange = (e, key) => {
    setCheckboxFilters({
      ...checkboxFilters,
      [key]: e.checked,
    });
  };

  // Toggle color filter
  const toggleColorFilter = (color) => {
    let newColors = [...filters.colors];
    if (newColors.includes(color)) {
      newColors = newColors.filter((c) => c !== color);
    } else {
      newColors.push(color);
    }

    setFilters({
      ...filters,
      colors: newColors,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      materials: [],
      patterns: [],
      colors: [],
    });
    setCheckboxFilters({
      fastDelivery: false,
      freeShip: false,
      topDeal: false,
      fourPlusStar: false,
    });
    setSortKey(null);
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Item template for the products
  const itemTemplate = (product) => {
    const isHovered = hoverProduct === product.id;

    return (
      <div
        className="col-span-1 group relative"
        onMouseEnter={() => setHoverProduct(product.id)}
        onMouseLeave={() => setHoverProduct(null)}
      >
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
          <div className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Quick Actions Overlay */}
            <div
              className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-3 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200">
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200">
                <FontAwesomeIcon icon={faShoppingCart} />
              </button>
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>

            {/* Labels */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.discount > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded shadow-sm">
                  -{product.discount}%
                </span>
              )}
            </div>

            {product.freeShip && (
              <div className="absolute bottom-0 left-0">
                <img
                  src="https://salt.tikicdn.com/ts/upload/b2/8d/56/3086efc2194320a6b83fba7530de7c78.png"
                  alt=""
                />
              </div>
            )}

            {product.authentic && (
              <div className="absolute bottom-0 right-0">
                <img
                  src="https://salt.tikicdn.com/ts/upload/c2/bc/6d/ff18cc8968e2bbb43f7ac58efbfafdff.png"
                  alt=""
                />
              </div>
            )}
          </div>

          <div className="p-3 flex flex-col flex-grow min-h-52">
            <div className="mb-1">
              <div className="flex items-center mb-1">
                <span className="text-red-500 font-bold text-base">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="ml-2 text-gray-400 text-xs line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                  {product.brand}
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">
                    <FontAwesomeIcon icon={faStar} size="xs" />
                  </span>
                  <span className="text-xs text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>
            </div>

            <h3 className="text-gray-800 text-sm font-medium mb-2 line-clamp-2 h-10 hover:text-blue-600 transition-colors">
              {product.name}
            </h3>

            <div className="flex flex-wrap gap-1 mb-2 min-h-[1.5rem]">
              {product.variations &&
                product.variations.map((variation, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-sm"
                  >
                    {variation}
                  </span>
                ))}
            </div>

            {product.promo && (
              <div className="flex items-center text-xs text-blue-600 mb-1">
                <FontAwesomeIcon
                  icon={faTag}
                  className="mr-1.5 text-blue-600"
                  size="xs"
                />
                {product.promo}
              </div>
            )}

            <div className="flex justify-between items-center mt-auto">
              <div className="text-xs text-gray-500">{product.delivery}</div>

              {product.fastDelivery && (
                <span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full border border-red-200">
                  2H
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-4 bg-gray-50">
      {/* Header with applied filters counter */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-gray-800">
          {categoryName || "Tất cả sản phẩm"}
          {filtersApplied > 0 && (
            <Badge
              value={filtersApplied}
              severity="info"
              className="ml-2"
            ></Badge>
          )}
        </h2>

        {filtersApplied > 0 && (
          <Button
            label="Xóa bộ lọc"
            icon="pi pi-filter-slash"
            className="p-button-outlined p-button-sm"
            onClick={resetFilters}
          />
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {/* Error State */}
      {error && <div className="text-center py-8 text-red-500">{error}</div>}

      {/* Main Categories */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex flex-col space-y-4">
          <div>
            <p className="text-gray-500 text-sm mb-2.5 font-medium">
              Chất liệu
            </p>
            <div className="flex flex-wrap gap-2">
              {materials.map((material) => (
                <div
                  key={material.key}
                  className={`px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all duration-200 ${
                    filters.materials.includes(material.key)
                      ? "bg-blue-50 border-blue-400 text-blue-600 shadow-sm"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                  onClick={() =>
                    onFilterChange(
                      { checked: !filters.materials.includes(material.key) },
                      "materials",
                      material
                    )
                  }
                >
                  {material.name}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-2.5 font-medium">Họa tiết</p>
            <div className="flex flex-wrap gap-2">
              {patterns.map((pattern) => (
                <div
                  key={pattern.key}
                  className={`px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all duration-200 ${
                    filters.patterns.includes(pattern.key)
                      ? "bg-blue-50 border-blue-400 text-blue-600 shadow-sm"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                  onClick={() =>
                    onFilterChange(
                      { checked: !filters.patterns.includes(pattern.key) },
                      "patterns",
                      pattern
                    )
                  }
                >
                  {pattern.name}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-2.5 font-medium">Màu sắc</p>
            <div className="flex flex-wrap gap-2">
              {filters.colors.length > 0 &&
                colors
                  .filter((color) => filters.colors.includes(color.key))
                  .map((color) => (
                    <div
                      key={color.key}
                      className="px-3 py-1.5 rounded-full border text-xs cursor-pointer bg-blue-50 border-blue-400 text-blue-600 shadow-sm flex items-center group"
                      onClick={() => toggleColorFilter(color.key)}
                    >
                      <span
                        className="w-3 h-3 rounded-full mr-1.5"
                        style={{ backgroundColor: color.hex }}
                      ></span>
                      {color.name}
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        size="xs"
                      />
                    </div>
                  ))}
              <Button
                className="p-button-outlined p-button-sm rounded-full text-xs py-1.5 px-3 border-gray-300 text-gray-700 flex items-center gap-1"
                onClick={(e) => colorPanelRef.current.toggle(e)}
                label={filters.colors.length === 0 ? "Chọn màu" : "Thêm màu"}
                icon={
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    size="xs"
                    className="mr-1"
                  />
                }
              />
            </div>
          </div>
        </div>

        {/* Color Overlay Panel */}
        <OverlayPanel ref={colorPanelRef} className="w-96">
          <div className="p-2">
            <h5 className="text-sm font-medium text-gray-700 mb-3">
              Chọn màu sắc
            </h5>
            <div className="grid grid-cols-5 gap-3">
              {colors.map((color) => (
                <div
                  key={color.key}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                  onClick={() => toggleColorFilter(color.key)}
                >
                  <div
                    className={`w-8 h-8 rounded-full border ${
                      filters.colors.includes(color.key)
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-gray-300"
                    } hover:shadow-md transition-shadow duration-200`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {filters.colors.includes(color.key) && (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-xs text-white drop-shadow-md">
                          ✓
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        </OverlayPanel>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center flex-wrap gap-4">
            <div className="flex items-center">
              <Checkbox
                id="nowShipping"
                className="border border-gray-300 rounded mr-2 "
                checked={checkboxFilters.fastDelivery}
                onChange={(e) => handleCheckboxChange(e, "fastDelivery")}
              />
              <label
                htmlFor="nowShipping"
                className="text-xs flex items-center"
              >
                <img
                  src="https://salt.tikicdn.com/ts/tka/a8/31/b6/802e2c99dcce64c67aa2648edb15dd25.png"
                  alt="Giao siêu tốc 2H"
                  className=" h-[25px]"
                />
                <span className="text-red-500 font-bold mx-1 cursor-pointer ">
                  Giao siêu tốc 2H
                </span>
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="topDeal"
                className="border border-gray-300 rounded mr-2 "
                checked={checkboxFilters.topDeal}
                onChange={(e) => handleCheckboxChange(e, "topDeal")}
              />
              <label htmlFor="topDeal" className="text-xs flex items-center">
                <img
                  src="https://salt.tikicdn.com/ts/upload/b5/aa/48/2305c5e08e536cfb840043df12818146.png"
                  alt="Giao siêu tốc 2H"
                  className=" h-[25px]"
                />
                <span className="text-red-500 font-bold mx-1 cursor-pointer ">
                  Siêu rẻ
                </span>
              </label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="freeShip"
                className="border border-gray-300 rounded mr-2"
                checked={checkboxFilters.freeShip}
                onChange={(e) => handleCheckboxChange(e, "freeShip")}
              />
              <label htmlFor="freeShip" className="text-xs text-gray-700">
                <img
                  src="https://salt.tikicdn.com/ts/upload/2f/20/77/0f96cfafdf7855d5e7fe076dd4f34ce0.png"
                  alt=""
                  className=" h-[25px]"
                />
              </label>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="fourStar"
                className="border border-gray-300 rounded mr-2"
                checked={checkboxFilters.fourPlusStar}
                onChange={(e) => handleCheckboxChange(e, "fourPlusStar")}
              />
              <label
                htmlFor="fourStar"
                className="text-xs text-gray-700 flex items-center"
              >
                <Rating
                  value={4}
                  readOnly
                  disabled
                  stars={5}
                  className="mr-1"
                  cancel={false}
                  pt={{
                    onIcon: { className: "text-yellow-400 text-xs" },
                    offIcon: { className: "text-gray-300 text-xs" },
                  }}
                />
                từ 4 sao
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <span className="text-xs text-gray-500">Sắp xếp theo:</span>
            <Dropdown
              value={sortKey}
              options={sortOptions}
              onChange={(e) => setSortKey(e.value)}
              placeholder={sortOptions[1].label}
              className="w-40 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Products Results Summary */}
      <div className="text-sm text-gray-600 mb-3">
        Hiển thị {pagination.totalItems} sản phẩm{" "}
        {filtersApplied > 0 ? "(đã lọc)" : ""}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id}>{itemTemplate(product)}</div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center my-8">
            <img
              src="https://i.imgur.com/ULuKTQP.png"
              alt="No results"
              className="w-32 h-32 mx-auto mb-4 opacity-60"
            />
            <p className="text-lg text-gray-500 mb-2">
              Không tìm thấy sản phẩm phù hợp
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Vui lòng thử lại với bộ lọc khác
            </p>
            <Button
              label="Xóa tất cả bộ lọc"
              icon="pi pi-filter-slash"
              className="p-button-outlined"
              onClick={resetFilters}
            />
          </div>
        )}
      </div>

      {/* Updated Pagination */}
      {products.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-1">
            <button
              className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center bg-white hover:border-blue-500 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              &lt;
            </button>

            {[...Array(pagination.totalPages)].map((_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === pagination.totalPages ||
                (page >= pagination.currentPage - 1 &&
                  page <= pagination.currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    className={`w-10 h-10 rounded border flex items-center justify-center transition-colors ${
                      page === pagination.currentPage
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300 bg-white hover:border-blue-500 hover:text-blue-500"
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              }
              return null;
            })}

            <button
              className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center bg-white hover:border-blue-500 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowingProduct;
