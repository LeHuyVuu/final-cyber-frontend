import CategoryExplore from "./Patrials/CategoryExplore";
// import ShowingProduct from "./Patrials/ShowingProduct";
import CategoryBrowser from "./Patrials/CategoryBrowser";
import { useParams, useLocation } from "react-router-dom";
import ProductListing from "./Patrials/ProductListing";

function Category() {
  const {categoryId} = useParams();
  // console.log("categoryId", categoryId);
  const location = useLocation();
  const urlKey = new URLSearchParams(location.search).get("urlKey");
  const normalizedCategoryId = categoryId?.replace(/^c/, '') || "";

  // If we have a categoryId, show product listing, otherwise show category browsing
  const renderContent = () => {
    if (categoryId) {
      // return <ProductListing />;

      return (
        <>
        
          <ProductListing  />
        </>
      );
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderContent()}</div>;
}

export default Category;
