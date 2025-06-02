import { useEffect, useState } from "react";
import { Rating } from "primereact/rating";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useParams } from "react-router-dom";
import API_BASE_URL from "../../../apiConfig";

const ProductListing = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);

  useEffect(() => {
    const controller = new AbortController(); // ✅ Create AbortController
    const signal = controller.signal;

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/Products/category/${categoryId}?page=${currentPage}&pageSize=10&sortBy=productid&sortOrder=asc`,
          { signal } // ✅ Attach signal here
        );
        const json = await res.json();
        const newProducts = json.data.products;

        setProducts((prev) => [...prev, ...newProducts]);
        setHasMore(currentPage < json.data.pagination.totalPages);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Request aborted");
        } else {
          console.error("Failed to fetch products:", error);
        }
      }
    };

    fetchProducts();

    return () => {
      controller.abort(); // ✅ Cleanup to abort the request
    };
  }, [categoryId, currentPage]);

  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [categoryId]);

  const itemTemplate = (product) => (
    <div className="col-span-1 group relative">
      <Link to={`/detail/${product.productid}`}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md flex flex-col h-full">
          <div className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.productname}
              className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-3 m-1 flex flex-col flex-grow">
            <h3 className="text-gray-800 text-sm font-medium mb-2 line-clamp-2 h-10">
              {product.productname}
            </h3>
            <div className="min-h-[25px] items-center">
              {product.price > product.discount_price && (
                <span className="text-sm text-gray-500 line-through italic">
                  {formatCurrency(product.price)}
                </span>
              )}
              {product.discount_percent > 0 && (
                <span className="ml-2 bg-[#ff424e] px-1 py-1 text-xs text-white rounded-sm">
                  -{product.discount_percent}%
                </span>
              )}
            </div>
            <span className="text-xl font-bold text-[#ff424e]">
              {formatCurrency(product.discount_price)}
            </span>
            <div className="card flex justify-between mt-2">
              <Rating value={product.rating_avg} disabled cancel={false} />
              <div className="text-sm text-gray-600">
                Đã bán {product.sold_quantity}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <InfiniteScroll
        dataLength={products.length}
        next={() => setCurrentPage((prev) => prev + 1)}
        hasMore={hasMore}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.productid}>{itemTemplate(product)}</div>
            ))
          ) : (
            <p>Không tìm thấy sản phẩm</p>
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ProductListing;
