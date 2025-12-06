import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../css/AdminPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    stock: 15,
    description: '',
    image: ''
  });

  const navigate = useNavigate();

  // ✅ Kiểm tra role người dùng
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (!userInfo || userInfo.role !== 'admin') {
      toast.error('❌ Bạn không có quyền truy cập trang này!');
      navigate('/login');
    }
  }, [navigate]);

  // ✅ Lấy danh sách sản phẩm
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Lỗi khi tải sản phẩm:', err));
  }, []);

  // ✅ Lắng nghe socket.io cho đơn hàng mới
  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_API_URL}`);

    socket.on('connect', () => {
      console.log('🟢 Admin connected socket:', socket.id);
    });

    socket.on('new-order', (order) => {
      toast.info(
        <div>
          <p>📦 Đơn hàng mới từ <strong>{order.user?.name || 'người dùng'}</strong></p>
          <button
            onClick={() => navigate('/admin/orders')}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '5px'
            }}
          >
            Xem đơn hàng
          </button>
        </div>,
        {
          autoClose: false,
          closeOnClick: false,
          draggable: true,
        }
      );
    });

    return () => socket.disconnect();
  }, [navigate]);

  // ✅ Các hàm xử lý CRUD sản phẩm
  const handleInputChange = (id, field, value) => {
    setProducts(products =>
      products.map(p => (p._id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleUpdate = (product) => {
    axios.put(`${process.env.REACT_APP_API_URL}/products/${product._id}`, product)
      .then(res => {
        setProducts(products.map(p => (p._id === product._id ? res.data : p)));
        toast.success('✅ Cập nhật thành công!');
      })
      .catch(err => {
        console.error(err);
        toast.error('❌ Cập nhật thất bại!');
      });
  };

  const handleDelete = (id) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`)
      .then(() => {
        setProducts(products.filter(p => p._id !== id));
        toast.success('🗑️ Xóa thành công!');
      })
      .catch(err => {
        console.error(err);
        toast.error('❌ Xóa thất bại!');
      });
  };

  const handleAdd = () => {
    const { name, brand, category, price, image } = newProduct;

    if (!name || !brand || !category || !price || !image) {
      setErrorMessage('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/products`, newProduct)
      .then(res => {
        setProducts([...products, res.data]);
        setNewProduct({
          name: '',
          brand: '',
          category: '',
          price: '',
          stock: 15,
          description: '',
          image: ''
        });
        setErrorMessage('');
        toast.success('🎉 Thêm sản phẩm thành công!');
      })
      .catch(err => {
        console.error(err);
        setErrorMessage('Có lỗi xảy ra khi thêm sản phẩm.');
      });
  };

  return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          className="admin-btn"
          onClick={() => navigate('/admin/users')}
          style={{ marginBottom: '20px', backgroundColor: '#28a745', color: 'white' }}
        >
          Quản lý người dùng
        </button>
      </div>

      <div className="admin-container">
        <h2 className="admin-title">Quản lý sản phẩm</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Hãng</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Mô tả</th>
              <th>Ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td><input className="admin-input" value={p.name} onChange={e => handleInputChange(p._id, 'name', e.target.value)} /></td>
                <td><input className="admin-input" value={p.brand} onChange={e => handleInputChange(p._id, 'brand', e.target.value)} /></td>
                <td><input className="admin-input" value={p.category} onChange={e => handleInputChange(p._id, 'category', e.target.value)} /></td>
                <td><input className="admin-input" type="number" value={p.price} onChange={e => handleInputChange(p._id, 'price', e.target.value)} /></td>
                <td><input className="admin-input" type="number" value={p.stock} onChange={e => handleInputChange(p._id, 'stock', e.target.value)} /></td>
                <td><input className="admin-input" value={p.description} onChange={e => handleInputChange(p._id, 'description', e.target.value)} /></td>
                <td>
                  <input className="admin-input" value={p.image} onChange={e => handleInputChange(p._id, 'image', e.target.value)} />
                  {p.image && <img src={p.image} alt={p.name} className="admin-thumb" />}
                </td>
                <td>
                  <button className="admin-btn delete" onClick={() => handleDelete(p._id)}>Xóa</button>
                  <button className="admin-btn update" onClick={() => handleUpdate(p)}>Cập nhật</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="admin-subtitle">Thêm sản phẩm mới</h3>
        <div className="admin-add-form">
          <input className="admin-input" placeholder="Tên sản phẩm *" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
          <input className="admin-input" placeholder="Hãng *" value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} />
          <input className="admin-input" placeholder="Danh mục *" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
          <input className="admin-input" type="number" placeholder="Giá *" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
          <input className="admin-input" type="number" placeholder="Tồn kho" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
          <input className="admin-input" placeholder="Mô tả" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
          <input className="admin-input" placeholder="Link ảnh *" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />

          <button className="admin-btn add" onClick={handleAdd}>Thêm</button>
          {errorMessage && <p className="admin-error">{errorMessage}</p>}
        </div>
      </div>
      <ToastContainer position="top-right" />
      <Footer />
    </>
  );
}

export default AdminPage;
