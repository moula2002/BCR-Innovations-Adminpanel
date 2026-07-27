import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Categories from './pages/Categories';
import CategoryForm from './pages/CategoryForm';
import Inquiries from './pages/Inquiries';
import Logos from './pages/Logos';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Subcategories from './pages/Subcategories';
import SubcategoryForm from './pages/SubcategoryForm';
import Careers from './pages/Careers';
import CareerForm from './pages/CareerForm';

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);

  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Login setToken={setToken} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products token={token} />} />
          <Route path="products/new" element={<ProductForm token={token} />} />
          <Route path="products/edit/*" element={<ProductForm token={token} />} />
          <Route path="categories" element={<Categories token={token} />} />
          <Route path="categories/new" element={<CategoryForm token={token} />} />
          <Route path="categories/edit/*" element={<CategoryForm token={token} />} />
          <Route path="subcategories" element={<Subcategories token={token} />} />
          <Route path="subcategories/new" element={<SubcategoryForm token={token} />} />
          <Route path="subcategories/edit/*" element={<SubcategoryForm token={token} />} />
          <Route path="careers" element={<Careers token={token} />} />
          <Route path="careers/new" element={<CareerForm token={token} />} />
          <Route path="careers/edit/*" element={<CareerForm token={token} />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="logos" element={<Logos />} />
          <Route path="contact" element={<Contact />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
