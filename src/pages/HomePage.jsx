import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/HomePage.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CATEGORIES = [
  'Mực',
  'Khô bò',
  'Khô cá',
  'Di sản văn hóa',
  'Bánh',
];

function HomePage() {
  const [allProducts, setAllProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [visibleIndexes, setVisibleIndexes] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [showAllLinhKien, setShowAllLinhKien] = useState(false);
  const [addedProducts, setAddedProducts] = useState([]); // danh sách sản phẩm đã thêm
  const productSectionRef = useRef(null);
  const linhKienRef = useRef(null);

  /** ==========================
   *  MAIN BANNER CAROUSEL STATE
   *  ========================== */
  const [currentBanner, setCurrentBanner] = useState(0);

  const mainBanners = [
    {
      img: "/images/1.png",
      showroom: "",
    },
    {
      img: "https://scontent.fhan14-3.fna.fbcdn.net/v/t1.15752-9/592152515_1180468120266250_8878877527290702617_n.png?_nc_cat=111&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFklMkxYktpkLZrJRjMrfcRO2MRBFhIMsA7YxEEWEgywDY2_7v9zmpb_FYwig_iG0isH7fAVas7gyF4ZHeYTTeh&_nc_ohc=WJiB56BSYRMQ7kNvwEKHOFu&_nc_oc=Adk1PvrgSa_tWarrvq3wlNuQBU4nvc2p5LAWOE3HVw3Icckys-riYJga7bqZKKbjPyCrDx8gAX8YA1x6nxxxRuxB&_nc_zt=23&_nc_ht=scontent.fhan14-3.fna&oh=03_Q7cD4AGqKAUgl8Q0TdNYHL4DuB9Zl4E26lMBtSmMgHfta9ddVA&oe=6958B385",
      showroom: "",
    }
  ];

  const nextBanner = () => {
    setCurrentBanner(prev =>
      prev === mainBanners.length - 1 ? 0 : prev + 1
    );
  };

  const prevBanner = () => {
    setCurrentBanner(prev =>
      prev === 0 ? mainBanners.length - 1 : prev - 1
    );
  };

  /** =====================
   *  SUB BANNERS
   *  ===================== */
  const subBanners = [
    {
      img: "https://scontent.fhan14-2.fna.fbcdn.net/v/t1.15752-9/592899291_2364819500705679_5178975110955220261_n.png?_nc_cat=108&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeGFwdQG8UVadfS-qWG_w-K2I_5XoIrWUAcj_legitZQB-9cTZmHelwPvRpuaqmGwj0tyZQuY62LdxX3E9tEYGiF&_nc_ohc=Ab_gUJabkzkQ7kNvwGToNES&_nc_oc=Adlk_h5NLLev_7Kc0TvCI8Rmk_PKUHhFHfoG5JPhzIg3ZRHBw4uFySyce980AjObJZvEnPQCk2y2GkbgWUS_3xLs&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fhan14-2.fna&oh=03_Q7cD4AELYx9WQ-YoNL6KsPtVSSmQgvMFgNAzuKd6Qp366SQJVw&oe=695891B8",
      alt: ""
    },
    {
      img: "https://scontent.fhan14-4.fna.fbcdn.net/v/t1.15752-9/591576863_4154160298129559_9120359383869246759_n.png?_nc_cat=102&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeHu5Q7qpI-M6ncD0qCyHhBw8YxUmyn0cyTxjFSbKfRzJPcren261qbX_47K1hF8eqvdyZAnqI3G3NxTJzO9ltFH&_nc_ohc=UXBcIRIIlPwQ7kNvwEgINCk&_nc_oc=AdmivoeaD8pD2MHWwxnJDbu_5ENZ7THNZ9uh9OE4ewtKC4y4lsTHRBYXG7L2l5ioDe6xY02GivHMhWCz5zRPMYzw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fhan14-4.fna&oh=03_Q7cD4AHWJBCIrfLRLN_vlt5WzsGK1N7FFyUCgBIq35sa1_1ARA&oe=69589456",
      alt: ""
    },
    {
      img: "https://scontent.fhan14-5.fna.fbcdn.net/v/t1.15752-9/591700943_896237533084220_8443806725219116432_n.png?_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeF2UMTCLGOTDSWAp8jZxhmGRT1sZFuM_6JFPWxkW4z_ojGlPE8ozASAz2UUrcJDg5AlBQ_OYbYEOKbJiGGnCMrJ&_nc_ohc=XbOp8fqPjXwQ7kNvwFnvyb1&_nc_oc=AdlnIR_7yS5FNrpMd58SUQ16wPiaiEiBFNCDx8Y0f29mI5QGQCotDBPznky1Gtdce-voLh_iGC0zmchzU9bqY8ud&_nc_zt=23&_nc_ht=scontent.fhan14-5.fna&oh=03_Q7cD4AFvY_qCvKbx_toGXsNfmKXlSMoGAXEPNYsoJGQlVeSoRg&oe=695B5564",
      alt: ""
    }
  ];

  /** =====================
   *  FETCH DATA
   *  ===================== */
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products`)
      .then(res => setAllProducts(res.data))
      .catch(err => console.error(err));

    CATEGORIES.forEach(category => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/products?category=${category}`)
        .then(res => {
          setCategoryProducts(prev => ({
            ...prev,
            [category]: res.data
          }));
          setVisibleIndexes(prev => ({
            ...prev,
            [category]: 0
          }));
        })
        .catch(err => console.error(`Lỗi lấy sản phẩm ${category}:`, err));
    });
  }, []);

  /** =====================
   *  CART ADD HANDLER
   *  ===================== */
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exist = cart.find(item => item._id === product._id);
    if (exist) {
      exist.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    // Thêm trạng thái đã thêm
    setAddedProducts(prev => [...prev, product._id]);

    toast.success('✅ Đã thêm vào giỏ hàng!', {
      position: 'top-right',
      autoClose: 2500,
      theme: 'colored',
    });
  };

  /** =====================
   *  CAROUSEL BUTTONS
   *  ===================== */
  const handleNext = (category) => {
    setVisibleIndexes(prev => {
      const newIndex = prev[category] + 4;
      const maxIndex = categoryProducts[category]?.length - 4;
      return { ...prev, [category]: newIndex > maxIndex ? maxIndex : newIndex };
    });
  };

  const handlePrev = (category) => {
    setVisibleIndexes(prev => ({
      ...prev,
      [category]: Math.max(prev[category] - 4, 0)
    }));
  };

  /** =====================
   *  SHOW ALL BUTTONS
   *  ===================== */
  const toggleShowAll = () => {
    setShowAll(prev => !prev);
    setTimeout(() => {
      productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const toggleShowAllLinhKien = () => {
    setShowAllLinhKien(prev => !prev);
    setTimeout(() => {
      linhKienRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  /** =====================
   *  RENDER PRODUCT CAROUSEL
   *  ===================== */
  const renderProductCarousel = (title, products, category) => {
    if (!products || products.length === 0) return null;
    const isLinhKien = category === 'Linh kiện máy tính';

    if (isLinhKien && showAllLinhKien) {
      return (
        <div className="homepage-container" key={category} ref={linhKienRef}>
          <div className="carousel-header">
            <h2 className="homepage-title">{title}</h2>
            <button className="view-all-link" onClick={toggleShowAllLinhKien}>Thu gọn ▲</button>
          </div>

          <div className="product-list">
            {products.map(p => (
              <div key={p._id} className="product-card">

                <Link to={`/product/${p._id}`} className="product-link">
                  <div className="product-image-box">
                    <img src={p.image} alt={p.name} />
                  </div>
                  <h3 className="product-title">{p.name}</h3>
                  <p className="product-brand">{p.brand}</p>
                  <p className="price">
                    <b>Giá:</b> {Number(p.price).toLocaleString()} VND
                  </p>
                </Link>

                <button
                  className={`add-to-cart-btn ${addedProducts.includes(p._id) ? 'added' : ''}`}
                  onClick={() => !addedProducts.includes(p._id) && addToCart(p)}
                >
                  {addedProducts.includes(p._id) ? '✔ Đã thêm vào giỏ' : '🛒 Thêm vào giỏ'}
                </button>

              </div>
            ))}
          </div>
        </div>
      );
    }

    const startIndex = visibleIndexes[category] || 0;
    const visibleItems = products.slice(startIndex, startIndex + 4);

    return (
      <div className="homepage-container" key={category} ref={isLinhKien ? linhKienRef : null}>
        <div className="carousel-header">
          <h2 className="homepage-title">{title}</h2>

          {isLinhKien ? (
            <button className="view-all-link" onClick={toggleShowAllLinhKien}>Xem tất cả ›</button>
          ) : (
            <Link to={`/category/${encodeURIComponent(category)}`} className="view-all-link">Xem tất cả ›</Link>
          )}
        </div>

        {/* HORIZONTAL CAROUSEL */}
        <div className="carousel-container">
          <button className="carousel-btn" onClick={() => handlePrev(category)} disabled={startIndex === 0}>
            <FaChevronLeft />
          </button>

          <div className="carousel-products">
            {visibleItems.map(p => (
              <div key={p._id} className="product-card horizontal">
                <Link to={`/product/${p._id}`} className="product-link">
                  <div className="product-image-box">
                    <img src={p.image} alt={p.name} />
                  </div>
                  <h3>{p.name}</h3>
                  <p><b></b> {p.brand}</p>
                  <p className="price"><b>Giá:</b> {Number(p.price).toLocaleString()} VND</p>
                </Link>
                <button
                  className={`add-to-cart-btn ${addedProducts.includes(p._id) ? 'added' : ''}`}
                  onClick={() => !addedProducts.includes(p._id) && addToCart(p)}
                >
                  {addedProducts.includes(p._id) ? '✔ Đã thêm vào giỏ' : '🛒 Thêm vào giỏ'}
                </button>
              </div>
            ))}
          </div>

          <button className="carousel-btn" onClick={() => handleNext(category)} disabled={startIndex + 4 >= products.length}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    );
  };

  /** ============================
   *  RENDER PAGE
   *  ============================ */
  return (
    <div>
      <Navbar />
      <ToastContainer />

      {/* =====================
          MAIN BANNER
      ====================== */}
      <div className="banner-carousel">
        <div className="banner-slide">
          <img src={mainBanners[currentBanner].img} alt="Banner" />
        </div>

        <button className="banner-btn banner-btn-left" onClick={prevBanner}>
          <FaChevronLeft />
        </button>

        <button className="banner-btn banner-btn-right" onClick={nextBanner}>
          <FaChevronRight />
        </button>
      </div>

      {/* =====================
          SUB BANNERS
      ====================== */}
      <div className="sub-banners">
        {subBanners.map((b, idx) => (
          <div key={idx} className="sub-banner-item">
            <img src={b.img} alt={b.alt} />
          </div>
        ))}
      </div>

      {/* =====================
          SẢN PHẨM TỔNG HỢP
      ====================== */}
      <div className="homepage-container" ref={productSectionRef}>
        <div className="homepage-header">
          <h1 className="homepage-title">Mặt hàng nổi bật</h1>
          <button className="toggle-view-btn" onClick={toggleShowAll}>
            {showAll ? 'Thu gọn ▲' : 'Xem tất cả ▼'}
          </button>
        </div>

        <div className="product-list">
          {(showAll ? allProducts : allProducts.slice(0, 10)).map(p => (
            <div key={p._id} className="product-card">
              <Link to={`/product/${p._id}`} className="product-link">
                <div className="product-image-box">
                  <img src={p.image} alt={p.name} />
                </div>
                <h3>{p.name}</h3>
                <p><b></b> {p.brand}</p>
                <p className="price"><b>Giá:</b> {Number(p.price).toLocaleString()} VND</p>
              </Link>
              <button
                className={`add-to-cart-btn ${addedProducts.includes(p._id) ? 'added' : ''}`}
                onClick={() => !addedProducts.includes(p._id) && addToCart(p)}
              >
                {addedProducts.includes(p._id) ? '✔ Đã thêm vào giỏ' : '🛒 Thêm vào giỏ'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* =====================
          CAROUSEL THEO DANH MỤC
      ====================== */}
      {CATEGORIES.map(category =>
        renderProductCarousel(category, categoryProducts[category], category)
      )}

      <Footer />
    </div>
  );
}

export default HomePage;
