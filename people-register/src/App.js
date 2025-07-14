
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import styled from 'styled-components';
import RegisterForm from './pages/RegisterForm';
import SideBar from './components/SideBar';
import PeopleTable from './pages/PeopleTable';

const MainContent = styled.div`
  margin-left: 240px;
  padding: 16px; 
  transition: margin-left 0.3s ease-in-out;

  @media (max-width: 768px) {
    margin-left: 0; 
  }
`;

function App() {
  return (
    <Router>
      <SideBar />
      <MainContent>
        <Routes>
          <Route path="/" element={<Navigate to="/app/register" />} />
          <Route path="/app/register" element={<RegisterForm />} />
          <Route path="/app/reports" element={<PeopleTable />} />
        </Routes>
      </MainContent>
    </Router>
  );
}

export default App;
