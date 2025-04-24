import { createContext, useContext, useState } from "react";

const CategoryContext = createContext();

export const useCategory = () => {
  return useContext(CategoryContext);
};

export const CategoryProvider = ({ children }) => {
  const [selectedCategoryNos, setSelectedCategoryNos] = useState([]);

  // 카테고리 번호를 추가/제거하는 함수
  const handleCategoryChange = (newSelectedCategories) => {
    setSelectedCategoryNos(newSelectedCategories);
  };

  return (
    <CategoryContext.Provider
      value={{ selectedCategoryNos, handleCategoryChange }}
    >
      {children}
    </CategoryContext.Provider>
  );
};