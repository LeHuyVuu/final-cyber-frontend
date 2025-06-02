import { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { TabView, TabPanel } from "primereact/tabview";
import { Dialog } from "primereact/dialog";
import { BreadCrumb } from "primereact/breadcrumb";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import "./styleDetail.css";
import ProductReviews from "./ProductReviews";
import RelatedProducts from "./RelatedProducts";
import { getData } from "../../../context/api";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { sCountItem } from "../../../context/store";
import Like from "../../Home/Partial/Like";
import SkeletonLoader from "../../../components/SkeletonLoader/SkeletonLoader.jsx";
import { InputNumber } from "primereact/inputnumber";
import API_BASE_URL from "../../../apiConfig.js";

const COLORS = {
  background: "#ffffff",
  text: "#000000",
  accentBlue: "#4dabf7",
  lightGray: "#f8f9fa",
  mediumGray: "#e0e0e0",
  darkGray: "#666666",
  border: "#dee2e6",
  success: "#51CF66",
  warning: "#FFD43B",
  danger: "#FF6B6B",
  info: "#339AF0",
};

const ProductDetail = () => {
  const { id } = useParams();
  const [productRes, setProductRes] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getData(`${API_BASE_URL}/api/Products/${id}`);
        setProductRes(res.data.data);
        console.log(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const breadcrumbItems = productRes?.breadcrumbs?.map((item, index, arr) => {
    const isLast = index === arr.length - 1;

    // Nếu là phần tử cuối cùng, chỉ trả về label
    if (isLast) {
      return {
        label: item.name,
      };
    }

    // Trích xuất key và id từ URL dạng "/slug/c1234"
    const match = item.url.match(/\/([^/]+)\/c(\d+)/);

    if (match) {
      const key = match[1];
      const id = match[2];

      return {
        label: item.name,
        url: `http://localhost:3000/category/${id}?urlKey=${key}`,
      };
    }

    // Nếu không khớp, giữ nguyên URL (phòng trường hợp là đường dẫn đầy đủ)
    return {
      label: item.name,
      url: item.url,
    };
  });

  const breadcrumbHome = { icon: "pi pi-home", url: "/" };
  const lastItem = { label: productRes?.name };
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productRes?.images?.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) =>
        (prev - 1 + productRes?.images?.length) % productRes?.images?.length
    );
  };

  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  const [review, setReview] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const res = await getData(
        `https://tiki.vn/api/v2/reviews?limit=5&include=comments,contribute_info,attribute_vote_summary&sort=score%7Cdesc,id%7Cdesc,stars%7Call&page=1&product_id=${id}`
      );
      setReview(res.data);
    };
    fetchData();
  }, [id]);

  const addToCart = (product, quantity) => {
    const authen = localStorage.getItem("token");
    if (authen != null) {
      const cartItem = {
        id: product.productid,
        name: product.productname,
        price: product.discount_price || product.price,
        original_price: product.price,
        quantity: quantity,
        totalPrice: (product.discount_price || product.price) * quantity,
        thumbnail_url: product.image,
      };

      const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingIndex = existingCart.findIndex((item) => item.id === cartItem.id);

      if (existingIndex !== -1) {
        existingCart[existingIndex].quantity += quantity;
        existingCart[existingIndex].totalPrice =
          existingCart[existingIndex].quantity * cartItem.price;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem("cartItems", JSON.stringify(existingCart));
      sCountItem.set(existingCart.length);
    } else {
      navigate("/login");
    }
  };

  const handleBuyNow = () => {
    const authen = localStorage.getItem("token");
    if (authen != null) {
      const productToBuy = {
        id: productRes.productid,
        name: productRes.productname,
        price: productRes.discount_price || productRes.price,
        original_price: productRes.price,
        quantity: quantity,
        totalPrice: (productRes.discount_price || productRes.price) * quantity,
        thumbnail_url: productRes.image,
      };

      navigate("/step/checkout", { state: { productToBuy } });
    } else {
      navigate("/login");
    }
  };





  if (loading || !productRes) {
    return (
      <div className="bg-white text-black">
        <div className="p-2 mt-5 max-w-7xl mx-auto">
          <SkeletonLoader type="text" width="50%" height={20} />{" "}
          {/* Breadcrumb */}
        </div>
        <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto">
          {/* Skeleton cho phần hình ảnh */}
          <div className="flex-1 max-w-lg lg:max-w-xl">
            <SkeletonLoader type="image" width="100%" height={400} />{" "}
            {/* Main image */}
            <div className="flex gap-2 mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <SkeletonLoader
                    key={index}
                    type="image"
                    width="60px"
                    height="60px"
                  />
                ))}
            </div>
          </div>
          {/* Skeleton cho phần chi tiết */}
          <div className="flex-1 flex flex-col gap-4">
            <SkeletonLoader type="text" width="60%" height={20} />{" "}
            {/* Thương hiệu */}
            <SkeletonLoader type="text" width="80%" height={30} />{" "}
            {/* Tiêu đề */}
            <SkeletonLoader type="text" width="40%" height={20} />{" "}
            {/* Rating */}
            <SkeletonLoader type="text" width="70%" height={60} /> {/* Giá */}
            <SkeletonLoader type="text" width="50%" height={20} />{" "}
            {/* Số lượng */}
            <div className="flex gap-4 mt-2">
              <SkeletonLoader type="text" width="100%" height={40} />{" "}
              {/* Nút Thêm vào giỏ */}
              <SkeletonLoader type="text" width="100%" height={40} />{" "}
              {/* Nút Mua ngay */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast ref={toast} />
      <div className="bg-white text-black">
        <div className="py-5 mt-5 container mx-auto flex justify-center items-center ">
          <BreadCrumb
            model={breadcrumbItems}
            home={breadcrumbHome}
            end={lastItem}
            className="bg-transparent border-none p-1 text-[15px] max-w-7xl mr-44 "
          />
        </div>





























        <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto">
          <div className="flex-1 max-w-lg lg:max-w-xl">
            <div className="flex flex-col w-full bg-white sticky top-3 gap-4 p-4 border border-gray-200 rounded-xl shadow-sm">
              <div
                className="relative cursor-zoom-in overflow-hidden rounded-lg h-[542px]"
                onClick={() => setImageModalVisible(true)}
              >
                <img
                  src={
                    productRes?.image ||
                    "fallback_image_url"
                  }
                  alt={productRes?.name}
                  className="w-full h-auto object-contain transition-transform duration-300 rounded-lg"
                />

                {productRes?.badges_new &&
                  productRes?.badges_new.length > 0 && (
                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                      {productRes?.badges_new.map(
                        (badge, idx) =>
                          badge.icon && (
                            <img
                              key={idx}
                              src={badge.icon}
                              alt={badge.text || "badge"}
                              className="h-6 drop-shadow-md "
                            />
                          )
                      )}
                    </div>
                  )}
                <div className="absolute top-1/2 w-full flex justify-between transform -translate-y-1/2 px-2 pointer-events-none">
                  <button
                    aria-label="Previous"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="bg-white/90 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md hover:bg-white transition-all duration-200 pointer-events-auto"
                  >
                    <i className="pi pi-chevron-left text-gray-800"></i>
                  </button>
                  <button
                    aria-label="Next"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="bg-white/90 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md hover:bg-white transition-all duration-200 pointer-events-auto"
                  >
                    <i className="pi pi-chevron-right text-gray-800"></i>
                  </button>
                </div>
              </div>

              <div className="flex gap-2.5 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {productRes?.product_images?.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className="relative cursor-pointer"
                  >
                    <img
                      src={image.image_url}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-16 h-16 object-cover rounded-lg transition-all duration-200 ${selectedImage === index
                        ? "border-2 border-blue-500 opacity-100"
                        : "border border-gray-300 opacity-80"
                        }`}
                    />
                    {selectedImage === index && (
                      <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-500 rounded-full" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mb-7">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <i className="pi pi-star text-blue-500"></i>
                  Điểm nổi bật:
                </h3>
                <ul className="px-6 text-gray-900  gap-2.5 ">
                  <li
                    className="flex items-center gap-2 mb-2 text-sm font-semibold"
                  >
                    <i className="pi pi-check text-blue-500"></i>
                    <span
                      className="text-gray-900 text-sm leading-relaxed"
                    >{productRes?.highlight}</span>
                  </li>

                </ul>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-white text-gray-900">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-sm text-gray-700">
                Thương hiệu:{" "}
                <b className="text-blue-500 font-semibold">
                  {productRes?.brand}
                </b>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-600">
                SKU: <span className="font-medium">{productRes?.sku}</span>
              </span>
            </div>

            <h1 className="text-2xl font-semibold mb-4 text-gray-900 leading-tight tracking-tight">
              {productRes?.productname}
            </h1>

            <div className="flex items-center gap-3 mb-5 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <Rating
                  value={productRes?.rating_avg}
                  readOnly
                  disabled
                  stars={5}
                  cancel={false}
                  className="p-rating-sm"
                />
                <span className="ml-2 text-[15px] font-semibold text-blue-500">
                  {productRes?.rating_avg}
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-600">
                <b>{productRes?.rating_count}</b> đánh giá
              </span>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <i className="pi pi-shopping-cart text-sm"></i>
                Đã bán{" "}
                <b>{productRes?.sold_quantity?.toLocaleString()}</b>
              </span>
            </div>


            <div className="">
              <div className="flex justify-between items-start mt-4 p-3 border rounded-lg  shadow-sm">
                <div className="flex flex-col">
                  {productRes?.discount_percent > 0 && (
                    <span className="text-gray-600 line-through text-base mb-1 opacity-80">
                      {formatPrice(productRes?.price)}
                    </span>
                  )}
                  <span className="text-3xl text-red-500 font-bold tracking-tight mb-1 leading-snug">
                    {formatPrice(productRes?.discount_price || productRes?.price)}
                  </span>
                  {productRes?.discount_percent > 0 && (
                    <span className="text-sm text-green-600 font-medium mt-1 bg-green-50 px-2 py-1 rounded">
                      Giảm {productRes?.discount_percent}%
                    </span>
                  )}
                </div>

                <Tag
                  value={productRes?.stock_quantity > 0 ? "Còn hàng" : "Hết hàng"}
                  severity={productRes?.stock_quantity > 0 ? "success" : "danger"}
                  className="text-sm px-3 py-1.5 rounded-lg font-semibold shadow-md"
                />
              </div>



            </div>

            <div className="flex items-center gap-4 mb-7 p-4 bg-gray-50 rounded-xl">
              <h3 className="text-gray-900 text-base font-semibold m-0">
                Số lượng:
              </h3>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">

                <InputNumber
                  value={quantity}
                  min={1}
                  max={1000}
                  showButtons
                  buttonLayout="horizontal"
                  incrementButtonIcon="pi pi-plus"
                  decrementButtonIcon="pi pi-minus"
                  inputClassName="w-14 text-center text-sm px-2 py-1 rounded-md border border-gray-300"
                  className="w-[120px]"
                  onValueChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
                <button
                  onClick={increaseQuantity}
                  className="w-10 h-10 flex items-center justify-center bg-white  text-gray-900 text-lg font-bold cursor-pointer transition-colors duration-200"
                >

                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                className="p-button-raised flex-1 bg-white border-2 border-blue-500 text-blue-500 font-semibold rounded-lg px-5 py-3 text-base transition-all duration-200"
                label="Thêm vào giỏ hàng"
                icon="pi pi-shopping-cart"
                onClick={() => {
                  addToCart(productRes, quantity);
                  toast.current.show({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Đã thêm vào giỏ hàng",
                    life: 3000,
                  });
                }
                }
              />
              <Button
                className="p-button-outlined flex-1 bg-blue-500 border-2 border-blue-500 text-white font-semibold rounded-lg px-5 py-3 text-base shadow-md transition-all duration-200"
                label="Mua ngay"
                icon="pi pi-check"
                onClick={handleBuyNow}
              />
            </div>

            <Divider className="mb-6" />

            <div className="bg-white rounded-xl p-5 mb-7 flex flex-col gap-4">
              {productRes?.benefits?.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2.5 bg-white rounded-lg shadow-sm"
                >
                  <img
                    src={benefit.icon}
                    alt="Benefit icon"
                    className="w-7 h-7 object-contain"
                  />
                  <span
                    dangerouslySetInnerHTML={{ __html: benefit.text }}
                    className="text-gray-900 text-sm leading-relaxed"
                  ></span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 text-gray-900 p-5 border border-gray-200 rounded-xl bg-white">
              <h3 className="text-lg font-semibold m-0 mb-2 text-gray-900 flex items-center gap-2">
                <i className="pi pi-truck text-blue-500"></i>
                Thông tin vận chuyển
              </h3>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <i className="pi pi-send text-lg text-blue-500"></i>
                <div className="text-[15px]">
                  <span className="font-semibold">Miễn phí vận chuyển toàn quốc</span>
                  <div className="text-sm text-gray-600 mt-1">
                    Áp dụng cho đơn hàng từ 500.000₫ trở lên
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <i className="pi pi-clock text-lg text-blue-500"></i>
                <div className="text-[15px]">
                  <span className="font-semibold">Giao hàng nhanh chóng</span>
                  <div className="text-sm text-gray-600 mt-1">
                    Nhận hàng trong 2–5 ngày làm việc
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <i className="pi pi-shield text-lg text-blue-500"></i>
                <div className="text-[15px]">
                  <span className="font-semibold">Chính sách đổi trả linh hoạt</span>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: productRes?.return_and_exchange_policy?.replace(
                        /<br\s*\/?>/gi,
                        " "
                      ),
                    }}
                    className="text-sm text-gray-600 mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <i className="pi pi-phone text-lg text-blue-500"></i>
                <div className="text-[15px]">
                  <span className="font-semibold">Hỗ trợ khách hàng 24/7</span>
                  <div className="text-sm text-gray-600 mt-1">
                    Luôn sẵn sàng giải đáp mọi thắc mắc của bạn bất kỳ lúc nào
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>













































        <div className="max-w-7xl mx-auto px-4 mb-10 bg-white">
          <TabView
            activeIndex={activeTab}
            onTabChange={(e) => setActiveTab(e.index)}
            className="text-gray-900 shadow-sm rounded-xl overflow-hidden"
          >
            <TabPanel
              header={
                <span className="flex items-center gap-2 py-2 text-base font-semibold">
                  <i className="pi pi-info-circle"></i>
                  Mô tả sản phẩm
                </span>
              }
            >
              <div className="p-8 pb-8 text-gray-900 leading-relaxed">
                <div
                  dangerouslySetInnerHTML={createMarkup(
                    productRes?.description
                  )}
                  className="text-[15px] text-gray-600"
                ></div>
              </div>
            </TabPanel>

            <TabPanel
              header={
                <span className="flex items-center gap-2 py-2 text-base font-semibold">
                  <i className="pi pi-list"></i>
                  Thông số kỹ thuật
                </span>
              }
            >
              <div className="py-8 pb-8">
                <div className="w-full border-collapse bg-white text-gray-900 border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      {productRes?.specifications?.[0]?.attributes?.length >
                        0 ? (
                        productRes.specifications[0].attributes.map(
                          (attr, index) => (
                            <tr
                              key={index}
                              className={
                                index !==
                                  productRes.specifications[0].attributes.length -
                                  1
                                  ? "border-b border-gray-200"
                                  : ""
                              }
                            >
                              <td className="pl-4 py-3 w-[20%] bg-gray-50 font-semibold text-gray-900 border-r border-gray-200 text-[15px]">
                                {attr?.name}
                              </td>
                              <td className="pl-4 py-3 text-gray-900 text-[15px] leading-relaxed">
                                {attr?.value}
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan="2"
                            className="text-center py-3 text-gray-500"
                          >
                            No specifications available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabPanel>

            <TabPanel
              header={
                <span className="flex items-center gap-2 py-2 text-base font-semibold">
                  <i className="pi pi-star"></i>
                  Đánh giá sản phẩm
                </span>
              }
            >
              <ProductReviews
                id={productRes?.id}
                rating={productRes?.rating_average}
                reviewCount={productRes?.review_count}
                review={review}
              />
            </TabPanel>
          </TabView>
        </div>

        <div className="max-w-7xl mx-auto mt-11">
          <Like />
        </div>
      </div>

      <Dialog
        visible={imageModalVisible}
        onHide={() => setImageModalVisible(false)}
        className="w-[90vw] max-w-7xl max-h-[90vh] "
        header={null}
        dismissableMask
        maximizable
        contentStyle={{
          padding: 0,
          overflow: "hidden",
          borderRadius: "0.5rem",
          backgroundColor: COLORS.background,
        }}
        showHeader={false}
      >
        <div className="text-center relative bg-white min-h-[85vh] flex flex-col justify-center pt-10">
          <button
            onClick={() => setImageModalVisible(false)}
            className="absolute top-5 right-5 bg-blue-500 border-none rounded-full w-11 h-11 flex items-center justify-center cursor-pointer z-10 shadow-lg transition-all duration-200"
          >
            <i className="pi pi-times text-white text-xl"></i>
          </button>

          <div className="flex justify-center items-center flex-1">
            <img
              src={
                productRes?.image ||
                "fallback_image_url"
              }
              alt={productRes?.name || "Product Name"}
              className="max-w-[90%] max-h-[70vh] object-contain mx-auto shadow-lg transition-transform duration-300 rounded-lg"
            />
          </div>

          <div className="mt-8 flex justify-center gap-5 items-center px-5">
            <Button
              icon="pi pi-chevron-left"
              onClick={prevImage}
              rounded
              className="bg-blue-500 text-white w-11 h-11 shadow-md"
            />

            <div className="flex gap-3 bg-red p-3 px-5 rounded-xl items-center overflow-x-auto max-w-[70vw] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {productRes?.product_images?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-[70px] h-[70px] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 flex-shrink-0 ${selectedImage === index
                    ? "border-3 border-blue-500 opacity-100"
                    : "border-3 border-transparent opacity-70"
                    }`}
                >
                  <img
                    src={image?.image_url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <Button
              icon="pi pi-chevron-right"
              onClick={nextImage}
              rounded
              className="bg-blue-500 text-white w-11 h-11 shadow-md"
            />
          </div>

          <div className=" w-full  text-center text-white font-semibold text-[15px] bg-blue-500 rounded-b-lg py-2 mt-5">
            {selectedImage + 1} / {productRes?.images?.length}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ProductDetail;
