import React from 'react';
import Layout from '../components/Layout';

const AdminPanelSimple = () => {
    return (
        <Layout>
            <div style={{ padding: '2rem' }}>
                <h1>🛠️ Panel de Administración</h1>
                <p>Página de prueba simple</p>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                    <p>Si ves este mensaje, el Layout funciona correctamente.</p>
                </div>
            </div>
        </Layout>
    );
};

export default AdminPanelSimple;
