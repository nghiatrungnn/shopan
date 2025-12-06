import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/CategoryPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CategoryPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Fetch ALL products - hiển thị tất cả
    axios
      .get(`${process.env.REACT_APP_API_URL}/products?category=${categoryName}`)
      .then((res) => {
        setProducts(res.data || res.data.products || []);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Lỗi tải sản phẩm!');
      })
      .finally(() => setLoading(false));
  }, [categoryName]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exist = cart.find(item => item._id === product._id);
    if (exist) {
      exist.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('✅ Đã thêm vào giỏ hàng!', {
      position: 'top-right',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored',
    });
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="category-page">
        <div className="category-header">
          <h2 className="category-title">Danh mục: {categoryName}</h2>
        </div>
        <div className="product-list">
          {loading ? (
            <p className="loading">Đang tải...</p>
          ) : products.length === 0 ? (
            <p>Không có sản phẩm nào.</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p><b></b> {product.brand}</p>
                <p className="price"><b>Giá:</b> {Number(product.price).toLocaleString()} VND</p>
                <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                  🛒 Thêm vào giỏ
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CategoryPage;
