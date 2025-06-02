import { getCategoryDetail } from "./api";

// This function is for debugging only
export const testCategoryDetail = async (categoryId) => {
  try {
    console.log("Testing category detail for ID:", categoryId);
    const response = await getCategoryDetail(categoryId);
    console.log("API Response:", response.data);

    if (response.data && response.data.children) {
      console.log("Children count:", response.data.children.length);
      console.log("First few children:", response.data.children.slice(0, 3));
    } else {
      console.log("No children in the response");
    }

    return response.data;
  } catch (error) {
    console.error("Test failed:", error);
    return null;
  }
};
