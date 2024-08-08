import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProblemPage from './pages/ProblemPage';
import AddProblemPage from './pages/AddProblemPage';

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-4">
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/problems/:id" element={<ProblemPage />} />
          <Route path="/add-problem" element={<AddProblemPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
