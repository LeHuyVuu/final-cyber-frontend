import { useRef, useState, useEffect } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Checkbox } from "primereact/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { sCountItem } from "../../context/store";
import UserInfo from "../../components/LocationUser/UserInfo";
import Like from "../Home/Partial/Like";
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const orderSummaryRef = useRef(null);

    const carouselAds = [
        {
            id: 1,
            title: "Summer Sale",
            description: "Up to 50% off on all summer items!",
            image:
                "https://img.freepik.com/free-vector/gradient-sale-background_23-2148934477.jpg",
            buttonText: "Shop Now",
        },
        {
            id: 2,
            title: "New Arrivals",
            description: "Check out our latest collection!",
            image:
                "https://img.freepik.com/free-vector/realistic-3d-sale-background_52683-62689.jpg",
            buttonText: "Explore",
        },
        {
            id: 3,
            title: "Flash Deal",
            description: "24 hours only! Special prices on selected items.",
            image:
                "https://img.freepik.com/free-vector/gradient-sale-background_23-2148829809.jpg",
            buttonText: "Don't Miss Out",
        },
    ];

    const [cartItems, setCartItems] = useState(() => {
        const storedItems = localStorage.getItem("cartItems");
        return storedItems ? JSON.parse(storedItems) : [];
    });
    console.log(cartItems);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(cartItems.length / itemsPerPage);

    const [selectAllBySeller, setSelectAllBySeller] = useState({});

    const calculateTotal = () => {
        return selectedItems.reduce((total, item) => total + item.totalPrice, 0);
    };

    const handleQuantityChange = (id, newQuantity) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity };
                    if (selectedItems.some(selectedItem => selectedItem.id === item.id)) {
                        setSelectedItems(prevSelectedItems => {
                            return prevSelectedItems.map(selItem => {
                                if (selItem.id === item.id) {
                                    return updatedItem;
                                }
                                return selItem;
                            });
                        });
                    }
                    return updatedItem;
                }
                return item;
            });
            localStorage.setItem("cartItems", JSON.stringify(updatedItems));
            return updatedItems;
        });
    };

    const removeItem = (id) => {
        confirmDialog({
            message: "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?",
            header: "Xóa sản phẩm",
            icon: "pi pi-trash",
            acceptLabel: "Xóa",
            rejectLabel: "Hủy",
            acceptClassName: "p-button-danger",
            rejectClassName: "p-button-secondary",
            footer: (options) => (
                <div className="flex justify-end">
                    <Button
                        label="Hủy"
                        style={{ marginRight: "16px" }}
                        className="p-button-secondary"
                        onClick={() => {
                            toast.current.show({ severity: "warn", summary: "Đã hủy", detail: "Không xóa sản phẩm", life: 3000 });
                            options.reject(); // Explicitly call reject to close dialog
                        }}
                    />
                    <Button
                        label="Xóa"
                        style={{ background: "#f44336", color: "white", border: "none", padding: "10px 20px" }}
                        className="p-button-danger"
                        onClick={() => {
                            setCartItems(prevItems => {
                                const updatedItems = prevItems.filter(item => item.id !== id);
                                localStorage.setItem("cartItems", JSON.stringify(updatedItems));
                                setSelectedItems(prevSelectedItems => prevSelectedItems.filter(item => item.id !== id));
                                sCountItem.set(updatedItems.length);
                                toast.current.show({ severity: "success", summary: "Đã xóa", detail: "Sản phẩm đã được xóa khỏi giỏ hàng", life: 3000 });
                                return updatedItems;
                            });
                            options.accept(); // Explicitly call accept to close dialog
                        }}
                    />
                </div>
            ),
        });
    };

    const confirmRemoveAll = () => {
        confirmDialog({
            message: "Bạn có chắc muốn xóa tất cả sản phẩm?",
            header: "Xóa tất cả",
            icon: "pi pi-trash",
            acceptLabel: "Xóa hết",
            rejectLabel: "Hủy",
            acceptClassName: "p-button-danger",
            rejectClassName: "p-button-secondary",
            footer: (options) => (
                <div className="flex justify-end">
                    <Button
                        label="Hủy"
                        style={{ marginRight: "16px" }}
                        className="p-button-secondary"
                        onClick={() => {
                            toast.current.show({ severity: "warn", summary: "Đã hủy", detail: "Không xóa sản phẩm nào", life: 3000 });
                            options.reject(); // Explicitly call reject to close dialog
                        }}
                    />
                    <Button
                        label="Xóa hết"
                        style={{ background: "#f44336", color: "white", border: "none", padding: "10px 20px" }}
                        className="p-button-danger"
                        onClick={() => {
                            setCartItems([]);
                            setSelectedItems([]);
                            localStorage.removeItem("cartItems");
                            sCountItem.set(0);
                            toast.current.show({ severity: "success", summary: "Đã xóa tất cả sản phẩm", detail: "", life: 3000 });
                            options.accept(); // Explicitly call accept to close dialog
                        }}
                    />
                </div>
            ),
        });
    };

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const handleSelectItem = (id) => {
        setSelectedItems(prevSelectedItems => {
            const isItemSelected = prevSelectedItems.some(item => item.id === id);
            if (isItemSelected) {
                return prevSelectedItems.filter(item => item.id !== id);
            } else {
                const itemToAdd = cartItems.find(item => item.id === id);
                return [...prevSelectedItems, itemToAdd];
            }
        });
    };

    const handleSelectAllBySeller = (seller) => {
        setSelectAllBySeller(prev => {
            const newSelectAllBySeller = { ...prev };
            newSelectAllBySeller[seller] = !newSelectAllBySeller[seller];

            if (newSelectAllBySeller[seller]) {
                setSelectedItems(prevSelectedItems => [
                    ...prevSelectedItems,
                    ...cartItems.filter(item => item.current_seller === seller && !prevSelectedItems.some(selectedItem => selectedItem.id === item.id))
                ]);
            } else {
                setSelectedItems(prevSelectedItems => prevSelectedItems.filter(item => item.current_seller !== seller));
            }

            return newSelectAllBySeller;
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]); // Nếu đã chọn hết, bỏ chọn tất cả
            setSelectAllBySeller({}); // Bỏ chọn tất cả checkbox của seller
        } else {
            setSelectedItems(cartItems); // Nếu chưa chọn hết, chọn tất cả sản phẩm
            // Chọn tất cả các seller
            const newSelectAllBySeller = cartItems.reduce((acc, item) => {
                acc[item.current_seller] = true;
                return acc;
            }, {});
            setSelectAllBySeller(newSelectAllBySeller); // Cập nhật chọn tất cả seller
        }
        setSelectAll(!selectAll);
    };


    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            toast.current.show({ severity: "warn", summary: "Chưa có sản phẩm nào được chọn", detail: "Vui lòng chọn ít nhất một sản phẩm để thanh toán", life: 3000 });
        } else {
            navigate("/step/checkout", { state: { productToBuy: selectedItems } });
        }
    };

    const groupedBySeller = cartItems.reduce((acc, item) => {
        const seller = item.current_seller;
        if (!acc[seller]) {
            acc[seller] = [];
        }
        acc[seller].push(item);
        return acc;
    }, {});

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const currentItems = cartItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="min-h-screen">
            <Toast ref={toast} />
            <ConfirmDialog />

            <main className="py-10 px-10">
                <div className="container mx-auto px-4">
                    {/* <div className="flex justify-between items-center mb-6">
                        <div className="font-semibold text-3xl text-gray-800">
                            <i className="pi pi-shopping-bag mr-2 text-3xl"></i>Giỏ Hàng
                        </div>
                        <div className="flex items-center space-x-2">
                            <Link to='/'>
                                <button className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform -rotate-90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path d="M10 3a1 1 0 01.707.293l3 3a1 1 0 11-1.414 1.414L11 5.414V14a1 1 0 11-2 0V5.414L7.707 7.707A1 1 0 116.293 6.293l3-3A1 1 0 0110 3z" />
                                    </svg>
                                    Tiếp tục mua sắm
                                </button>
                            </Link>
                        </div>
                    </div> */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items */}
                        <div className="w-full lg:w-2/3">
                            {cartItems.length === 0 ? (
                                <div className="bg-white p-8 rounded-lg text-center">
                                    <i className="pi pi-shopping-cart text-6xl text-gray-400 mb-4"></i>
                                    <h3 className="text-xl font-semibold text-gray-700">Không có sản phẩm trong giỏ hàng</h3>
                                    <p className="text-gray-500 mt-2">Hãy thêm sản phẩm để bắt đầu mua sắm!</p>
                                </div>
                            ) : (
                                <div>
                                    {/* Select All Header */}
                                    <div className=" bg-blue-200 grid grid-cols-12 items-center px-4 rounded-t-md">
                                        <div className="col-span-5 flex items-center gap-2">
                                            <Checkbox
                                                inputId="selectAll"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                            />
                                            <label htmlFor="selectAll" className="text-gray-800 font-semibold text-md ml-2">
                                                Tất cả sản phẩm ({cartItems.length})
                                            </label>
                                        </div>
                                        <div className="col-span-2 text-center text-gray-800 font-semibold text-md">
                                            Đơn giá
                                        </div>
                                        <div className="col-span-2 text-center text-gray-800 font-semibold text-md ml-8">
                                            Số lượng
                                        </div>
                                        <div className="col-span-2 text-center text-gray-800 font-semibold text-md">
                                            Thành tiền
                                        </div>
                                        <div className="col-span-1 text-center ml-2">
                                            <Button className='text-gray-800'
                                                icon="pi pi-trash"
                                                rounded
                                                size="large"
                                                text
                                                severity="secondary"
                                                aria-label="Xóa tất cả"
                                                onClick={confirmRemoveAll}
                                            />
                                        </div>
                                    </div>

                                    {/* Shop-wise Selection */}
                                    {Object.keys(groupedBySeller).map((seller) => (
                                        <div key={seller} className="bg-white">
                                            <div className="flex items-center px-4 gap-2 py-2 my-4">
                                                <div className="mr-2">
                                                    <Checkbox
                                                        checked={selectAllBySeller[seller] || false}
                                                        onChange={() => handleSelectAllBySeller(seller)}
                                                        inputId={`selectAll-${seller}`}
                                                    />
                                                </div>
                                                <div className="text-2xl">
                                                    <i className="pi pi-shop text-gray-500 mr-1"></i>
                                                    <span className='text-base'>{seller}</span>
                                                </div>
                                            </div>
                                            <div className="w-full border-t border-gray-400"></div>
                                            {groupedBySeller[seller].map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="grid grid-cols-12 items-center border-b p-4 cursor-pointer hover:bg-gray-50"
                                                    onClick={(e) => {
                                                        // Prevent triggering if clicking the delete button or quantity input
                                                        if (!e.target.closest('.p-button') && !e.target.closest('.p-inputnumber')) {
                                                            handleSelectItem(item.id);
                                                        }
                                                    }}
                                                >
                                                    <div className="col-span-5 flex">
                                                        <Checkbox
                                                            checked={selectedItems.some(selectedItem => selectedItem.id === item.id)}
                                                            onChange={() => handleSelectItem(item.id)}
                                                        />
                                                        <img src={item.thumbnail_url} alt="Product" className="w-20 h-20 object-cover rounded mr-4 ml-2" />
                                                        <div>
                                                            <h5 className="text-md text-[#1a1a2e] mb-1 min-h-12 line-clamp-3 overflow-hidden text-ellipsis">{item.name}</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-2 text-center text-red-400 font-medium">
                                                        <p className=" m-0">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</p>
                                                        {item.original_price && item.original_price !== item.price && (
                                                            <span className="text-xs text-gray-500 line-through mb-2">
                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.original_price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="col-span-2 flex justify-center">
                                                        <InputNumber
                                                            value={item.quantity}
                                                            min={1}
                                                            max={1000}
                                                            showButtons
                                                            buttonLayout="horizontal"
                                                            incrementButtonIcon="pi pi-plus"
                                                            decrementButtonIcon="pi pi-minus"
                                                            inputClassName="w-14 text-center text-sm px-2 py-1 rounded-md border border-gray-300"
                                                            className="w-[120px]"
                                                            onValueChange={(e) => handleQuantityChange(item.id, e.value)}
                                                        />
                                                    </div>
                                                    <div className="col-span-2 text-center text-red-400 font-medium">
                                                        <p className="flex flex-col m-0">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalPrice)}
                                                        </p>
                                                    </div>
                                                    <div className="col-span-1 text-gray-500 text-center">
                                                        <Button
                                                            icon="pi pi-trash"
                                                            severity="contrast"
                                                            size="small"
                                                            className="ml-2"
                                                            onClick={() => removeItem(item.id)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="w-full lg:w-1/3 sticky h-full left-0 top-40 self-auto">
                            <Card
                                className="shadow-xl rounded-2xl bg-white mb-6"
                            >
                                <h3 className="text-2xl font-bold text-[#1a1a2e]">Tạm tính</h3>
                                <div className="w-full mb-6 mt-2 border-t border-gray-400"></div>
                                <div className="flex justify-between mb-3 text-base">
                                    <span>Tổng tiền hàng:</span>
                                    <span className="font-semibold text-gray-800">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
                                    </span>
                                </div>
                                <Divider className="my-4" />
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Tổng tiền thanh toán:</span>
                                    <span className="text-[#1a1a2e]">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
                                    </span>
                                </div>
                                <Button
                                    className="p-button-outlined flex-1 mt-10 w-full bg-blue-500 border-2 border-blue-500 text-white font-semibold rounded-lg px-5 py-3 text-base shadow-md transition-all duration-200"
                                    label="Thanh toán ngay"   
                                    onClick={handleCheckout}
                                />
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

export default Cart;