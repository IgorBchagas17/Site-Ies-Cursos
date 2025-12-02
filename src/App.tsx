import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner"; 

import Home from "./pages/Home";
import AllCourses from "./pages/AllCourses";
import Moments from './pages/Moments'; // Novo


import { ScrollToTop } from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute"; 

// 🟧 ADMIN
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminLeads from "./pages/admin/AdminLeads"; 
import AdminAudit from "./pages/admin/AdminAudit";
import AdminMoments from './pages/admin/AdminMoments'; // Novo

export default function App() {
  return (
    <>
      <Routes>
        {/* === ROTAS PÚBLICAS === */}
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<AllCourses />} />
        <Route path="/momentos" element={<Moments />} /> {/* ROTA PÚBLICA ADICIONADA */}

        {/* Rota de Login do Admin */}
        <Route path="/ies-admin/login" element={<AdminLogin />} />

        {/* === ROTAS PROTEGIDAS DO ADMIN (/ies-admin/*) === */}
        <Route path="/ies-admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              {/* index: /ies-admin */}
              <Route index element={<AdminDashboard />} /> 
              {/* /ies-admin/cursos */}
              <Route path="cursos" element={<AdminCourses />} /> 
              {/* /ies-admin/leads */}
              <Route path="leads" element={<AdminLeads />} /> 
              {/* /ies-admin/auditoria */}
              <Route path="auditoria" element={<AdminAudit />} />
              {/* /ies-admin/moments (CORRIGIDO: O caminho deve ser relativo) */}
              <Route path="moments" element={<AdminMoments />} /> 
            </Route>
        </Route>
      </Routes>

      <ScrollToTop />
      
      {/* TOASTER CORRIGIDO */}
      <Toaster 
        position="top-right" 
        richColors 
        expand={true} 
        closeButton={false} 
        toastOptions={{
             className: 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xl',
             duration: 3000,
        }}
      />
    </>
  );
}