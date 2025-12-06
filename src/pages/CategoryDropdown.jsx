import '../css/CategoryDropdown.css';
import {
  FaLaptop, FaDesktop, FaRegImages,
  FaMicrochip, FaPlug
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

function CategoryDropdown() {
  const navigate = useNavigate();

  const categories = [
    { icon: <FaLaptop />, name: 'Mực' },
    { icon: <FaDesktop />, name: 'Khô bò' },
    { icon: <FaRegImages />, name: 'Khô cá' },
    { icon: <FaMicrochip />, name: 'Bánh' },
    { icon: <FaPlug />, name: 'Di sản văn hóa' },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="category-dropdown">
      {categories.map((cat, idx) => (
        <div
          className="category-item"
          key={idx}
          onClick={() => handleCategoryClick(cat.name)}
        >
          <span className="category-icon">{cat.icon}</span>
          <span>{cat.name}</span>
        </div>
      ))}
    </div>
  );
}

export default CategoryDropdown;
