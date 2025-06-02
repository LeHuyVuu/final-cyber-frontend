import { useRef, useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Checkbox } from "primereact/checkbox";
import Like from "../Home/Partial/Like";
import { useLocation, useNavigate } from "react-router-dom";
import { sProductsToBuy } from "../../context/store";
import UserInfo from "../../components/LocationUser/UserInfo";
import axios from "axios";
import { signify } from "react-signify";
import API_BASE_URL from "../../apiConfig";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.productToBuy;
  sProductsToBuy.set(product);
  const [products, setProducts] = useState(Array.isArray(product) ? product : [product]);
  const toast = useRef(null);
  const LoginUser = localStorage.getItem("LoginUser");
  const coin = parseInt(localStorage.getItem("point" + LoginUser) || "0");
  const [usePoints, setUsePoints] = useState(false);
  const sProduct = signify([]);
  if (!product || (Array.isArray(product) && product.length === 0)) {
    window.location.href = "/";
  }

  const handleQuantityChange = (id, newQuantity) => {
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === id
          ? { ...prod, quantity: newQuantity, totalPrice: newQuantity * prod.price }
          : prod
      )
    );
  };

  const calculateTotal = () => {
    let total = products.reduce((sum, item) => sum + item?.totalPrice, 0);
    if (usePoints) {
      total -= coin;
      localStorage.setItem("point" + LoginUser, 0);
    }
    return total > 0 ? total : 0;
  };

  const redirectToPayPal = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.current.show({
          severity: "error",
          summary: "Lỗi",
          detail: "Bạn cần đăng nhập để thanh toán.",
        });
        return;
      }

      const total = calculateTotal();
      const orderDetails = products.map((p) => ({
        productID: p.id,        // đúng với Swagger
        quantity: p.quantity,
        price: p.price
      }));

      // Gọi API /api/Order/checkout
      await axios.post(
        `${API_BASE_URL}/api/Order/checkout`,
        { orderDetails },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = await axios.post(
       `${API_BASE_URL}/api/Payment/paypal`,
        JSON.stringify(total.toString()), // API yêu cầu string
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const url = res.data?.url;
      if (url) {
        sProduct.set(products); // ✅ Ghi danh sách sản phẩm vào store
        window.location.href = url;

      } else {
        toast.current.show({
          severity: "error",
          summary: "Lỗi",
          detail: "Không lấy được URL thanh toán từ PayPal",
        });
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: err.response?.data?.message || "Gặp lỗi khi chuyển sang PayPal.",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Toast ref={toast} />
      <ConfirmDialog />
      <main className="pt-10 px-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between flex-col lg:flex-row gap-8">
            <div className="w-full rounded-md">
              <div className="bg-blue-200 py-3 grid grid-cols-12 items-center rounded-t-md">
                <div className="col-span-6 ml-2 font-semibold text-md">{products.length} sản phẩm</div>
                <div className="col-span-2 text-center font-semibold text-md">Đơn giá</div>
                <div className="col-span-2 text-center font-semibold text-md">Số lượng</div>
                <div className="col-span-2 text-center font-semibold text-md">Thành tiền</div>
              </div>

              {products.map((product) => (
                <div key={product.id} className="grid grid-cols-12 border-b py-4 bg-white items-center">
                  <div className="col-span-6 flex items-center">
                    <img src={product.thumbnail_url} className="w-20 h-20 object-cover rounded ml-2 mr-4" />
                    <div>
                      <h5 className="text-md font-semibold">{product.name}</h5>
                      <div className="text-sm text-gray-500">{product.current_seller}</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-red-400 font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                    {product.original_price && product.original_price !== product.price && (
                      <div className="text-xs text-gray-500 line-through italic">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.original_price)}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <InputNumber
                      value={product.quantity}
                      min={1}
                      max={1000}
                      showButtons
                      buttonLayout="horizontal"
                      incrementButtonIcon="pi pi-plus"
                      decrementButtonIcon="pi pi-minus"
                      inputClassName="w-14 text-center text-sm"
                      className="w-[120px]"
                      onValueChange={(e) => handleQuantityChange(product.id, e.value)}
                    />
                  </div>
                  <div className="col-span-2 text-center text-red-400 font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.totalPrice)}
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-1/3 sticky top-40">
              <UserInfo />
              <Card className="shadow-xl p-6">
                <h3 className="text-2xl font-bold mb-6">Phương thức thanh toán</h3>
                <Divider />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng tiền:</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(calculateTotal())}
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="col-span-3 flex items-center gap-2">
                    <Checkbox
                      inputId="usePoints"
                      checked={usePoints}
                      onChange={(e) => setUsePoints(e.checked)}
                    />
                    <label htmlFor="usePoints" className="text-sm font-medium">
                      Sử dụng xu (
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(coin)}
                      )
                    </label>
                  </div>

                  <Button
                    onClick={redirectToPayPal}
                    className="rounded-xl p-4 shadow-md border col-span-3 flex flex-col items-center"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                      className="w-8 h-8 mb-1"
                    />
                    <span className="text-xs font-medium text-[#003087]">
                      Thanh toán với PayPal
                    </span>
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-28">
            <Like />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
