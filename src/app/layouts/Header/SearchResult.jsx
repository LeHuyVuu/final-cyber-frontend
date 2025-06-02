import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Rating } from "primereact/rating";
import { Badge } from "primereact/badge";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faStar,
  faChevronDown,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { OverlayPanel } from "primereact/overlaypanel";
import { Dialog } from "primereact/dialog";
import InfiniteScroll from "react-infinite-scroll-component";
import FormattedSold from "../../pages/Home/FormattedSold";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("top_seller");
  const [hoverProduct, setHoverProduct] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const colorPanelRef = useRef(null);
  const [showAllFiltersDialog, setShowAllFiltersDialog] = useState(false);
  const [visibleFilters, setVisibleFilters] = useState([]);
  const [expandedFilters, setExpandedFilters] = useState({
    service: true,
    price: true,
  });

  // Pagination related states
  const PAGES_PER_GROUP = 5;
  const [loadedPageGroups, setLoadedPageGroups] = useState(0);
  const [totalPageGroups, setTotalPageGroups] = useState(0);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);

  const query = searchParams.get("q");
  console.log("location", location);

  // Move formatCurrency function up here, before it's used
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // FilterOptions state for dynamic filters from API
  const [filterOptions, setFilterOptions] = useState({
    materials: [],
    patterns: [],
    colors: [],
    sizes: [],
    priceRanges: [],
    ratings: [],
    brands: [],
    dynamicFilters: {},
    serviceFilters: {},
  });

  // Filter states
  const [filters, setFilters] = useState({
    materials: [],
    patterns: [],
    colors: [],
    price: null,
    brands: [],
    rating: null,
  });

  const [checkboxFilters, setCheckboxFilters] = useState({
    fastDelivery: false,
    freeShip: false,
    fourPlusStar: false,
    topDeal: false,
  });

  const [dynamicFilters, setDynamicFilters] = useState({});

  // Temporary filters for filter dialog
  const [tempFilters, setTempFilters] = useState({
    materials: [],
    patterns: [],
    colors: [],
    price: null,
    brands: [],
    rating: null,
  });
  const [tempDynamicFilters, setTempDynamicFilters] = useState({});
  const [tempCheckboxFilters, setTempCheckboxFilters] = useState({
    fastDelivery: false,
    freeShip: false,
    fourPlusStar: false,
    topDeal: false,
  });

  const sortOptions = [
    { label: "Phổ biến", value: "top_seller" },
    { label: "Bán chạy", value: "newest" },
    { label: "Giá thấp đến cao", value: "price,asc" },
    { label: "Giá cao đến thấp", value: "price,desc" },
  ];

  // Màu sắc mặc định cho các màu từ API
  const colorMap = {
    Đen: "#000000",
    Trắng: "#ffffff",
    Đỏ: "#ef4444",
    "Xanh dương": "#3b82f6",
    "Xanh lá": "#22c55e",
    Vàng: "#facc15",
    Hồng: "#ec4899",
    Tím: "#a855f7",
    Xám: "#6b7280",
    Nâu: "#92400e",
    Kem: "#fef9c3",
    Cam: "#fb923c",
    Bạc: "#cbd5e1",
  };

  // Process search data and extract filters
  useEffect(() => {
    // Initial fetch of search results from location state
    if (location.state?.dataSearch) {
      // Handle product data
      if (location.state.dataSearch.data) {
        setProducts(location.state.dataSearch.data);
      } else {
        setProducts(location.state.dataSearch);
      }

      console.log("Full data from API:", location.state.dataSearch);

      // Process filter data
      const filtersArray =
        location.state.dataSearch.filters ||
        location.state.filters?.attributes ||
        [];

      console.log("Available filters:", filtersArray);

      // Process sort options if available
      const sortOptionsArray = location.state.dataSearch.sort_options || [];
      if (sortOptionsArray.length > 0) {
        const newSortOptions = sortOptionsArray.map((option) => ({
          label: option.display_value || "",
          value: option.query_value || "top_seller",
        }));
        if (newSortOptions.length > 0 && newSortOptions[0].value) {
          setSortOption(newSortOptions[0].value);
        }
      }

      // Process filters
      if (filtersArray && Array.isArray(filtersArray)) {
        const newFilterOptions = {
          materials: [],
          patterns: [],
          colors: [],
          sizes: [],
          priceRanges: [],
          ratings: [],
          brands: [],
          categories: [],
          dynamicFilters: {},
          serviceFilters: {},
        };

        // Track available filters for prioritization
        const availableFilters = [];

        // Process each filter category from the API
        filtersArray.forEach((filter) => {
          const filterCode = filter.code || filter.query_name;
          const queryName = filter.query_name || filterCode;
          const filterType = filter.type;

          console.log(`Processing filter: ${filterCode}, query_name: ${queryName}`);

          // Skip if it doesn't have values
          if (!filter.values || !Array.isArray(filter.values)) return;

          // Add to available filters for visibility selection
          availableFilters.push(filterCode);

          // Handle special service filters (like fast delivery, freeship)
          if (filterType === "service") {
            newFilterOptions.serviceFilters[filterCode] = {
              code: filterCode,
              query_name: queryName,
              display_name: filter.display_name,
              icon: filter.icon,
              type: filterType,
              service_name: filter.service_name,
              values: filter.values.map((item) => ({
                name: item.display_value || "",
                key: item.query_value?.toString() || "",
                count: item.count || 0,
              })),
            };
            return; // Skip further processing for service filters
          }

          // Process standard filters based on code/query_name
          switch (filterCode) {
            case "category":
              newFilterOptions.categories = filter.values.map((item) => ({
                name: item.display_value || "",
                key: item.query_value?.toString() || "",
                count: item.count || 0,
                url_key: item.url_key || "",
                query_name: queryName,
              }));
              break;

            case "rating":
              newFilterOptions.ratings = filter.values.map((item) => ({
                name: item.display_value || "",
                key: item.query_value?.toString() || "",
                count: item.count || 0,
                query_name: queryName,
              }));
              break;

            case "price":
              if (filter.values && filter.values.length > 0) {
                newFilterOptions.priceRanges = filter.values.map((item) => ({
                  name: item.display_value || "",
                  key: item.query_value || "",
                  count: item.count || 0,
                  query_name: queryName,
                }));
              } else if (
                filter.min !== undefined &&
                filter.max !== undefined
              ) {
                // Create price ranges if not provided by API
                const min = filter.min;
                const max = filter.max;
                const step = Math.floor((max - min) / 4); // Create 4 price ranges

                newFilterOptions.priceRanges = [
                  {
                    name: `Dưới ${formatCurrency(step)}`,
                    key: `${min},${step}`,
                    count: 0,
                    query_name: queryName,
                  },
                  {
                    name: `${formatCurrency(step)} - ${formatCurrency(
                      step * 2
                    )}`,
                    key: `${step},${step * 2}`,
                    count: 0,
                    query_name: queryName,
                  },
                  {
                    name: `${formatCurrency(step * 2)} - ${formatCurrency(
                      step * 3
                    )}`,
                    key: `${step * 2},${step * 3}`,
                    count: 0,
                    query_name: queryName,
                  },
                  {
                    name: `Trên ${formatCurrency(step * 3)}`,
                    key: `${step * 3},${max}`,
                    count: 0,
                    query_name: queryName,
                  },
                ];
              }
              break;

            case "brand":
              newFilterOptions.brands = filter.values.map((item) => ({
                name: item.display_value || "",
                key: item.query_value?.toString() || "",
                count: item.count || 0,
                url_key: item.url_key || "",
                query_name: queryName,
              }));
              break;

            case "option_color":
            case "cloth_material":
            case "fashion_pattern":
            case "option_size_clothes":
            case "age_group":
            case "book_cover":
            case "publisher_vn":
            case "author":
            case "seller":
            case "is_cross_border":
              // These are all specific filter types we need to handle directly
              newFilterOptions.dynamicFilters[filterCode] = {
                code: filterCode,
                query_name: queryName,
                display_name: filter.display_name || filterCode,
                multi_select: filter.multi_select !== false,
                values: filter.values.map((item) => ({
                  name: item.display_value || "",
                  key: item.query_value?.toString() || "",
                  count: item.count || 0,
                  url_key: item.url_key || "",
                })),
              };

              // Populate specialized collections for common filters
              if (filterCode === "option_color") {
                newFilterOptions.colors = filter.values.map((item) => ({
                  name: item.display_value || "",
                  key: item.query_value?.toString() || "",
                  count: item.count || 0,
                  hex: colorMap[item.display_value] || "#cccccc",
                  query_name: queryName,
                }));
              } else if (filterCode === "cloth_material") {
                newFilterOptions.materials = filter.values.map((item) => ({
                  name: item.display_value || "",
                  key: item.query_value?.toString() || "",
                  count: item.count || 0,
                  query_name: queryName,
                }));
              } else if (filterCode === "fashion_pattern") {
                newFilterOptions.patterns = filter.values.map((item) => ({
                  name: item.display_value || "",
                  key: item.query_value?.toString() || "",
                  count: item.count || 0,
                  query_name: queryName,
                }));
              } else if (filterCode === "option_size_clothes") {
                newFilterOptions.sizes = filter.values.map((item) => ({
                  name: item.display_value || "",
                  key: item.query_value?.toString() || "",
                  count: item.count || 0,
                  query_name: queryName,
                }));
              }
              break;

            // Handle all other filters dynamically
            default:
              newFilterOptions.dynamicFilters[filterCode] = {
                code: filterCode,
                query_name: queryName,
                display_name: filter.display_name || filterCode,
                multi_select: filter.multi_select !== false,
                values: filter.values.map((item) => ({
                  name: item.display_value || "",
                  key: item.query_value?.toString() || "",
                  count: item.count || 0,
                  url_key: item.url_key || "",
                })),
              };
              break;
          }
        });

        // Select which filters to show
        const priorityFilters = [
          "price",
          "category",
          "rating",
          "seller",
          "brand",
        ];
        const selectedFilters = [];

        // First add priority filters that exist
        priorityFilters.forEach((filter) => {
          if (
            availableFilters.includes(filter) &&
            selectedFilters.length < 5
          ) {
            selectedFilters.push(filter);
          }
        });

        // Then add service filters
        Object.keys(newFilterOptions.serviceFilters).forEach((filter) => {
          if (
            !selectedFilters.includes(filter) &&
            selectedFilters.length < 8
          ) {
            selectedFilters.push(filter);
          }
        });

        // Then add other filters until we have enough
        availableFilters.forEach((filter) => {
          if (
            !priorityFilters.includes(filter) &&
            !selectedFilters.includes(filter) &&
            !filter.startsWith("support_") &&
            selectedFilters.length < 8
          ) {
            selectedFilters.push(filter);
          }
        });

        console.log("Selected visible filters:", selectedFilters);
        setVisibleFilters(selectedFilters);
        setFilterOptions(newFilterOptions);
      }

      setLoading(false);
    } else {
      setLoading(false);
      // If no data in location state, fetch data directly
      fetchSearchResults();
    }
  }, [location.state, query]);
  useEffect(() => {
    // Add custom scrollbar styles to document head
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #a1a1a1;
      }
    `;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Fetch search results with filters
  const fetchSearchResults = useCallback(async () => {
    if (!query) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Build API parameters based on selected filters
      const params = new URLSearchParams();

      // Basic parameters
      params.append("limit", "40");
      params.append("include", "advertisement");
      params.append("aggregations", "2");
      params.append("trackity_id", "182be9b9-76ed-6222-e51b-b73a2c7de71f");
      params.append("q", query);

      // Page parameter
      params.append("page", currentPage.toString());

      // Sort option
      if (sortOption) {
        if (sortOption === "top_seller") {
          params.append("sort", "default");
        } else if (sortOption === "newest") {
          params.append("sort", "newest");
        } else if (sortOption.includes(",")) {
          const [sortField, sortDirection] = sortOption.split(",");
          params.append("sort", sortField);
          if (sortDirection) {
            params.append("sort_direction", sortDirection);
          }
        } else {
          params.append("sort", sortOption);
        }
      }

      // Handle price filter - Use the correct format: price=min,max
      if (filters.price) {
        params.append("price", filters.price);
        console.log("Applied price filter:", filters.price);
      }

      // Handle rating filter
      if (filters.rating) {
        params.append("rating", filters.rating);
      } else if (checkboxFilters.fourPlusStar) {
        params.append("rating", "4");
      }

      // Handle service filters
      if (checkboxFilters.fastDelivery) {
        params.append("support_p2h_delivery", "1");
      }

      if (checkboxFilters.topDeal) {
        params.append("tiki_hero", "1");
      }

      if (checkboxFilters.freeShip) {
        params.append("freeship_campaign", "freeship_xtra");
      }

      // Find the correct query_name for each filter from filterOptions
      // For colors
      if (
        filters.colors &&
        filters.colors.length > 0 &&
        filterOptions.colors.length > 0
      ) {
        const queryName = filterOptions.colors[0].query_name || "option_color";
        params.append(queryName, filters.colors.join(","));
      }

      // For materials
      if (
        filters.materials &&
        filters.materials.length > 0 &&
        filterOptions.materials.length > 0
      ) {
        const queryName =
          filterOptions.materials[0].query_name || "cloth_material";
        params.append(queryName, filters.materials.join(","));
      }

      // For patterns
      if (
        filters.patterns &&
        filters.patterns.length > 0 &&
        filterOptions.patterns.length > 0
      ) {
        const queryName =
          filterOptions.patterns[0].query_name || "fashion_pattern";
        params.append(queryName, filters.patterns.join(","));
      }

      // For brands
      if (
        filters.brands &&
        filters.brands.length > 0 &&
        filterOptions.brands.length > 0
      ) {
        const queryName = filterOptions.brands[0].query_name || "brand";
        params.append(queryName, filters.brands.join(","));
      }

      // Handle dynamic filters
      Object.entries(dynamicFilters).forEach(([filterCode, values]) => {
        if (values && values.length > 0) {
          // Find the correct query_name from filterOptions
          const filterOption = filterOptions.dynamicFilters[filterCode];
          const queryName = filterOption?.query_name || filterCode;
          params.append(queryName, values.join(","));
        }
      });

      console.log("API Filter Params:", params.toString());

      // Call API directly using fetch
      const response = await fetch(
        `https://tiki.vn/api/v2/products?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API response:", result);

      if (result?.data) {
        // Process unique products
        const newProducts = result.data;

        // For infinite scroll, append to existing products instead of replacing them
        // But if we're on page 1, replace the products instead
        if (currentPage === 1) {
          setProducts(newProducts);
        } else {
          setProducts((prevProducts) => {
            // Combine previous and new products, ensuring no duplicates
            const allProducts = [...prevProducts, ...newProducts];
            return Array.from(
              new Map(allProducts.map((item) => [item.id, item])).values()
            );
          });
        }

        // Process the new filter options from the response
        if (currentPage === 1) {
          processFiltersFromResponse(result);
        }

        if (result?.paging) {
          setTotalProducts(result.paging.total || 0);
          // Check if we've reached the last page
          const totalPages = Math.ceil((result.paging.total || 0) / 40);
          setHasMore(currentPage < totalPages);

          // Calculate total page groups
          const totalGroups = Math.ceil(totalPages / PAGES_PER_GROUP);
          setTotalPageGroups(totalGroups);

          // Update showLoadMoreButton based on page groups
          if (
            currentPage % PAGES_PER_GROUP === 0 &&
            currentPage < totalPages
          ) {
            setShowLoadMoreButton(true);
            setLoadedPageGroups(Math.floor(currentPage / PAGES_PER_GROUP));
            setHasMore(false); // Pause infinite scroll until user clicks "Load More"
          } else {
            setShowLoadMoreButton(false);
          }
        } else {
          setHasMore(false);
          setShowLoadMoreButton(false);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải kết quả tìm kiếm:", error);
      setError("Không thể tải kết quả tìm kiếm");
    } finally {
      setLoading(false);
    }
  }, [
    query,
    currentPage,
    sortOption,
    filters,
    checkboxFilters,
    dynamicFilters,
    filterOptions,
  ]);

  // Function to process filters from API response
  const processFiltersFromResponse = useCallback(
    (response) => {
      if (!response?.aggregations || !Array.isArray(response.aggregations)) {
        return;
      }

      console.log("Processing filters from response:", response.aggregations);

      const filtersArray = response.aggregations;

      // Track available filters for prioritization
      const availableFilters = [];

      // Process each filter category from the API
      const newFilterOptions = {
        materials: [],
        patterns: [],
        colors: [],
        sizes: [],
        priceRanges: [],
        ratings: [],
        brands: [],
        categories: [],
        dynamicFilters: {},
        serviceFilters: {},
      };

      filtersArray.forEach((filter) => {
        const filterCode = filter.code || filter.query_name;
        const queryName = filter.query_name || filterCode;
        const filterType = filter.type;

        console.log(`Processing filter: ${filterCode}, query_name: ${queryName}`);

        // Skip if it doesn't have values
        if (!filter.values || !Array.isArray(filter.values)) return;

        // Add to available filters for visibility selection
        availableFilters.push(filterCode);

        // Handle special service filters (like fast delivery, freeship)
        if (filterType === "service") {
          newFilterOptions.serviceFilters[filterCode] = {
            code: filterCode,
            query_name: queryName,
            display_name: filter.display_name,
            icon: filter.icon,
            type: filterType,
            service_name: filter.service_name,
            values: filter.values.map((item) => ({
              name: item.display_value || "",
              key: item.query_value?.toString() || "",
              count: item.count || 0,
            })),
          };
          return; // Skip further processing for service filters
        }

        // Process standard filters based on code/query_name
        switch (filterCode) {
          case "category":
            newFilterOptions.categories = filter.values.map((item) => ({
              name: item.display_value || "",
              key: item.query_value?.toString() || "",
              count: item.count || 0,
              url_key: item.url_key || "",
              query_name: queryName,
            }));
            break;

          case "rating":
            newFilterOptions.ratings = filter.values.map((item) => ({
              name: item.display_value || "",
              key: item.query_value?.toString() || "",
              count: item.count || 0,
              query_name: queryName,
            }));
            break;

          case "price":
            if (filter.values && filter.values.length > 0) {
              newFilterOptions.priceRanges = filter.values.map((item) => ({
                name: item.display_value || "",
                key: item.query_value || "",
                count: item.count || 0,
                query_name: queryName,
              }));
            } else if (
              filter.min !== undefined &&
              filter.max !== undefined
            ) {
              // Create price ranges if not provided by API
              const min = filter.min;
              const max = filter.max;
              const step = Math.floor((max - min) / 4); // Create 4 price ranges

              newFilterOptions.priceRanges = [
                {
                  name: `Dưới ${formatCurrency(step)}`,
                  key: `${min},${step}`,
                  count: 0,
                },
                {
                  name: `${formatCurrency(step)} - ${formatCurrency(
                    step * 2
                  )}`,
                  key: `${step},${step * 2}`,
                  count: 0,
                },
                {
                  name: `${formatCurrency(step * 2)} - ${formatCurrency(
                    step * 3
                  )}`,
                  key: `${step * 2},${step * 3}`,
                  count: 0,
                },
                {
                  name: `Trên ${formatCurrency(step * 3)}`,
                  key: `${step * 3},${max}`,
                  count: 0,
                },
              ];
            }
            break;

          case "brand":
            newFilterOptions.brands = filter.values.map((item) => ({
              name: item.display_value || "",
              key: item.query_value?.toString() || "",
              count: item.count || 0,
              url_key: item.url_key || "",
              query_name: queryName,
            }));
            break;

          case "option_color":
          case "cloth_material":
          case "fashion_pattern":
          case "option_size_clothes":
          case "age_group":
          case "book_cover":
          case "publisher_vn":
          case "author":
          case "seller":
          case "is_cross_border":
            // These are all specific filter types we need to handle directly
            newFilterOptions.dynamicFilters[filterCode] = {
              code: filterCode,
              query_name: queryName,
              display_name: filter.display_name || filterCode,
              multi_select: filter.multi_select !== false,
              values: filter.values.map((item) => ({
                name: item.display_value || "",
                key: item.query_value?.toString() || "",
                count: item.count || 0,
                url_key: item.url_key || "",
              })),
            };

            // Populate specialized collections for common filters
            if (filterCode === "option_color") {
              newFilterOptions.colors = filter.values.map((item) => ({
                name: item.display_value || "",
                key: item.query_value?.toString() || "",
                count: item.count || 0,
                hex: colorMap[item.display_value] || "#cccccc",
                query_name: queryName,
              }));
            } else if (filterCode === "cloth_material") {
              newFilterOptions.materials = filter.values.map((item) => ({
                name: item.display_value || "",
                key: item.query_value?.toString() || "",
                count: item.count || 0,
                query_name: queryName,
              }));
            } else if (filterCode === "fashion_pattern") {
              newFilterOptions.patterns = filter.values.map((item) => ({
                name: item.display_value || "",
                key: item.query_value?.toString() || "",
                count: item.count || 0,
                query_name: queryName,
              }));
            } else if (filterCode === "option_size_clothes") {
              newFilterOptions.sizes = filter.values.map((item) => ({
                name: item.display_value || "",
                key: item.query_value?.toString() || "",
                count: item.count || 0,
                query_name: queryName,
              }));
            }
            break;

          // Handle all other filters dynamically
          default:
            newFilterOptions.dynamicFilters[filterCode] = {
              code: filterCode,
              query_name: queryName,
              display_name: filter.display_name || filterCode,
              multi_select: filter.multi_select !== false,
              values: filter.values.map((item) => ({
                name: item.display_value || "",
                key: item.query_value?.toString() || "",
                count: item.count || 0,
                url_key: item.url_key || "",
              })),
            };
            break;
        }
      });

      // Select which filters to show
      const priorityFilters = [
        "price",
        "category",
        "rating",
        "seller",
        "brand",
      ];
      const selectedFilters = [];

      // First add priority filters that exist
      priorityFilters.forEach((filter) => {
        if (
          availableFilters.includes(filter) &&
          selectedFilters.length < 5
        ) {
          selectedFilters.push(filter);
        }
      });

      // Then add service filters
      Object.keys(newFilterOptions.serviceFilters).forEach((filter) => {
        if (
          !selectedFilters.includes(filter) &&
          selectedFilters.length < 8
        ) {
          selectedFilters.push(filter);
        }
      });

      // Then add other filters until we have enough
      availableFilters.forEach((filter) => {
        if (
          !priorityFilters.includes(filter) &&
          !selectedFilters.includes(filter) &&
          !filter.startsWith("support_") &&
          selectedFilters.length < 8
        ) {
          selectedFilters.push(filter);
        }
      });

      console.log("Selected visible filters:", selectedFilters);
      setVisibleFilters(selectedFilters);
      setFilterOptions(newFilterOptions);
    },
    [colorMap, formatCurrency]
  );

  // Call fetchSearchResults when filters or dependencies change
  useEffect(() => {
    if (
      products.length === 0 ||
      currentPage > 1 ||
      filtersApplied > 0 ||
      sortOption !== "top_seller"
    ) {
      fetchSearchResults();
    }
  }, [fetchSearchResults]);

  // Reset page and hasMore when filter changes
  useEffect(() => {
    // Reset page to 1 and products array when filters change
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setShowLoadMoreButton(false);
    setLoadedPageGroups(0);
    setTotalPageGroups(0);
  }, [filters, checkboxFilters, dynamicFilters, sortOption]);

  // Handle price change
  const handlePriceChange = (priceKey) => {
    // Nếu click vào giá đã chọn, bỏ chọn
    if (filters.price === priceKey) {
      setFilters({
        ...filters,
        price: null,
      });
      console.log("Removed price filter");
    } else {
      // Nếu chọn giá mới
      setFilters({
        ...filters,
        price: priceKey,
      });
      console.log("Applied price filter:", priceKey);
    }
    setCurrentPage(1);
    setFiltersApplied((prevCount) =>
      filters.price === priceKey ? prevCount - 1 : prevCount + 1
    );
  };

  // Fix for handlePageChange linter warning - keep function but mark it as used
  // eslint-disable-next-line no-unused-vars
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.value);
    setCurrentPage(1);
  };

  // Handle filter change
  const onFilterChange = (e, category, item) => {
    const checked = e.checked;
    let newFilters = { ...filters };

    // Đảm bảo mảng tồn tại
    if (!newFilters[category]) {
      newFilters[category] = [];
    }

    if (checked) {
      newFilters[category] = [...newFilters[category], item.key];
    } else {
      newFilters[category] = newFilters[category].filter(
        (key) => key !== item.key
      );
    }

    console.log(
      `Filter changed - Category: ${category}, Values:`,
      newFilters[category]
    );
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle checkbox filter change
  const handleCheckboxChange = (e, key) => {
    setCheckboxFilters({
      ...checkboxFilters,
      [key]: e.checked,
    });
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Toggle color filter
  const toggleColorFilter = (color) => {
    // Đảm bảo mảng tồn tại
    let newColors = filters.colors ? [...filters.colors] : [];

    if (newColors.includes(color)) {
      newColors = newColors.filter((c) => c !== color);
    } else {
      newColors.push(color);
    }

    setFilters({
      ...filters,
      colors: newColors,
    });
    setCurrentPage(1);
  };

  // Handle dynamic filter change
  const handleDynamicFilterChange = (filterCode, checked, value) => {
    setDynamicFilters((prev) => {
      const newFilters = { ...prev };

      // Initialize array if doesn't exist
      if (!newFilters[filterCode]) {
        newFilters[filterCode] = [];
      }

      if (checked) {
        // Add the value if not already included
        if (!newFilters[filterCode].includes(value)) {
          newFilters[filterCode] = [...newFilters[filterCode], value];
        }
      } else {
        // Remove the value
        newFilters[filterCode] = newFilters[filterCode].filter(
          (v) => v !== value
        );

        // Clean up empty arrays
        if (newFilters[filterCode].length === 0) {
          delete newFilters[filterCode];
        }
      }

      return newFilters;
    });

    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      materials: [],
      patterns: [],
      colors: [],
      price: null,
      brands: [],
      rating: null,
    });
    setDynamicFilters({});
    setCheckboxFilters({
      fastDelivery: false,
      freeShip: false,
      fourPlusStar: false,
      topDeal: false,
    });
    setSortOption("top_seller");
    setCurrentPage(1);
  };

  // Add a function to load more products when the user clicks the "Load More" button
  const loadMoreProducts = () => {
    setShowLoadMoreButton(false);
    setHasMore(true);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Dialog filter functions
  const openFilterDialog = () => {
    setTempFilters({ ...filters });
    setTempDynamicFilters({ ...dynamicFilters });
    setTempCheckboxFilters({ ...checkboxFilters });
    setShowAllFiltersDialog(true);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setDynamicFilters(tempDynamicFilters);
    setCheckboxFilters(tempCheckboxFilters);
    setShowAllFiltersDialog(false);
  };

  const resetTempFilters = () => {
    setTempFilters({
      materials: [],
      patterns: [],
      colors: [],
      price: null,
      brands: [],
      rating: null,
    });
    setTempDynamicFilters({});
    setTempCheckboxFilters({
      fastDelivery: false,
      freeShip: false,
      fourPlusStar: false,
      topDeal: false,
    });
  };

  // Temp filter functions for dialog
  const onTempFilterChange = (e, category, item) => {
    const checked = e.checked;
    let newFilters = { ...tempFilters };

    // Đảm bảo mảng tồn tại
    if (!newFilters[category]) {
      newFilters[category] = [];
    }

    if (checked) {
      newFilters[category] = [...newFilters[category], item.key];
    } else {
      newFilters[category] = newFilters[category].filter(
        (key) => key !== item.key
      );
    }

    setTempFilters(newFilters);
  };

  const toggleTempColorFilter = (color) => {
    // Đảm bảo mảng tồn tại
    let newColors = tempFilters.colors ? [...tempFilters.colors] : [];

    if (newColors.includes(color)) {
      newColors = newColors.filter((c) => c !== color);
    } else {
      newColors.push(color);
    }

    setTempFilters({
      ...tempFilters,
      colors: newColors,
    });
  };

  const handleTempPriceChange = (priceKey) => {
    // Nếu click vào giá đã chọn, bỏ chọn
    if (tempFilters.price === priceKey) {
      setTempFilters({
        ...tempFilters,
        price: null,
      });
    } else {
      // Nếu chọn giá mới
      setTempFilters({
        ...tempFilters,
        price: priceKey,
      });
    }
  };

  const handleTempDynamicFilterChange = (filterCode, checked, value) => {
    let newDynamicFilters = { ...tempDynamicFilters };

    // Đảm bảo mảng tồn tại
    if (!newDynamicFilters[filterCode]) {
      newDynamicFilters[filterCode] = [];
    }

    if (checked) {
      newDynamicFilters[filterCode] = [...newDynamicFilters[filterCode], value];
    } else {
      newDynamicFilters[filterCode] = newDynamicFilters[filterCode].filter(
        (val) => val !== value
      );
    }

    setTempDynamicFilters(newDynamicFilters);
  };

  const handleTempCheckboxChange = (e, key) => {
    setTempCheckboxFilters({
      ...tempCheckboxFilters,
      [key]: e.checked,
    });
  };

  // Count active filters
  useEffect(() => {
    let count = 0;
    count += filters.materials?.length || 0;
    count += filters.patterns?.length || 0;
    count += filters.colors?.length || 0;
    count += filters.brands?.length || 0;
    if (filters.price) count++;
    if (filters.rating) count++;

    Object.values(dynamicFilters).forEach((filterValues) => {
      if (Array.isArray(filterValues)) {
        count += filterValues.length;
      }
    });

    if (checkboxFilters.fastDelivery) count++;
    if (checkboxFilters.freeShip) count++;
    if (checkboxFilters.topDeal) count++;
    if (checkboxFilters.fourPlusStar) count++;

    setFiltersApplied(count);
  }, [filters, checkboxFilters, dynamicFilters]);

  const getSortTitle = () => {
    const sortMap = {
      top_seller: "phổ biến",
      newest: "mới nhất",
      "price,asc": "giá thấp đến cao",
      "price,desc": "giá cao đến thấp",
    };
    return sortMap[sortOption] || "phổ biến";
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb skeleton */}
        <div className="h-8 bg-gray-200 w-1/2 rounded animate-pulse mb-6"></div>

        {/* Products skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array(12)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse"
              >
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // Item template for the products (similar to ProductListing)
  const itemTemplate = (product) => {
    const isHovered = hoverProduct === product.id;

    return (
      <div
        className="col-span-1 group relative"
        onMouseEnter={() => setHoverProduct(product.id)}
        onMouseLeave={() => setHoverProduct(null)}
      >
        <Link to={`/detail/${product.id}`}>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <div className="relative overflow-hidden">
              <img
                src={product.thumbnail_url}
                alt={product.name}
                className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div
                className={`absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center gap-3 transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              ></div>

              {/* Labels */}
              {/* <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.discount_rate > 0 && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded shadow-sm">
                    -{product.discount_rate}%
                  </span>
                )}
              </div> */}

              <div className="absolute bottom-0 left-0">
                {product.badges_v3 && product.badges_v3[0]?.image && (
                  <img src={product.badges_v3[0].image} alt="" />
                )}
              </div>
            </div>

            <div className="p-3 m-1 flex flex-col flex-grow">
            <h3 className="text-gray-800 text-sm font-medium mb-2 line-clamp-2 h-10 hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              <div className="mb-1">
                <div className="  min-h-[25px] items-center ">
                  {product.original_price > product.price && (
                    <span className="text-sm text-gray-500 line-through italic mb-2">
                      {formatCurrency(product.original_price)}
                    </span>
                  )}
                  {product.discount_rate > 0 && (
                    <span className={`ml-2 mb-2 rounded-sm ${product.discount_rate ? 'bg-[#ff424e] px-1 py-1 text-xs text-white' : 'bg-transparent'}`}>
                      -{product.discount_rate}%
                    </span>
                  )}
                </div>
                <span className="text-xl font-bold text-[#ff424e] my-2 mb-2">
                  {formatCurrency(product.price)}
                </span>


                {/* <div className="flex justify-between items-center"> */}
                {/* <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                    {product.brand_name}
                  </div> */}
                {/* <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">
                      <FontAwesomeIcon icon={faStar} size="xs" />
                    </span>
                    <span className="text-xs text-gray-600">
                      {product.rating_average} ({product.review_count})
                    </span>
                  </div> */}
                <div className="card flex justify-between">
                  <Rating value={product.rating_average} disabled cancel={false} />
                  <div className='text-sm text-gray-600'>Đã bán <FormattedSold sold={product.quantity_sold?.value} /></div>
                </div>
                {/* </div> */}
              </div>

              

              {/* <div className="flex flex-wrap gap-1 mb-2 min-h-[1.5rem]">
                {product.badges_new &&
                  product.badges_new
                    .find((badge) => badge.code === "variant_count")
                    ?.arr_text?.map((text, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-sm"
                      >
                        {text.value}
                      </span>
                    ))}
              </div> */}

              {/* {product.discount_rate > 0 && (
                <div className="flex items-center text-xs text-blue-600 mb-1">
                  <FontAwesomeIcon
                    icon={faTag}
                    className="mr-1.5 text-blue-600"
                    size="xs"
                  />
                  Giảm {formatCurrency(product.discount)}
                </div>
              )} */}

              {/* <div className="flex justify-between items-center mt-auto">
                <div className="text-xs text-gray-500">
                  {product.badges_new &&
                    (product.badges_new.find(
                      (badge) => badge.code === "delivery_info_badge"
                    )?.text ||
                      "Giao hàng tiêu chuẩn")}
                </div>

                {product.badges_new &&
                  product.badges_new.some(
                    (badge) => badge.code === "tikinow"
                  ) && (
                    <span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full border border-red-200">
                      2H
                    </span>
                  )}
              </div> */}
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with search title and applied filters counter */}
      <div className="flex justify-between items-center my-4">
        <h2 className="text-xl font-medium text-gray-800">
          Kết quả tìm kiếm cho &ldquo;{query}&rdquo; - Sắp xếp theo {getSortTitle()}
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

      {/* Filter Toolbar - Only visible on mobile */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4 lg:hidden">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center flex-wrap gap-4">
            {/* Map through service filters */}
            {Object.entries(filterOptions.serviceFilters || {}).map(
              ([key, filter]) => (
                <div key={key} className="flex items-center">
                  <Checkbox
                    id={key}
                    className="border border-gray-300 rounded mr-2"
                    checked={
                      key === "support_p2h_delivery"
                        ? checkboxFilters.fastDelivery
                        : key === "tiki_hero"
                        ? checkboxFilters.topDeal
                        : key === "freeship_campaign"
                        ? checkboxFilters.freeShip
                        : false
                    }
                    onChange={(e) => {
                      if (key === "support_p2h_delivery")
                        handleCheckboxChange(e, "fastDelivery");
                      else if (key === "tiki_hero")
                        handleCheckboxChange(e, "topDeal");
                      else if (key === "freeship_campaign")
                        handleCheckboxChange(e, "freeShip");
                    }}
                  />
                  <label
                    htmlFor={key}
                    className="text-xs flex items-center cursor-pointer"
                  >
                    {filter.icon && (
                      <img
                        src={filter.icon}
                        alt={filter.display_name || filter.service_name || ""}
                        className="h-[25px]"
                      />
                    )}
                    {filter.display_name && (
                      <span className="text-red-500 font-bold mx-1">
                        {filter.display_name}
                      </span>
                    )}
                  </label>
                </div>
              )
            )}

            {/* Rating filter checkbox */}
            {filterOptions.ratings && filterOptions.ratings.length > 0 && (
              <div className="flex items-center">
                <Checkbox
                  id="fourStar"
                  className="border border-gray-300 rounded mr-2"
                  checked={checkboxFilters.fourPlusStar}
                  onChange={(e) => handleCheckboxChange(e, "fourPlusStar")}
                />
                <label
                  htmlFor="fourStar"
                  className="text-xs text-gray-700 flex items-center cursor-pointer"
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
            )}

            {/* Mobile filter button */}
            <Button
              label={`Bộ lọc ${
                filtersApplied > 0 ? `(${filtersApplied})` : ""
              }`}
              className="p-button-outlined p-button-sm lg:hidden"
              onClick={openFilterDialog}
            />
          </div>

          {/* Sort options */}
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <span className="text-xs text-gray-500">Sắp xếp theo:</span>
            <Dropdown
              value={sortOption}
              options={sortOptions}
              onChange={handleSortChange}
              placeholder="Phổ biến"
              className="w-40 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Main content with filters and products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* Sidebar Filters - Only visible on desktop */}
        <div className="hidden lg:block lg:col-span-1 ">
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-40">
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800">Bộ lọc tìm kiếm</h3>
        {/* {filtersApplied > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Xóa tất cả
          </button>
        )} */}
         <div className="p-4">
                <Button
                  
                  icon={<FontAwesomeIcon icon={faFilter} className="mr-2" />}
                  className="p-button-outlined p-button-sm w-full"
                  onClick={openFilterDialog}
                />
              </div>
      </div>
      
      {filtersApplied > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          <span className="font-medium">{filtersApplied}</span> bộ lọc đã áp dụng
        </div>
      )}
    </div>
    <div className="max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar ">
            <div className="divide-y divide-gray-100">
              {/* Sort options in sidebar */}
             
              
              {/* Service filters - Collapsible */}
              {Object.keys(filterOptions.serviceFilters || {}).length > 0 && (
                <div className="border-t border-gray-100">
                  <div 
                    className="p-4 cursor-pointer" 
                    onClick={() => toggleFilterSection('service')}
                  >

                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Dịch vụ</h4>
                      <FontAwesomeIcon 
                        icon={faChevronDown} 
                        className={`text-gray-400 text-xs transition-transform duration-200 ${
                          expandedFilters.service ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                  </div>
                  
                  {expandedFilters.service && (
                    <div className="px-4 pb-4 space-y-2.5">
                      {Object.entries(filterOptions.serviceFilters || {}).map(
                        ([key, filter]) => (
                          <div key={key} className="flex items-center">
                            <Checkbox
                              id={`sidebar_${key}`}
                              className="border border-gray-300 rounded mr-2"
                              checked={
                                key === "support_p2h_delivery"
                                  ? checkboxFilters.fastDelivery
                                  : key === "tiki_hero"
                                  ? checkboxFilters.topDeal
                                  : key === "freeship_campaign"
                                  ? checkboxFilters.freeShip
                                  : false
                              }
                              onChange={(e) => {
                                if (key === "support_p2h_delivery")
                                  handleCheckboxChange(e, "fastDelivery");
                                else if (key === "tiki_hero")
                                  handleCheckboxChange(e, "topDeal");
                                else if (key === "freeship_campaign")
                                  handleCheckboxChange(e, "freeShip");
                              }}
                            />
                            <label
                              htmlFor={`sidebar_${key}`}
                              className="text-sm flex items-center cursor-pointer"
                            >
                              {filter.icon && (
                                <img
                                  src={filter.icon}
                                  alt={filter.display_name || filter.service_name || ""}
                                  className="h-5 mr-2"
                                />
                              )}
                              {filter.display_name && (
                                <span className="text-gray-700">
                                  {filter.display_name}
                                </span>
                              )}
                            </label>
                          </div>
                        )
                      )}
                      
                      {/* Rating filter checkbox */}
                      {filterOptions.ratings && filterOptions.ratings.length > 0 && (
                        <div className="flex items-center">
                          <Checkbox
                            id="sidebar_fourStar"
                            className="border border-gray-300 rounded mr-2"
                            checked={checkboxFilters.fourPlusStar}
                            onChange={(e) => handleCheckboxChange(e, "fourPlusStar")}
                          />
                          <label
                            htmlFor="sidebar_fourStar"
                            className="text-sm text-gray-700 flex items-center cursor-pointer"
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
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Price Ranges - Collapsible */}
              {filterOptions.priceRanges && filterOptions.priceRanges.length > 0 && (
                <div className="border-t border-gray-100">
                  <div 
                    className="p-4 cursor-pointer" 
                    onClick={() => toggleFilterSection('price')}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">
                        Khoảng giá
                        {filters.price && <span className="ml-2 text-xs text-blue-600">(1)</span>}
                      </h4>
                      <FontAwesomeIcon 
                        icon={faChevronDown} 
                        className={`text-gray-400 text-xs transition-transform duration-200 ${
                          expandedFilters.price ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                  
                  {expandedFilters.price && (
                    <div className="px-4 pb-4 space-y-2">
                      {filterOptions.priceRanges.map((priceRange) => (
                        <div
                          key={priceRange.key}
                          className={`flex items-center px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
                            filters.price === priceRange.key
                              ? "bg-blue-50 text-blue-600"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => handlePriceChange(priceRange.key)}
                        >
                          <div className={`w-3 h-3 rounded-full mr-2.5 ${
                            filters.price === priceRange.key
                              ? "bg-blue-600"
                              : "bg-gray-300"
                          }`}></div>
                          <span className="text-sm">
                            {priceRange.name}
                            {priceRange.count > 0 && (
                              <span className="text-gray-500 ml-1 text-xs">
                                ({priceRange.count})
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Render dynamic filters based on visible filters */}
              {visibleFilters
                .filter(
                  (code) =>
                    code !== "price" &&
                    !Object.keys(filterOptions.serviceFilters || {}).includes(code)
                )
                .map((filterCode) => {
                  // Handle categories filter
                  if (
                    filterCode === "category" &&
                    filterOptions.categories?.length > 0
                  ) {
                    const selectedCount = dynamicFilters.category?.length || 0;
                    
                    return (
                      <div key={filterCode} className="border-t border-gray-100">
                        <div 
                          className="p-4 cursor-pointer" 
                          onClick={() => toggleFilterSection('category')}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-700">
                              Danh Mục Sản Phẩm
                              {selectedCount > 0 && (
                                <span className="ml-2 text-xs text-blue-600">
                                  ({selectedCount})
                                </span>
                              )}
                            </h4>
                            <FontAwesomeIcon 
                              icon={faChevronDown} 
                              className={`text-gray-400 text-xs transition-transform duration-200 ${
                                expandedFilters.category ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </div>
                        
                        {expandedFilters.category && (
                          <div className="px-4 pb-4 space-y-2 ">
                            {filterOptions.categories.map((category) => (
                              <div
                                key={category.key}
                                className={`flex items-center px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
                                  dynamicFilters.category?.includes(category.key)
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() =>
                                  handleDynamicFilterChange(
                                    "category",
                                    !dynamicFilters.category?.includes(
                                      category.key
                                    ),
                                    category.key
                                  )
                                }
                              >
                                <div className={`w-3 h-3 rounded-full mr-2.5 ${
                                  dynamicFilters.category?.includes(category.key)
                                    ? "bg-blue-600"
                                    : "bg-gray-300"
                                }`}></div>
                                <span className="text-sm truncate">
                                  {category.name}
                                  {category.count > 0 && (
                                    <span className="text-gray-500 ml-1 text-xs">
                                      ({category.count})
                                    </span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Handle rating filter
                  if (
                    filterCode === "rating" &&
                    filterOptions.ratings?.length > 0
                  ) {
                    return (
                      <div key={filterCode} className="border-t border-gray-100">
                        <div 
                          className="p-4 cursor-pointer" 
                          onClick={() => toggleFilterSection('rating')}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-700">
                              Đánh giá
                              {filters.rating && (
                                <span className="ml-2 text-xs text-blue-600">(1)</span>
                              )}
                            </h4>
                            <FontAwesomeIcon 
                              icon={faChevronDown} 
                              className={`text-gray-400 text-xs transition-transform duration-200 ${
                                expandedFilters.rating ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </div>
                        
                        {expandedFilters.rating && (
                          <div className="px-4 pb-4 space-y-2">
                            {filterOptions.ratings.map((rating) => (
                              <div
                                key={rating.key}
                                className={`flex items-center px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
                                  filters.rating === rating.key
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() => {
                                  setFilters((prev) => ({
                                    ...prev,
                                    rating:
                                      prev.rating === rating.key
                                        ? null
                                        : rating.key,
                                  }));
                                  setCurrentPage(1);
                                }}
                              >
                                <div className={`w-3 h-3 rounded-full mr-2.5 ${
                                  filters.rating === rating.key
                                    ? "bg-blue-600"
                                    : "bg-gray-300"
                                }`}></div>
                                <span className="text-sm">{rating.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Handle brand filter correctly
                  if (
                    filterCode === "brand" &&
                    filterOptions.brands?.length > 0
                  ) {
                    const brandOptions = filterOptions.brands;
                    const showAll = brandOptions.length > 6;
                    const selectedCount = filters.brands?.length || 0;
                    
                    return (
                      <div key={filterCode} className="border-t border-gray-100">
                        <div 
                          className="p-4 cursor-pointer" 
                          onClick={() => toggleFilterSection('brand')}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-700">
                              Thương hiệu
                              {selectedCount > 0 && (
                                <span className="ml-2 text-xs text-blue-600">
                                  ({selectedCount})
                                </span>
                              )}
                            </h4>
                            <FontAwesomeIcon 
                              icon={faChevronDown} 
                              className={`text-gray-400 text-xs transition-transform duration-200 ${
                                expandedFilters.brand ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </div>
                        
                        {expandedFilters.brand && (
                          <div className="px-4 pb-4 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                            {brandOptions.slice(0, showAll ? expandedFilters.brand.length : undefined).map((item) => (
                              <div
                                key={item.key}
                                className={`flex items-center px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
                                  filters.brands?.includes(item.key)
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() =>
                                  onFilterChange(
                                    { checked: !filters.brands?.includes(item.key) },
                                    "brands",
                                    item
                                  )
                                }
                              >
                                <div className={`w-3 h-3 rounded-full mr-2.5 ${
                                  filters.brands?.includes(item.key)
                                    ? "bg-blue-600"
                                    : "bg-gray-300"
                                }`}></div>
                                <span className="text-sm truncate">
                                  {item.name}
                                  {item.count > 0 && (
                                    <span className="text-gray-500 ml-1 text-xs">
                                      ({item.count})
                                    </span>
                                  )}
                                </span>
                              </div>
                            ))}
                            
                            {showAll && (
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <button
                                  onClick={() => setShowAllFiltersDialog(true)}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Xem thêm {brandOptions.length - 6} thương hiệu
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Handle color filter specially
                  if (filterCode === "option_color" && filterOptions.colors?.length > 0) {
                    const selectedCount = filters.colors?.length || 0;
                    
                    return (
                      <div key={filterCode} className="border-t border-gray-100">
                        <div 
                          className="p-4 cursor-pointer" 
                          onClick={() => toggleFilterSection('color')}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-700">
                              Màu sắc
                              {selectedCount > 0 && (
                                <span className="ml-2 text-xs text-blue-600">
                                  ({selectedCount})
                                </span>
                              )}
                            </h4>
                            <FontAwesomeIcon 
                              icon={faChevronDown} 
                              className={`text-gray-400 text-xs transition-transform duration-200 ${
                                expandedFilters.color ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </div>
                        
                        {expandedFilters.color && (
                          <div className="px-4 pb-4 flex flex-wrap gap-2.5 max-h-60 overflow-y-auto custom-scrollbar">
                            {filterOptions.colors.slice(0, 10).map((color) => (
                              <div
                                key={color.key}
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() => toggleColorFilter(color.key)}
                              >
                                <div
                                  className={`w-7 h-7 rounded-full transition-all ${
                                    filters.colors?.includes(color.key)
                                      ? "ring-2 ring-blue-500"
                                      : "ring-1 ring-gray-300 hover:ring-gray-400"
                                  }`}
                                  style={{ backgroundColor: color.hex }}
                                  title={color.name}
                                ></div>
                                <span className="text-xs mt-1 text-gray-600">
                                  {color.name}
                                </span>
                              </div>
                            ))}
                            
                            {filterOptions.colors.length > 10 && (
                              <button 
                                className="text-blue-600 hover:underline text-xs mt-2"
                                onClick={(e) => colorPanelRef.current.toggle(e)}
                              >
                                +{filterOptions.colors.length - 10} màu
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Handle any dynamic filter from API
                  if (filterOptions.dynamicFilters?.[filterCode]) {
                    const filter = filterOptions.dynamicFilters[filterCode];
                    const showAll = filter.values.length > 6;
                    const selectedCount = dynamicFilters[filterCode]?.length || 0;
                    
                    return (
                      <div key={filterCode} className="border-t border-gray-100">
                        <div 
                          className="p-4 cursor-pointer" 
                          onClick={() => toggleFilterSection(filterCode)}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-700">
                              {filter.display_name}
                              {selectedCount > 0 && (
                                <span className="ml-2 text-xs text-blue-600">
                                  ({selectedCount})
                                </span>
                              )}
                            </h4>
                            <FontAwesomeIcon 
                              icon={faChevronDown} 
                              className={`text-gray-400 text-xs transition-transform duration-200 ${
                                expandedFilters[filterCode] ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </div>
                        
                        {expandedFilters[filterCode] && (
                          <div className="px-4 pb-4 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                            {filter.values.slice(0, showAll ? expandedFilters[filterCode].length : undefined).map((item) => (
                              <div
                                key={item.key}
                                className={`flex items-center px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
                                  dynamicFilters[filterCode]?.includes(item.key)
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() =>
                                  handleDynamicFilterChange(
                                    filterCode,
                                    !dynamicFilters[filterCode]?.includes(item.key),
                                    item.key
                                  )
                                }
                              >
                                <div className={`w-3 h-3 rounded-full mr-2.5 ${
                                  dynamicFilters[filterCode]?.includes(item.key)
                                    ? "bg-blue-600"
                                    : "bg-gray-300"
                                }`}></div>
                                <span className="text-sm truncate">
                                  {item.name}
                                  {item.count > 0 && (
                                    <span className="text-gray-500 ml-1 text-xs">
                                      ({item.count})
                                    </span>
                                  )}
                                </span>
                              </div>
                            ))}
                            
                            {/* {showAll && (
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <button
                                  onClick={() => setShowAllFiltersDialog(true)}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Xem thêm {filter.values.length - 6} lựa chọn
                                </button>
                              </div>
                            )} */}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return null;
                })}
              
             
            </div>
          </div>
          </div>
        </div>
        
        {/* Products Grid with InfiniteScroll */}
        <div className="lg:col-span-3 xl:col-span-4">
          {products.length > 0 ? (
            <InfiniteScroll
              dataLength={products.length}
              next={() => setCurrentPage(currentPage + 1)}
              hasMore={hasMore}
              loader={
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }
              className="flex-1"
            >
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product.id}>{itemTemplate(product)}</div>
                ))}
              </div>

              {showLoadMoreButton && (
                <div className="flex justify-center mt-6">
                  <Button
                    label="Xem thêm sản phẩm"
                    icon="pi pi-arrow-down"
                    className="p-button-outlined"
                    onClick={loadMoreProducts}
                  />
                </div>
              )}
            </InfiniteScroll>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl mb-4">
                Không tìm thấy sản phẩm nào cho &ldquo;{query}&rdquo;
              </p>
              <p className="text-gray-500">Hãy thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      </div>

      {/* Filter dialog for mobile */}
      <Dialog
        header="Bộ lọc"
        visible={showAllFiltersDialog}
        onHide={() => setShowAllFiltersDialog(false)}
        className="w-full max-w-md lg:hidden"
        footer={
          <div className="flex justify-between">
            <Button
              label="Đặt lại"
              icon="pi pi-refresh"
              className="p-button-outlined"
              onClick={resetTempFilters}
            />
            <Button
              label="Áp dụng"
              icon="pi pi-check"
              onClick={applyFilters}
            />
          </div>
        }
      >
        {/* ...existing code... */}
      </Dialog>

      {/* Comprehensive Filter Dialog */}
      <Dialog
        contentStyle={{ padding: "0px", overflowY: "hidden" }}
        header={
          <div className="flex justify-between items-center p-2 ">
            <h2 className="text-xl font-medium text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faFilter} className="mr-3 text-primary" />
              Tất cả bộ lọc
              {Object.values(tempFilters).flat().filter(Boolean).length +
                Object.values(tempDynamicFilters).flat().filter(Boolean)
                  .length +
                Object.values(tempCheckboxFilters).filter(Boolean).length >
                0 && (
                <Badge
                  value={
                    Object.values(tempFilters).flat().filter(Boolean).length +
                    Object.values(tempDynamicFilters).flat().filter(Boolean)
                      .length +
                    Object.values(tempCheckboxFilters).filter(Boolean).length
                  }
                  severity="info"
                  className="ml-2"
                ></Badge>
              )}
            </h2>
            {/* <Button
              // icon="pi pi-times"
              className="p-button-rounded p-button-text"
              onClick={() => setShowAllFiltersDialog(false)}
              // aria-label="Close"
            /> */}
          </div>
        }
        visible={showAllFiltersDialog}
        style={{ width: "85vw", maxWidth: "1200px" }}
        onHide={() => setShowAllFiltersDialog(false)}
        footer={
          <div className="flex justify-between border-t border-gray-200 pt-4 px-2 ">
            <Button
              label="Xóa bộ lọc"
              icon="pi pi-filter-slash"
              className="p-button-outlined p-button-danger"
              onClick={resetTempFilters}
              disabled={
                Object.values(tempFilters).flat().filter(Boolean).length +
                  Object.values(tempDynamicFilters).flat().filter(Boolean)
                    .length +
                  Object.values(tempCheckboxFilters).filter(Boolean).length ===
                0
              }
            />
            <Button
              label="Áp dụng"
              icon="pi pi-check"
              className="p-button-primary"
              onClick={applyFilters}
            />
          </div>
        }
        blockScroll
        dismissableMask
        closeOnEscape
        className="filter-dialog"
      >
        <div className="flex flex-col md:flex-row gap-6 p-4">
          {/* Sidebar với danh mục filter */}
          <div className="md:w-1/4 lg:w-1/5">
            <div className="sticky top-0 bg-white h-full shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <h3 className="text-sm font-medium p-3 border-b bg-gray-50">
                Danh mục lọc
              </h3>
              <nav className="overflow-y-auto max-h-[64vh]">
                <ul className="divide-y divide-gray-200">
                  <li>
                    <a
                      href="#price-filter"
                      className="block p-3 hover:bg-blue-50 text-sm transition-colors duration-200"
                    >
                      Khoảng giá{" "}
                      {tempFilters.price && (
                        <span className="float-right text-blue-600">●</span>
                      )}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#color-filter"
                      className="block p-3 hover:bg-blue-50 text-sm transition-colors duration-200"
                    >
                      Màu sắc{" "}
                      {tempFilters.colors?.length > 0 && (
                        <span className="float-right text-blue-600">●</span>
                      )}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#brand-filter"
                      className="block p-3 hover:bg-blue-50 text-sm transition-colors duration-200"
                    >
                      Thương hiệu{" "}
                      {tempFilters.brands?.length > 0 && (
                        <span className="float-right text-blue-600">●</span>
                      )}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pattern-filter"
                      className="block p-3 hover:bg-blue-50 text-sm transition-colors duration-200"
                    >
                      Họa tiết{" "}
                      {tempFilters.patterns?.length > 0 && (
                        <span className="float-right text-blue-600">●</span>
                      )}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#material-filter"
                      className="block p-3 hover:bg-blue-50 text-sm transition-colors duration-200"
                    >
                      Chất liệu{" "}
                      {tempFilters.materials?.length > 0 && (
                        <span className="float-right text-blue-600">●</span>
                      )}
                    </a>
                  </li>
                  {Object.keys(filterOptions.dynamicFilters || {}).map(
                    (code) => (
                      <li key={code}>
                        <a
                          href={`#${code}-filter`}
                          className="block p-3 hover:bg-blue-50 text-sm transition-colors duration-200"
                        >
                          {filterOptions.dynamicFilters[code].display_name}
                          {tempDynamicFilters[code]?.length > 0 && (
                            <span className="float-right text-blue-600">●</span>
                          )}
                        </a>
                      </li>
                    )
                  )}
                  <li>
                    <a
                      href="#services-filter"
                      className="block p-3 hover:bg-blue-50 text-sm transition-colors duration-200"
                    >
                      Dịch vụ & Khuyến mãi
                      {(tempCheckboxFilters.fastDelivery ||
                        tempCheckboxFilters.freeShip ||
                        tempCheckboxFilters.topDeal ||
                        tempCheckboxFilters.fourPlusStar) && (
                        <span className="float-right text-blue-600">●</span>
                      )}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Vùng hiển thị filter */}
          <div className="md:w-3/4 lg:w-4/5 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
            <div className="space-y-8">
              {/* Khoảng giá */}
              {filterOptions?.priceRanges &&
                filterOptions.priceRanges.length > 0 && (
                  <div
                    id="price-filter"
                    className="border-b border-gray-200 pb-6 pt-2"
                  >
                    <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <i className="pi pi-dollar text-blue-600 text-xs"></i>
                      </span>
                      Khoảng giá
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {filterOptions.priceRanges.map((priceRange) => (
                        <div key={priceRange.key} className="flex items-center">
                          <Checkbox
                            inputId={`price_${priceRange.key}`}
                            checked={tempFilters.price === priceRange.key}
                            onChange={() =>
                              handleTempPriceChange(priceRange.key)
                            }
                            className="mr-2"
                          />
                          <label
                            htmlFor={`price_${priceRange.key}`}
                            className="text-sm cursor-pointer"
                          >
                            {priceRange.name}{" "}
                            {priceRange.count > 0 && (
                              <span className="text-gray-500">
                                ({priceRange.count})
                              </span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Màu sắc */}
              {filterOptions?.colors && filterOptions.colors.length > 0 && (
                <div
                  id="color-filter"
                  className="border-b border-gray-200 pb-6 pt-2"
                >
                  <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <i className="pi pi-palette text-blue-600 text-xs"></i>
                    </span>
                    Màu sắc
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filterOptions.colors.map((color) => (
                      <div key={color.key} className="flex items-center">
                        <Checkbox
                          inputId={`color_${color.key}`}
                          checked={tempFilters.colors?.includes(color.key)}
                          onChange={() => toggleTempColorFilter(color.key)}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`color_${color.key}`}
                          className="text-sm cursor-pointer flex items-center"
                        >
                          <span
                            className="w-4 h-4 rounded-full inline-block border border-gray-300"
                            style={{ backgroundColor: color.hex }}
                          ></span>
                          <span className="ml-2">
                            {color.name} {color.count > 0 && `(${color.count})`}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Thương hiệu */}
              {filterOptions?.brands && filterOptions.brands.length > 0 && (
                <div
                  id="brand-filter"
                  className="border-b border-gray-200 pb-6 pt-2"
                >
                  <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <i className="pi pi-tag text-blue-600 text-xs"></i>
                    </span>
                    Thương hiệu
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {filterOptions.brands.map((brand) => (
                      <div key={brand.key} className="flex items-center">
                        <Checkbox
                          inputId={`brand_${brand.key}`}
                          checked={tempFilters.brands?.includes(brand.key)}
                          onChange={(e) =>
                            onTempFilterChange(e, "brands", brand)
                          }
                          className="mr-2"
                        />
                        <label
                          htmlFor={`brand_${brand.key}`}
                          className="text-sm cursor-pointer truncate"
                        >
                          {brand.name} {brand.count > 0 && `(${brand.count})`}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Họa tiết */}
              {filterOptions?.patterns && filterOptions.patterns.length > 0 && (
                <div
                  id="pattern-filter"
                  className="border-b border-gray-200 pb-6 pt-2"
                >
                  <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <i className="pi pi-images text-blue-600 text-xs"></i>
                    </span>
                    Họa tiết
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {filterOptions.patterns.map((pattern) => (
                      <div key={pattern.key} className="flex items-center">
                        <Checkbox
                          inputId={`pattern_${pattern.key}`}
                          checked={tempFilters.patterns?.includes(pattern.key)}
                          onChange={(e) =>
                            onTempFilterChange(e, "patterns", pattern)
                          }
                          className="mr-2"
                        />
                        <label
                          htmlFor={`pattern_${pattern.key}`}
                          className="text-sm cursor-pointer"
                        >
                          {pattern.name}{" "}
                          {pattern.count > 0 && `(${pattern.count})`}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chất liệu */}
              {filterOptions?.materials &&
                filterOptions.materials.length > 0 && (
                  <div
                    id="material-filter"
                    className="border-b border-gray-200 pb-6 pt-2"
                  >
                    <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <i className="pi pi-box text-blue-600 text-xs"></i>
                      </span>
                      Chất liệu
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {filterOptions.materials.map((material) => (
                        <div key={material.key} className="flex items-center">
                          <Checkbox
                            inputId={`material_${material.key}`}
                            checked={tempFilters.materials?.includes(
                              material.key
                            )}
                            onChange={(e) =>
                              onTempFilterChange(e, "materials", material)
                            }
                            className="mr-2"
                          />
                          <label
                            htmlFor={`material_${material.key}`}
                            className="text-sm cursor-pointer"
                          >
                            {material.name}{" "}
                            {material.count > 0 && `(${material.count})`}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Filter động */}
              {filterOptions.dynamicFilters &&
                Object.entries(filterOptions.dynamicFilters).map(
                  ([code, filterData]) => (
                    <div
                      id={`${code}-filter`}
                      key={code}
                      className="border-b border-gray-200 pb-6 pt-2"
                    >
                      <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                        <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                          <i className="pi pi-filter text-blue-600 text-xs"></i>
                        </span>
                        {filterData.display_name}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {filterData.values.map((item) => (
                          <div key={item.key} className="flex items-center">
                            <Checkbox
                              inputId={`${code}_${item.key}`}
                              checked={tempDynamicFilters[code]?.includes(
                                item.key
                              )}
                              onChange={(e) =>
                                handleTempDynamicFilterChange(
                                  code,
                                  e.checked,
                                  item.key
                                )
                              }
                              className="mr-2"
                            />
                            <label
                              htmlFor={`${code}_${item.key}`}
                              className="text-sm cursor-pointer"
                            >
                              {item.name} {item.count > 0 && `(${item.count})`}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

              {/* Dịch vụ */}
              <div id="services-filter" className="pb-6 pt-2">
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <i className="pi pi-truck text-blue-600 text-xs"></i>
                  </span>
                  Dịch vụ & Khuyến mãi
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <Checkbox
                      inputId="fastDelivery"
                      checked={tempCheckboxFilters.fastDelivery}
                      onChange={(e) =>
                        handleTempCheckboxChange(e, "fastDelivery")
                      }
                      className="mr-3"
                    />
                    <label
                      htmlFor="fastDelivery"
                      className="text-sm cursor-pointer flex items-center"
                    >
                      <img
                        src="https://salt.tikicdn.com/ts/tka/a8/31/b6/802e2c99dcce64c67aa2648edb15dd25.png"
                        alt="Giao siêu tốc 2H"
                        className="h-[25px] mr-2"
                      />
                      <span className="text-red-500 font-bold">
                        Giao siêu tốc 2H
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <Checkbox
                      inputId="topDeal"
                      checked={tempCheckboxFilters.topDeal}
                      onChange={(e) => handleTempCheckboxChange(e, "topDeal")}
                      className="mr-3"
                    />
                    <label
                      htmlFor="topDeal"
                      className="text-sm cursor-pointer flex items-center"
                    >
                      <img
                        src="https://salt.tikicdn.com/ts/upload/b5/aa/48/2305c5e08e536cfb840043df12818146.png"
                        alt="Siêu rẻ"
                        className="h-[25px] mr-2"
                      />
                      <span className="text-red-500 font-bold">Siêu rẻ</span>
                    </label>
                  </div>

                  <div className="flex items-center p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <Checkbox
                      inputId="freeShip"
                      checked={tempCheckboxFilters.freeShip}
                      onChange={(e) => handleTempCheckboxChange(e, "freeShip")}
                      className="mr-3"
                    />
                    <label
                      htmlFor="freeShip"
                      className="text-sm cursor-pointer flex items-center"
                    >
                      <img
                        src="https://salt.tikicdn.com/ts/upload/2f/20/77/0f96cfafdf7855d5e7fe076dd4f34ce0.png"
                        alt="Freeship"
                        className="h-[25px] mr-2"
                      />
                      <span className="text-gray-700">FreeShip Xtra</span>
                    </label>
                  </div>

                  <div className="flex items-center p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <Checkbox
                      inputId="fourStar"
                      checked={tempCheckboxFilters.fourPlusStar}
                      onChange={(e) =>
                        handleTempCheckboxChange(e, "fourPlusStar")
                      }
                      className="mr-3"
                    />
                    <label
                      htmlFor="fourStar"
                      className="text-sm cursor-pointer flex items-center"
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
                      <span className="ml-1">từ 4 sao</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Color Overlay Panel */}
      <OverlayPanel ref={colorPanelRef} className="w-96">
        {/* ...existing code... */}
      </OverlayPanel>
    </div>
  );
};

export default SearchResults;


