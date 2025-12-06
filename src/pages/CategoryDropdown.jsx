import '../css/CategoryDropdown.css';
import { useNavigate } from 'react-router-dom';

function CategoryDropdown() {
  const navigate = useNavigate();

  const categories = [
    { icon: 'https://cdn.tgdd.vn/Files/2019/08/29/1193017/cach-nhan-biet-va-chon-muc-ong-tuoi-che-bien-mon-ngon-cho-gia-dinh-201908292012247702.jpg', name: 'Mực' },
    { icon: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/kho_bo_bao_nhieu_calo_753ef99b05.jpg', name: 'Khô bò' },
    { icon: 'https://cdn.tgdd.vn/2021/07/CookProduct/thumc-1200x676.jpg', name: 'Khô cá' },
    { icon: 'https://img.icons8.com/color/48/000000/cake.png', name: 'Bánh' },
    { icon: 'https://img.icons8.com/color/48/000000/gift.png', name: 'Đồ lưu niệm' },
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
          <span className="category-icon">
            <img src={cat.icon} alt={cat.name} />
          </span>
          <span className="category-name">{cat.name}</span>
        </div>
      ))}
    </div>
  );
}

export default CategoryDropdown;
