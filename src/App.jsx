import { useState, useEffect } from 'react';
import durianHero from './assets/durian_ri6.png';
import './App.css';

// Mock initial bookings data if localStorage is empty
const INITIAL_BOOKINGS = [
  {
    id: 'B001',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    quantity: 5,
    unit: 'kg',
    deliveryDate: '2026-08-01',
    deliveryTime: '09:00',
    address: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TPHCM',
    note: 'Chọn quả chín thơm ăn ngay trong ngày giúp mình nhé.',
    status: 'pending', // pending, confirmed, delivered, cancelled
    totalPrice: 750000,
    createdAt: '2026-07-29T08:00:00Z'
  },
  {
    id: 'B002',
    name: 'Trần Thị B',
    phone: '0987654321',
    quantity: 2,
    unit: 'quả',
    deliveryDate: '2026-08-02',
    deliveryTime: '15:30',
    address: '456 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TPHCM',
    note: 'Giao quả chín gối đầu để ăn dần vào ngày hôm sau.',
    status: 'confirmed',
    totalPrice: 900000, // 2 quả * 3kg/quả * 150000 đ/kg = 900000 đ
    createdAt: '2026-07-29T10:15:00Z'
  },
  {
    id: 'B003',
    name: 'Lê Hoàng C',
    phone: '0911223344',
    quantity: 10,
    unit: 'kg',
    deliveryDate: '2026-07-29',
    deliveryTime: '10:00',
    address: '789 Đường Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TPHCM',
    note: 'Đơn vị mua làm quà tặng đối tác, cần bọc lưới đẹp.',
    status: 'delivered',
    totalPrice: 1500000,
    createdAt: '2026-07-28T09:30:00Z'
  }
];

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');

  // Business Config (Price and fruit parameters)
  const [pricePerKg, setPricePerKg] = useState(() => {
    const saved = localStorage.getItem('durian_price_per_kg');
    return saved ? parseInt(saved, 10) : 150000;
  });
  
  const [avgWeightPerFruit, setAvgWeightPerFruit] = useState(() => {
    const saved = localStorage.getItem('durian_avg_weight_per_fruit');
    return saved ? parseFloat(saved) : 3;
  });

  // Bookings State
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('durian_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    quantity: 1,
    unit: 'kg',
    deliveryDate: '',
    deliveryTime: '09:00',
    address: '',
    note: ''
  });

  // Form Alert Status
  const [alert, setAlert] = useState(null);

  // Admin Dashboard State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('durian_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('durian_price_per_kg', pricePerKg.toString());
  }, [pricePerKg]);

  useEffect(() => {
    localStorage.setItem('durian_avg_weight_per_fruit', avgWeightPerFruit.toString());
  }, [avgWeightPerFruit]);

  // Helper function to format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  // Helper to calculate total price for a booking
  const calculateBookingPrice = (qty, unit) => {
    const parsedQty = parseFloat(qty) || 0;
    if (unit === 'kg') {
      return parsedQty * pricePerKg;
    } else {
      return parsedQty * avgWeightPerFruit * pricePerKg;
    }
  };

  // Handle Form Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Booking Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.deliveryDate || !formData.address.trim()) {
      setAlert({ type: 'error', message: 'Vui lòng điền đầy đủ các trường thông tin bắt buộc.' });
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      setAlert({ type: 'error', message: 'Số điện thoại không hợp lệ. Vui lòng nhập từ 10 - 11 chữ số.' });
      return;
    }

    if (parseFloat(formData.quantity) <= 0) {
      setAlert({ type: 'error', message: 'Số lượng đặt phải lớn hơn 0.' });
      return;
    }

    // Create new booking object
    const newBooking = {
      id: 'B' + (bookings.length + 1).toString().padStart(3, '0') + Math.floor(Math.random() * 10),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      deliveryDate: formData.deliveryDate,
      deliveryTime: formData.deliveryTime,
      address: formData.address.trim(),
      note: formData.note.trim(),
      status: 'pending',
      totalPrice: calculateBookingPrice(formData.quantity, formData.unit),
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    setAlert({ type: 'success', message: `Đặt hàng thành công! Mã đặt chỗ của bạn là: ${newBooking.id}. Admin sẽ liên hệ lại xác nhận sớm nhất.` });
    
    // Reset Form
    setFormData({
      name: '',
      phone: '',
      quantity: 1,
      unit: 'kg',
      deliveryDate: '',
      deliveryTime: '09:00',
      address: '',
      note: ''
    });

    // Auto scroll to alert
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Admin Actions
  const updateBookingStatus = (id, newStatus) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === id) {
        return { ...booking, status: newStatus };
      }
      return booking;
    }));
  };

  const deleteBooking = (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${id}?`)) {
      setBookings(prev => prev.filter(booking => booking.id !== id));
    }
  };

  // Admin Dashboard Calculations
  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  
  const totalOrders = bookings.length;
  
  const totalWeightKg = bookings.reduce((sum, b) => {
    if (b.status === 'cancelled') return sum;
    const qty = parseFloat(b.quantity) || 0;
    const itemWeight = b.unit === 'kg' ? qty : qty * avgWeightPerFruit;
    return sum + itemWeight;
  }, 0);

  const totalEstimatedRevenue = bookings.reduce((sum, b) => {
    if (b.status === 'cancelled') return sum;
    return sum + (b.totalPrice || 0);
  }, 0);

  // Filters application
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.phone.includes(searchQuery) ||
                          b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate current dynamic price
  const currentTempPrice = calculateBookingPrice(formData.quantity, formData.unit);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="app">
      {/* Header / Navbar */}
      <header className="header glassmorphism">
        <nav className="navbar">
          <a href="#home" className="logo" onClick={() => setActiveTab('home')}>
            <span className="logo-icon">🥑</span>
            <span>Ri6<span className="logo-highlight">Durian</span></span>
          </a>
          <ul className="nav-links">
            <li>
              <button 
                className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => { setActiveTab('home'); setAlert(null); }}
              >
                Trang chủ
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => { setActiveTab('info'); setAlert(null); }}
              >
                Đặc sản Ri6
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'booking' ? 'active' : ''}`}
                onClick={() => { setActiveTab('booking'); setAlert(null); }}
              >
                Đặt hàng ngay
              </button>
            </li>
            <li>
              <button 
                className="btn-admin"
                onClick={() => { setActiveTab('admin'); setAlert(null); }}
              >
                ⚙️ Admin Panel
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Area */}
      <main className="main-content">
        
        {/* TAB 1: HOME (Landing Page) */}
        {activeTab === 'home' && (
          <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="hero">
              <div className="hero-container">
                <div className="hero-text-content">
                  <span className="hero-badge">⭐ Sầu riêng chín cây thượng hạng</span>
                  <h1 className="hero-title">Sầu Riêng Ri6<br />Cơm Vàng Hạt Lép</h1>
                  <p className="hero-description">
                    Đặc sản miền Tây nổi tiếng với cơm sầu khô ráo, sắc vàng óng ả bắt mắt, vị béo đậm đà khó cưỡng kết hợp với hạt lép cực kỳ chất lượng. Chúng tôi cam kết hái già chín tự nhiên, bao ăn 1 đổi 1!
                  </p>
                  <div className="hero-actions">
                    <button className="btn-primary" onClick={() => setActiveTab('booking')}>
                      Đặt hàng trước ngay
                    </button>
                    <button className="btn-secondary" onClick={() => setActiveTab('info')}>
                      Tìm hiểu thêm
                    </button>
                  </div>
                </div>
                <div className="hero-image-wrapper float-animation">
                  <div className="hero-image-bg"></div>
                  <img src={durianHero} alt="Sầu riêng Ri6" className="hero-image" />
                </div>
              </div>
            </section>

            {/* Quick Benefits Section */}
            <section className="info-section">
              <div className="section-container">
                <div className="section-header">
                  <span className="section-subtitle">Cam kết chất lượng</span>
                  <h2 className="section-title">Tại sao nên đặt trước sầu riêng Ri6 tại đây?</h2>
                </div>
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon-wrapper">👑</div>
                    <h3 className="feature-title">Chuẩn Giống Ri6 100%</h3>
                    <p className="feature-description">Được canh tác tự nhiên tại nhà vườn lâu năm ở Vĩnh Long, giữ trọn hương vị nguyên bản, cơm dẻo và cực kì thơm.</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon-wrapper">🍃</div>
                    <h3 className="feature-title">Hái Già Chín Tự Nhiên</h3>
                    <p className="feature-description">Không sử dụng thuốc nhúng ép chín. Sầu riêng được tuyển chọn kỹ lưỡng, hái khi đạt độ già chuẩn để tự chín tự nhiên.</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon-wrapper">🛡️</div>
                    <h3 className="feature-title">Chính Sách Bao Ăn 1 Đổi 1</h3>
                    <p className="feature-description">Nếu múi bị sượng, nhạt hay hỏng do lỗi kỹ thuật hái, chúng tôi sẵn sàng bù hoặc đổi trả quả mới hoàn toàn miễn phí.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: PRODUCT INFO (Đặc sản Ri6) */}
        {activeTab === 'info' && (
          <div className="info-section animate-fade-in">
            <div className="section-container" style={{ maxWidth: '800px' }}>
              <div className="section-header">
                <span className="section-subtitle">Tìm hiểu giống sầu</span>
                <h2 className="section-title">Câu Chuyện Về Giống Sầu Riêng Ri6</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', fontSize: '1.05rem', color: '#374151' }}>
                <p>
                  Sầu riêng Ri6 được đặt tên theo người cha đẻ sáng lập giống sầu này - <strong>ông Sáu Ri</strong> (tên thật là Nguyễn Minh Châu, ngụ tại Vĩnh Long). Vào những năm 1990, ông đã lai tạo thành công giống sầu riêng cơm vàng hạt lép đạt tiêu chuẩn vàng của thị trường.
                </p>
                
                <h3 style={{ color: 'var(--color-primary-dark)', fontSize: '1.5rem', marginTop: '20px' }}>Đặc Điểm Nhận Biết Ri6 Độc Quyền</h3>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li><strong>Hình dáng:</strong> Quả có hình thoi, gai nhỏ, khít và rất đều. Màu vỏ xanh tươi hơi ngả sang vàng khi chín.</li>
                  <li><strong>Cơm sầu:</strong> Sắc vàng ruộm như mật ong, múi khô ráo không dính tay, cơm dày bám chặt vào hạt lép.</li>
                  <li><strong>Hương vị:</strong> Độ béo ngậy cao kết hợp với vị ngọt đậm đà, hương thơm nồng nàn đặc trưng lan tỏa mạnh mẽ ngay khi gỡ vỏ.</li>
                </ul>

                <div className="glassmorphism" style={{ padding: '30px', borderRadius: 'var(--radius-md)', marginTop: '20px', borderLeft: '5px solid var(--color-accent)' }}>
                  <h4 style={{ color: 'var(--color-primary-dark)', fontWeight: '700', marginBottom: '10px' }}>🏷️ Giá bán áp dụng hôm nay:</h4>
                  <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                    {formatCurrency(pricePerKg)} / kg
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                    * Giá có thể điều chỉnh linh hoạt theo mùa vụ và lượng hàng thực tế được cập nhật trực tiếp bởi Admin.
                  </p>
                </div>

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <button className="btn-primary" onClick={() => setActiveTab('booking')}>
                    Đặt sầu riêng Ri6 chuẩn vị ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BOOKING FORM (Đặt hàng) */}
        {activeTab === 'booking' && (
          <div className="booking-section animate-fade-in">
            <div className="booking-grid">
              
              <div className="booking-info">
                <span className="section-subtitle">Chương trình đặt trước</span>
                <h3>Đặt Trước Để Đảm Bảo Luôn Có Sầu Riêng Ngon!</h3>
                <p>
                  Chúng tôi chỉ thu hoạch một lượng sầu riêng chín cây giới hạn mỗi ngày từ vườn để đảm bảo chất lượng ngon ngọt chuẩn nhất. Việc đặt trước giúp bạn được xếp lịch ưu tiên nhận sầu riêng ngon chín đúng độ mong muốn.
                </p>
                <ul className="booking-benefit-list">
                  <li className="booking-benefit-item">
                    <span className="benefit-icon">✓</span>
                    <span>Xác nhận đơn hàng qua điện thoại trong vòng 15 phút.</span>
                  </li>
                  <li className="booking-benefit-item">
                    <span className="benefit-icon">✓</span>
                    <span>Nhận sầu riêng chín tự nhiên, quả đẹp thích hợp biếu tặng.</span>
                  </li>
                  <li className="booking-benefit-item">
                    <span className="benefit-icon">✓</span>
                    <span>Không yêu cầu đặt cọc trước (Thanh toán COD khi nhận hàng).</span>
                  </li>
                </ul>
                <div style={{ marginTop: '30px', padding: '20px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Giá hôm nay</span>
                  <h4 style={{ fontSize: '1.5rem', color: 'var(--color-primary-dark)', fontWeight: '800' }}>
                    {formatCurrency(pricePerKg)}/kg
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    * Trọng lượng trung bình khoảng {avgWeightPerFruit} kg/quả.
                  </p>
                </div>
              </div>

              <div>
                {/* Alert Notification */}
                {alert && (
                  <div className={`alert-success`} style={{ 
                    backgroundColor: alert.type === 'success' ? '#d1fae5' : '#fee2e2', 
                    borderColor: alert.type === 'success' ? '#34d399' : '#f87171',
                    color: alert.type === 'success' ? '#065f46' : '#991b1b'
                  }}>
                    {alert.type === 'success' ? '✅' : '❌'} {alert.message}
                  </div>
                )}

                <div className="booking-card glassmorphism">
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--color-primary-dark)', textAlign: 'center' }}>
                    Thông Tin Đăng Ký Đặt Chỗ
                  </h3>
                  <form onSubmit={handleFormSubmit}>
                    <div className="form-grid">
                      <div>
                        <label className="form-label">Họ và Tên *</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          placeholder="Ví dụ: Nguyễn Văn A" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="form-label">Số điện thoại *</label>
                        <input 
                          type="tel" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          placeholder="Số điện thoại liên hệ" 
                          required 
                        />
                      </div>
                      
                      <div className="form-group-full">
                        <label className="form-label">Số lượng muốn mua *</label>
                        <div className="quantity-container">
                          <input 
                            type="number" 
                            name="quantity" 
                            min="1" 
                            step="any"
                            value={formData.quantity} 
                            onChange={handleInputChange} 
                            className="quantity-input" 
                            required 
                          />
                          <select 
                            name="unit" 
                            value={formData.unit} 
                            onChange={handleInputChange}
                            className="quantity-unit"
                          >
                            <option value="kg">kg</option>
                            <option value="quả">quả (~{avgWeightPerFruit}kg)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="form-label">Ngày nhận hàng *</label>
                        <input 
                          type="date" 
                          name="deliveryDate" 
                          value={formData.deliveryDate} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="form-label">Giờ nhận hàng (ước tính)</label>
                        <input 
                          type="time" 
                          name="deliveryTime" 
                          value={formData.deliveryTime} 
                          onChange={handleInputChange} 
                        />
                      </div>

                      <div className="form-group-full">
                        <label className="form-label">Địa chỉ giao hàng (hoặc ghi Nhận tại Cửa hàng) *</label>
                        <textarea 
                          name="address" 
                          rows="2" 
                          value={formData.address} 
                          onChange={handleInputChange} 
                          placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..." 
                          required 
                        ></textarea>
                      </div>

                      <div className="form-group-full">
                        <label className="form-label">Ghi chú yêu cầu thêm</label>
                        <textarea 
                          name="note" 
                          rows="2" 
                          value={formData.note} 
                          onChange={handleInputChange} 
                          placeholder="Yêu cầu chín ăn ngay, bọc quà tặng, hoặc lời dặn khác..." 
                        ></textarea>
                      </div>
                    </div>

                    {/* Booking Price estimation */}
                    <div className="booking-summary">
                      <div className="summary-row">
                        <span>Đơn giá hôm nay:</span>
                        <span>{formatCurrency(pricePerKg)} / kg</span>
                      </div>
                      <div className="summary-row">
                        <span>Định lượng đặt:</span>
                        <span>{formData.quantity} {formData.unit}</span>
                      </div>
                      <div className="summary-row-total">
                        <span>Tổng tiền tạm tính:</span>
                        <span>{formatCurrency(currentTempPrice)}</span>
                      </div>
                    </div>

                    <button type="submit" className="btn-submit">
                      Gửi Đặt Chỗ Sầu Riêng
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <div className="admin-section animate-fade-in">
            <div className="admin-container">
              
              {/* Header admin */}
              <div className="admin-header">
                <div className="admin-title-group">
                  <span style={{ fontSize: '2.5rem' }}>⚙️</span>
                  <div>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)' }}>Quản Trị Booking Sầu Riêng</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Hệ thống quản lý đặt chỗ và cấu hình sản phẩm</p>
                  </div>
                </div>
                <button className="btn-exit" onClick={() => setActiveTab('home')}>
                  Thoát Admin
                </button>
              </div>

              {/* Configuration panel (Change prices) */}
              <div className="config-panel">
                <h3 className="config-panel-title">✏️ Cấu hình Bán Hàng & Giá Sầu Riêng</h3>
                <div className="config-grid">
                  <div>
                    <label className="form-label">Giá sầu riêng hôm nay (VND/KG)</label>
                    <input 
                      type="number" 
                      value={pricePerKg} 
                      onChange={(e) => setPricePerKg(Math.max(0, parseInt(e.target.value, 10) || 0))} 
                    />
                  </div>
                  <div>
                    <label className="form-label">Trọng lượng trung bình / quả (KG)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={avgWeightPerFruit} 
                      onChange={(e) => setAvgWeightPerFruit(Math.max(0.1, parseFloat(e.target.value) || 3))} 
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                      * Giá bán và trọng lượng quả cập nhật ở đây sẽ thay đổi ngay lập tức trên Form đặt hàng của Khách hàng.
                    </p>
                  </div>
                </div>
              </div>

              {/* Analytics widgets */}
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Tổng số đơn hàng (Booking)</div>
                  <div className="metric-value">{totalOrders}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Tổng khối lượng ước tính</div>
                  <div className="metric-value">{totalWeightKg.toFixed(1)} kg</div>
                </div>
                <div className="metric-card accent">
                  <div className="metric-label">Doanh thu dự kiến</div>
                  <div className="metric-value">{formatCurrency(totalEstimatedRevenue)}</div>
                </div>
              </div>

              {/* Filtering Controls */}
              <div className="admin-control-bar">
                <div className="search-input-wrapper">
                  <span className="search-icon">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm theo Tên khách, SĐT hoặc Mã đơn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="delivered">Đã giao hàng</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              {/* Booking List Table */}
              <div className="table-container">
                {filteredBookings.length > 0 ? (
                  <table className="bookings-table">
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Thông tin liên hệ</th>
                        <th>Số lượng đặt</th>
                        <th>Ước tính giá</th>
                        <th>Ngày/Giờ nhận</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td><strong>{booking.id}</strong></td>
                          <td>
                            <div style={{ fontWeight: '600' }}>{booking.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#6b7280', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={booking.address}>
                              📍 {booking.address}
                            </div>
                          </td>
                          <td>
                            <div>📞 {booking.phone}</div>
                          </td>
                          <td>
                            <span style={{ fontWeight: '500' }}>{booking.quantity} {booking.unit}</span>
                          </td>
                          <td style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                            {formatCurrency(booking.totalPrice)}
                          </td>
                          <td>
                            <div>📅 {booking.deliveryDate}</div>
                            {booking.deliveryTime && <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>🕒 {booking.deliveryTime}</div>}
                          </td>
                          <td>
                            <span className={`badge badge-${booking.status}`}>
                              {getStatusLabel(booking.status)}
                            </span>
                            {booking.note && (
                              <div style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic', marginTop: '4px', maxWidth: '200px' }} title={booking.note}>
                                Chú thích: "{booking.note}"
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="actions-cell">
                              {/* Confirm action */}
                              {booking.status === 'pending' && (
                                <button 
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')} 
                                  className="btn-icon confirm"
                                  title="Xác nhận booking"
                                >
                                  ✓
                                </button>
                              )}
                              
                              {/* Deliver action */}
                              {booking.status === 'confirmed' && (
                                <button 
                                  onClick={() => updateBookingStatus(booking.id, 'delivered')} 
                                  className="btn-icon deliver"
                                  title="Đã giao sầu riêng"
                                >
                                  🚚
                                </button>
                              )}

                              {/* Cancel action */}
                              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                <button 
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')} 
                                  className="btn-icon cancel"
                                  title="Hủy đặt đơn"
                                >
                                  ✕
                                </button>
                              )}

                              {/* Delete action */}
                              <button 
                                onClick={() => deleteBooking(booking.id)} 
                                className="btn-icon delete"
                                title="Xóa vĩnh viễn"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>Không tìm thấy booking nào phù hợp với điều kiện tìm kiếm.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span>🥑</span>
            <span>Ri6<span className="highlight">Durian</span></span>
          </div>
          <p className="footer-text">
            © 2026 Website Sầu Riêng Ri6 Độc Quyền - Hệ thống Đặt Trước Sầu Riêng Chín Cây.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
