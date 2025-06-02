import { Button } from "primereact/button";
import { Card } from "primereact/card";

const RelatedProducts = () => {
  // Sample related products data
  const relatedProducts = [
    {
      id: 1,
      name: "Cà phê hòa tan NESCAFÉ CAFÉ VIỆT 35 gói",
      price: 169000,
      image:
        "https://salt.tikicdn.com/ts/product/b2/2b/15/0da00bcd8ec1f986045e234da7b18972.png",
      rating: 4.9,
      reviewCount: 26,
      soldCount: 4135,
    },
    {
      id: 2,
      name: "Cà phê hòa tan NESCAFÉ CAFÉ VIỆT 100 gói",
      price: 459000,
      image:
        "https://salt.tikicdn.com/ts/product/ab/ab/2b/3037677baf2e8776c9199676f83022f7.png",
      rating: 4.8,
      reviewCount: 18,
      soldCount: 2890,
    },
    {
      id: 3,
      name: "Cà phê hòa tan NESCAFÉ CAFÉ VIỆT 200 gói",
      price: 859000,
      image:
        "https://salt.tikicdn.com/ts/product/1e/d6/5f/dea185fcc72b26b6314f8d3f1f27a948.png",
      rating: 4.9,
      reviewCount: 32,
      soldCount: 5670,
    },
    {
      id: 4,
      name: "Cà phê hòa tan NESCAFÉ CAFÉ VIỆT 500 gói",
      price: 1999000,
      image:
        "https://salt.tikicdn.com/ts/product/0b/cf/c3/c719f4e4ad4b160fbadcbf3566c890e9.png",
      rating: 4.7,
      reviewCount: 15,
      soldCount: 1890,
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Sản phẩm tương tự
        </h2>
        <div className="flex gap-2">
          <Button
            icon="pi pi-chevron-left"
            rounded
            className="p-button-outlined p-button-secondary"
          />
          <Button
            icon="pi pi-chevron-right"
            rounded
            className="p-button-outlined p-button-secondary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Card
            key={product.id}
            className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-4">
              <div className="relative mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-contain rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  -20%
                </div>
              </div>

              <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  <i className="pi pi-star-fill text-yellow-400 text-sm"></i>
                  <span className="ml-1 text-sm font-medium text-gray-900">
                    {product.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviewCount} đánh giá)
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <i className="pi pi-shopping-cart text-sm text-gray-500"></i>
                <span className="text-sm text-gray-500">
                  Đã bán {product.soldCount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-500">
                  {formatPrice(product.price)}
                </span>
                <Button
                  icon="pi pi-shopping-cart"
                  rounded
                  className="p-button-outlined p-button-secondary"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
