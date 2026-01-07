import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import ProtectedRoute from './core/guards/ProtectedRoute';
import Layout from './components/Layout/Layout'; // Importar el Layout
import '../src/components/Sidebar/animations.css' // Importar los estilos globales

import ProjectsPage from './pages/ProjectsPage';

const App: React.FC = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
           
            <Route
                path="/users"
                element={
                    <ProtectedRoute adminOnly={true}>
                        <Layout>
                            <UsersPage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/projects"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <ProjectsPage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/users" />} />
        </Routes>
    </BrowserRouter>
);

const TemplateApp: React.FC = () => <App />;

export default TemplateApp;
