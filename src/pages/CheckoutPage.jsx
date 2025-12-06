import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CheckoutPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const provinces = [
  "Hà Nội","Hồ Chí Minh","Đà Nẵng","Hải Phòng","Cần Thơ","An Giang","Bà Rịa - Vũng Tàu",
  "Bắc Giang","Bắc Kạn","Bạc Liêu","Bắc Ninh","Bến Tre","Bình Định","Bình Dương","Bình Phước",
  "Bình Thuận","Cà Mau","Cao Bằng","Đắk Lắk","Đắk Nông","Điện Biên","Đồng Nai","Đồng Tháp",
  "Gia Lai","Hà Giang","Hà Nam","Hà Tĩnh","Hải Dương","Hậu Giang","Hòa Bình","Hưng Yên",
  "Khánh Hòa","Kiên Giang","Kon Tum","Lai Châu","Lâm Đồng","Lạng Sơn","Lào Cai","Long An",
  "Nam Định","Nghệ An","Ninh Bình","Ninh Thuận","Phú Thọ","Phú Yên","Quảng Bình","Quảng Nam",
  "Quảng Ngãi","Quảng Ninh","Quảng Trị","Sóc Trăng","Sơn La","Tây Ninh","Thái Bình","Thái Nguyên",
  "Thanh Hóa","Thừa Thiên Huế","Tiền Giang","Trà Vinh","Tuyên Quang","Vĩnh Long","Vĩnh Phúc",
  "Yên Bái"
];

function CheckoutPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", province: "", address: "", note: ""
  });
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const cartKey = user ? `cart_${user.id}` : 'cart_guest';
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCart(storedCart);
    setTotal(storedCart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();

    const fieldNames = { name: "Họ tên", email: "Email", phone: "Số điện thoại", province: "Tỉnh/Thành phố", address: "Địa chỉ" };
    const requiredFields = ["name", "email", "phone", "province", "address"];
    for (let field of requiredFields) {
      if (!form[field]?.trim()) {
        toast.error(`Vui lòng điền ${fieldNames[field]}!`, { position: "top-right", autoClose: 2500 });
        return;
      }
    }

    if (cart.length === 0) {
      toast.warning("Giỏ hàng đang trống, không thể thanh toán!", { position: "top-right", autoClose: 2500 });
      return;
    }

    const cartKey = user ? `cart_${user.id}` : 'cart_guest';
    localStorage.removeItem(cartKey);
    setCart([]);
    window.dispatchEvent(new Event("storage"));

    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      navigate('/');
    }, 2500);
  };

  return (
    <div>
      <Navbar />
      <div className="checkout-page">
        <h2>Thông tin thanh toán</h2>

        <div className="checkout-cart-summary">
          <h3>Sản phẩm trong đơn hàng</h3>
          {cart.length === 0 ? <p>Không có sản phẩm nào trong giỏ hàng.</p> : (
            <ul className="checkout-cart-list">
              {cart.map(item => (
                <li key={item._id} className="checkout-cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="checkout-cart-info">
                    <div className="checkout-cart-name">{item.name}</div>
                    <div className="checkout-cart-quantity">x{item.quantity}</div>
                  </div>
                  <div className="checkout-cart-price">{(item.price * item.quantity).toLocaleString()} VND</div>
                </li>
              ))}
            </ul>
          )}
          <div className="checkout-cart-total">
            <div>Tổng tạm tính: <b>{total.toLocaleString()} VND</b></div>
            <div className="checkout-cart-final">Thành tiền: {total.toLocaleString()} VND</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <input name="name" placeholder="Họ tên" value={form.name} onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="phone" type="tel" placeholder="Số điện thoại" value={form.phone} onChange={handleChange} />
          <select name="province" value={form.province} onChange={handleChange}>
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <input name="address" placeholder="Địa chỉ" value={form.address} onChange={handleChange} />
          <textarea name="note" placeholder="Ghi chú (tuỳ chọn)" value={form.note} onChange={handleChange} rows={3} />
          <button type="button" className="checkout-submit-btn" onClick={handleSubmit}>Đặt hàng</button>
        </form>
      </div>

      {/* Modal đặt hàng thành công */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>🎉 Đặt hàng thành công!</h3>
            <p>Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận.</p>
            <button className="close-modal" onClick={() => { setShowModal(false); navigate('/'); }}>
              Đóng
            </button>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer />
    </div>
  );
}

export default CheckoutPage;
