# frontend/src/App.jsx - واجهة كاملة

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // Login
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API}/auth/login`, {
        email: 'admin@clothing-erp.com',
        password: 'password123'
      });
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Fetch Dashboard
  useEffect(() => {
    if (user) {
      fetchDashboard();
      fetchProducts();
      fetchSales();
    }
  }, [user]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/dashboard/summary`);
      setDashboard(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSales = async () => {
    try {
      const response = await axios.get(`${API}/sales`);
      setSales(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const seedDatabase = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API}/seed`);
      alert('✅ Database seeded!\n' + JSON.stringify(response.data, null, 2));
      fetchDashboard();
      fetchProducts();
      fetchSales();
    } catch (error) {
      alert('❌ Seed failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Login Page
  if (!user) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h1>🏪 Clothing ERP System</h1>
          <p>Enterprise Resource Planning</p>
          
          <div style={styles.loginForm}>
            <div style={styles.inputGroup}>
              <label>البريد الإلكتروني:</label>
              <input 
                type="email" 
                value="admin@clothing-erp.com"
                disabled
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label>كلمة السر:</label>
              <input 
                type="password" 
                value="password123"
                disabled
                style={styles.input}
              />
            </div>

            <button onClick={handleLogin} style={styles.loginBtn}>
              دخول
            </button>

            <hr style={{margin: '20px 0'}} />

            <p style={{fontSize: '12px', color: '#666'}}>
              حسابات تجريبية إضافية:
            </p>
            <ul style={{fontSize: '12px', textAlign: 'left'}}>
              <li>accountant@clothing-erp.com</li>
              <li>sales@clothing-erp.com</li>
              <li>inventory@clothing-erp.com</li>
              <li>كل الحسابات: password123</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div style={styles.appContainer}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1>🏪 Clothing ERP</h1>
          <div style={styles.headerRight}>
            <span>مرحباً، {user.name || user.email}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              خروج
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={styles.nav}>
        <button 
          onClick={() => setCurrentPage('dashboard')}
          style={{...styles.navBtn, background: currentPage === 'dashboard' ? '#007bff' : '#ddd'}}
        >
          📊 لوحة التحكم
        </button>
        <button 
          onClick={() => setCurrentPage('products')}
          style={{...styles.navBtn, background: currentPage === 'products' ? '#007bff' : '#ddd'}}
        >
          📦 المنتجات
        </button>
        <button 
          onClick={() => setCurrentPage('sales')}
          style={{...styles.navBtn, background: currentPage === 'sales' ? '#007bff' : '#ddd'}}
        >
          💳 المبيعات
        </button>
        <button 
          onClick={seedDatabase}
          style={{...styles.navBtn, background: '#28a745'}}
          disabled={loading}
        >
          🌱 {loading ? 'جاري التحميل...' : 'ملء البيانات'}
        </button>
      </nav>

      {/* Content */}
      <main style={styles.main}>
        {/* Dashboard Page */}
        {currentPage === 'dashboard' && dashboard && (
          <div>
            <h2>📊 لوحة التحكم</h2>
            
            <div style={styles.cardsContainer}>
              <div style={styles.card}>
                <h3>الإيرادات</h3>
                <p style={styles.cardValue}>
                  {dashboard.totalRevenue?.toLocaleString()} ج.م
                </p>
              </div>
              <div style={styles.card}>
                <h3>المصروفات</h3>
                <p style={styles.cardValue}>
                  {dashboard.totalExpenses?.toLocaleString()} ج.م
                </p>
              </div>
              <div style={styles.card}>
                <h3>الأرباح</h3>
                <p style={styles.cardValue}>
                  {dashboard.totalProfit?.toLocaleString()} ج.م
                </p>
              </div>
              <div style={styles.card}>
                <h3>الرصيد النقدي</h3>
                <p style={styles.cardValue}>
                  {dashboard.cashBalance?.toLocaleString()} ج.م
                </p>
              </div>
              <div style={styles.card}>
                <h3>إجمالي المنتجات</h3>
                <p style={styles.cardValue}>
                  {dashboard.totalProducts}
                </p>
              </div>
              <div style={styles.card}>
                <h3>إجمالي المبيعات</h3>
                <p style={styles.cardValue}>
                  {dashboard.totalSales}
                </p>
              </div>
            </div>

            <div style={{marginTop: '20px'}}>
              <h3>📈 ملخص</h3>
              <table style={styles.table}>
                <tbody>
                  <tr>
                    <td>قيمة المخزون</td>
                    <td>{dashboard.inventoryValue?.toLocaleString()} ج.م</td>
                  </tr>
                  <tr>
                    <td>حسابات العملاء</td>
                    <td>{dashboard.accountsReceivable?.toLocaleString()} ج.م</td>
                  </tr>
                  <tr>
                    <td>حسابات الموردين</td>
                    <td>{dashboard.accountsPayable?.toLocaleString()} ج.م</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Page */}
        {currentPage === 'products' && (
          <div>
            <h2>📦 المنتجات ({products.length})</h2>
            
            {products.length === 0 ? (
              <p style={{color: '#999'}}>لا توجد منتجات. اضغط "ملء البيانات" أولاً</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th>الاسم</th>
                    <th>SKU</th>
                    <th>الفئة</th>
                    <th>السعر</th>
                    <th>الكمية</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>{product.category}</td>
                      <td>{product.price} ج.م</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Sales Page */}
        {currentPage === 'sales' && (
          <div>
            <h2>💳 المبيعات ({sales.length})</h2>
            
            {sales.length === 0 ? (
              <p style={{color: '#999'}}>لا توجد مبيعات. اضغط "ملء البيانات" أولاً</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th>رقم الفاتورة</th>
                    <th>اسم العميل</th>
                    <th>الإجمالي</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(sale => (
                    <tr key={sale._id}>
                      <td>{sale.invoiceNumber}</td>
                      <td>{sale.customerName}</td>
                      <td>{sale.total} ج.م</td>
                      <td>{sale.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>🇪🇬 نظام إدارة متاجر الملابس | جميع الحقوق محفوظة © 2024</p>
      </footer>
    </div>
  );
}

// Styles
const styles = {
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Arial, sans-serif'
  },
  loginBox: {
    background: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center'
  },
  loginForm: {
    textAlign: 'left'
  },
  inputGroup: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxSizing: 'border-box'
  },
  loginBtn: {
    width: '100%',
    padding: '12px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px'
  },
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    background: '#f5f5f5'
  },
  header: {
    background: '#333',
    color: 'white',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  headerRight: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  logoutBtn: {
    padding: '8px 15px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  nav: {
    background: '#fff',
    padding: '15px',
    display: 'flex',
    gap: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  },
  navBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    color: '#333'
  },
  main: {
    flex: 1,
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  cardValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
    margin: '10px 0 0 0'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'white',
    marginTop: '15px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  tableHeader: {
    background: '#333',
    color: 'white'
  },
  footer: {
    background: '#333',
    color: 'white',
    textAlign: 'center',
    padding: '15px',
    marginTop: 'auto'
  }
};
