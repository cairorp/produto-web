import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import ListarProdutos from './pages/produtos/listarProdutos';
import ManterProdutos from './pages/produtos/manterProdutos';
import { BreadCrumb } from 'primereact/breadcrumb';

const App = () => {
  const location = useLocation();

  const breadcrumbItems = {
    '/': [{ label: 'Produtos' }],
    '/novo': [{ label: 'Produtos', url: '/' }, { label: 'Novo Produto' }],
    '/editar': [{ label: 'Produtos', url: '/' }, { label: 'Editar Produto' }]
  };

  const currentPath = Object.keys(breadcrumbItems).find(key => location.pathname.startsWith(key));

  return (
    <div className="min-h-screen">
      <header className="bg-gray-200 text-xl font-bold text-center p-3 shadow w-full">Produto Web</header>

      <div className="flex" style={{ height: 'calc(100vh - 56px)' }}>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4">
            <BreadCrumb model={breadcrumbItems[currentPath] || []} home={{ icon: 'pi pi-home', url: '/' }}/>
          </div>

          <div className="p-4">
            <Routes>
              <Route path="/" element={<ListarProdutos/>}/>
              <Route path="/novo" element={<ManterProdutos/>}/>
              <Route path="/editar/:id" element={<ManterProdutos/>}/>
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

const WrappedApp = () => (
  <Router>
    <App/>
  </Router>
);

export default WrappedApp;
