import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { Navigate } from 'react-router-dom';

// pages & components
import Home from './pages/home';
import Form from './pages/form';
import Login from './pages/login';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/protectedRoute';

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={user ? <Navigate replace to="/home" /> : <Login />} />
            <Route 
              path="/form" 
              element={
                <ProtectedRoute>
                  <Form />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
