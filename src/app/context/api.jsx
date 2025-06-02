import axios from "axios";

const api = axios.create({
  baseURL: "",
  timeout: 10000, // Thời gian timeout mặc định
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Hàm gọi API tùy biến với phương thức (GET, POST, v.v...)
 * @param {string} method - Phương thức HTTP (GET, POST, PUT, DELETE, v.v...)
 * @param {string} url - Địa chỉ API
 * @param {object} [data] - Dữ liệu cần gửi (chỉ áp dụng cho POST, PUT, v.v...)
 * @param {object} [params] - Các tham số cần gửi trong URL (chỉ áp dụng cho GET, v.v...)
 * @returns {Promise} - Trả về Promise chứa dữ liệu API trả về
 */
const callApi = async (method, url, data = {}, params = {}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      params,
    });
    return response;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

// Các phương thức gọi API cho tiện dụng
export const getData = (url, params) => callApi("get", url, {}, params);
// export const postData = (url, data) => callApi('post', url, data);
// export const putData = (url, data) => callApi('put', url, data);
// export const deleteData = (url, data) => callApi('delete', url, data);

///////////////////////////////////////////////////////////////////////////////
/**
 * Lấy danh mục sản phẩm từ Tiki
 * @param {number} parentId - ID của danh mục cha (mặc định là 931 - danh mục thời trang nữ)
 * @returns {Promise} - Trả về Promise chứa dữ liệu danh mục
 */
export const getCategories = async (parentId) => {
  try {
    const response = await axios.get(`https://tiki.vn/api/v2/categories`, {
      params: {
        include: "children",
        parent_id: parentId,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết của danh mục từ Tiki
 * @param {number} categoryId - ID của danh mục cần lấy thông tin
 * @returns {Promise} - Trả về Promise chứa thông tin chi tiết danh mục
 */
export const getCategoryDetail = async (categoryId) => {
  try {
    const response = await axios.get(
      `https://tiki.vn/api/v2/categories/${categoryId}`,
      {
        params: {
          include: "ancestors,children",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching category detail:", error);
    throw error;
  }
};

/**
 * Lấy danh sách sản phẩm theo danh mục từ Tiki
 * @param {Object} params - Các tham số truy vấn
 * @param {string} params.urlKey - Khóa URL của danh mục (ví dụ: "dam-dang-xoe")
 * @param {number} params.categoryId - ID của danh mục (ví dụ: 27582)
 * @param {number} params.page - Số trang (mặc định: 1)
 * @param {number} params.limit - Số sản phẩm trên một trang (mặc định: 24)
 * @param {string} params.sort - Cách sắp xếp (mặc định: "top_seller")
 * @returns {Promise} - Trả về Promise chứa danh sách sản phẩm
 */
export const getProductListing = async ({
  urlKey,
  categoryId,
  page = 1,
  limit = 24,
  sort = "top_seller",
}) => {
  try {
    const response = await axios.get(
      `https://tiki.vn/api/personalish/v1/blocks/listings`,
      {
        params: {
          urlKey,
          category: categoryId,
          page,
          limit,
          sort,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching product listing:", error);
    throw error;
  }
};

/**
 * Lấy danh sách con của một danh mục từ Tiki
 * @param {number} categoryId - ID của danh mục cần lấy con
 * @returns {Promise} - Trả về Promise chứa danh sách con
 */
export const getCategoryChildren = async (categoryId) => {
  try {
    // First try to get from categories API
    const response = await axios.get(`https://tiki.vn/api/v2/categories`, {
      params: {
        parent_id: categoryId,
      },
    });

    if (response.data && response.data.data && response.data.data.length > 0) {
      return response;
    }

    // If no results, try the category detail API
    const detailResponse = await getCategoryDetail(categoryId);
    if (detailResponse.data && detailResponse.data.children) {
      return {
        data: {
          data: detailResponse.data.children,
        },
      };
    }

    // Return empty result if nothing found
    return { data: { data: [] } };
  } catch (error) {
    console.error("Error fetching category children:", error);
    throw error;
  }
};

///api tổng rồi chiết ra thành các hàm riêng
export const getProductsByCategory = async (
  category = "27582",
  page = 1,
  limit = 40,
  urlKey = "dam-dang-xoe"
) => {
  const url = `https://tiki.vn/api/personalish/v1/blocks/listings?limit=${limit}&include=advertisement&aggregations=2&version=home-persionalized&trackity_id=182be9b9-76ed-6222-e51b-b73a2c7de71f&category=${category}&page=${page}&urlKey=${urlKey}`;

  try {
    return await getData(url);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

// Hàm riêng để lấy dữ liệu banner từ API Tiki
export const getBannersByCategory = async (category = "", urlKey = "") => {
  try {
    const response = await getProductsByCategory(category, 1, 40, urlKey);
    const bannersData = response.data.widgets;
    return bannersData.map((banner) => ({
      image: banner.banner.image,
    }));
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
};

/**
 * Lấy dữ liệu filter từ API Tiki theo danh mục và URL key
 * @param {string} category - ID của danh mục (ví dụ: "27582")
 * @param {string} urlKey - URL key của danh mục (ví dụ: "dam-dang-xoe")
 * @returns {Promise} - Trả về Promise chứa dữ liệu filter đã được xử lý
 */
export const getFilters = async (category = "", urlKey = "") => {
  try {
    const response = await getProductsByCategory(category, 1, 40, urlKey);

    // Kiểm tra và trích xuất dữ liệu filter từ phản hồi API
    if (response?.data?.filters) {
      const filters = response.data.filters;

      // Trả về dữ liệu filter đã được xử lý theo nhóm
      return {
        // Filter danh mục sản phẩm
        category: filters.find((filter) => filter.code === "category") || null,

        // Nhóm các dịch vụ
        services: filters.filter((filter) =>
          ["support_p2h_delivery", "tiki_hero", "freeship_campaign"].includes(
            filter.code
          )
        ),

        // Filter đánh giá
        rating: filters.find((filter) => filter.code === "rating") || null,

        // Filter giá
        price: filters.find((filter) => filter.code === "price") || null,

        // Filter theo các thuộc tính sản phẩm (vải, chất liệu...)
        attributes: filters.filter(
          (filter) =>
            ![
              "category",
              "support_p2h_delivery",
              "tiki_hero",
              "freeship_campaign",
              "rating",
              "price",
            ].includes(filter.code)
        ),
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching filters:", error);
    return null;
  }
};

/**
 * Lấy danh sách sản phẩm có lọc
 * @param {string} category - ID danh mục
 * @param {string} urlKey - URL key của danh mục
 * @param {object} filters - Các bộ lọc
 * @param {object} pagination - Thông tin phân trang
 * @param {string} sort - Cách sắp xếp
 * @param {string} searchQuery - Từ khóa tìm kiếm (nếu có)
 * @returns {Promise} - Trả về Promise chứa danh sách sản phẩm đã lọc
 */
export const getFilteredProducts = async (
  category = "",
  urlKey = "",
  filters = {},
  pagination = { page: 1, limit: 40 },
  sort = "top_seller",
  searchQuery = null
) => {
  try {
    // Prepare URL and parameters
    let baseUrl, params;

    if (searchQuery) {
      // Search endpoint
      baseUrl = "https://tiki.vn/api/v2/products";
      params = {
        limit: pagination.limit,
        include: "advertisement",
        aggregations: 2,
        trackity_id: "182be9b9-76ed-6222-e51b-b73a2c7de71f",
        q: searchQuery,
        page: pagination.page,
      };
    } else {
      // Category endpoint
      baseUrl = "https://tiki.vn/api/personalish/v1/blocks/listings";
      params = {
        urlKey,
        category,
        page: pagination.page,
        limit: pagination.limit,
        sort,
        include: "advertisement",
        aggregations: 2,
        trackity_id: "182be9b9-76ed-6222-e51b-b73a2c7de71f",
      };
    }

    // Common filter processing
    const processedFilters = {};

    // Process price filter
    if (filters.price) {
      processedFilters.price = filters.price;
    }

    // Process rating filter
    if (filters.rating) {
      processedFilters.rating = filters.rating;
    }

    // Process services
    if (filters.services) {
      if (filters.services.support_p2h_delivery) {
        processedFilters.support_p2h_delivery = "true";
      }
      if (filters.services.tiki_hero) {
        processedFilters.tiki_hero = "true";
      }
      if (filters.services.freeship_campaign) {
        processedFilters.freeship_campaign = "true";
      }
    }

    // Process category-specific filters
    const categorySpecificFilters = [
      "cloth_material",
      "fashion_pattern",
      "option_color",
      "brand",
    ];

    categorySpecificFilters.forEach((filterName) => {
      if (filters[filterName] && filters[filterName].length > 0) {
        processedFilters[filterName] = filters[filterName].join(",");
      }
    });

    // Process other dynamic filters
    Object.keys(filters).forEach((key) => {
      if (
        !["price", "rating", "services", ...categorySpecificFilters].includes(
          key
        ) &&
        filters[key] &&
        Array.isArray(filters[key]) &&
        filters[key].length > 0
      ) {
        processedFilters[key] = filters[key].join(",");
      }
    });

    // Add filters to params
    Object.keys(processedFilters).forEach((key) => {
      params[key] = processedFilters[key];
    });

    console.log("API Call URL:", baseUrl);
    console.log("API Call Params:", params);

    // Make API call
    const response = await axios.get(baseUrl, { params });

    // Process and return data
    if (searchQuery) {
      // For search endpoint, data structure is different
      return {
        data: response.data.data,
        paging: {
          current_page: pagination.page,
          last_page: Math.ceil(response.data.paging.total / pagination.limit),
          from: (pagination.page - 1) * pagination.limit + 1,
          to: Math.min(
            pagination.page * pagination.limit,
            response.data.paging.total
          ),
          total: response.data.paging.total,
        },
        filters: response.data.filters,
      };
    }

    return {
      data: response.data.data,
      paging: response.data.paging,
      filters: response.data.filters,
    };
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    throw error;
  }
};

/**
 * Lấy dữ liệu phân trang cho sản phẩm
 * @param {Object} paging - Đối tượng phân trang từ API
 * @returns {Object} - Thông tin phân trang đã được xử lý
 */
export const getPaginationInfo = (paging) => {
  if (!paging)
    return {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 40,
      hasNextPage: false,
      hasPrevPage: false,
    };

  const { current_page, last_page, total, per_page } = paging;

  return {
    currentPage: current_page || 1,
    totalPages: last_page || 1,
    totalItems: total || 0,
    perPage: per_page || 40,
    hasNextPage: current_page < last_page,
    hasPrevPage: current_page > 1,
  };
};
