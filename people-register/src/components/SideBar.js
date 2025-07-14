import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh; 
  width: 240px; 
  background-color: ${({ theme }) => theme?.palette?.background?.paper || '#fff'};
  display: flex;
  flex-direction: column;
  z-index: 100; 
  transition: width 0.3s ease-in-out;

  @media (max-width: 768px) {
    width: ${({ sidebarOpen }) => (sidebarOpen ? '240px' : '0')}; 
    overflow: hidden;
  }
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-right: 2px solid ${({ theme }) => theme?.palette?.divider || '#e0e0e0'};
  height: 100%; 
  overflow-y: auto; 
`;

const LinkItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 16px;
  text-decoration: none;
  color: ${({ theme }) => theme?.palette?.text?.primary || '#000'};
  &:hover {
    background-color: ${({ theme }) => theme?.palette?.background?.default || '#fafafa'};
  }
`;

const MenuButton = styled.div`
  position: fixed;
  top: 16px;
  left: 16px;
  background-color: ${({ theme }) => theme?.palette?.background?.paper || '#fff'};
  border-radius: 50%;
  padding: 10px;
  display: none; 
  cursor: pointer;
  z-index: 101;

  @media (max-width: 768px) {
    display: flex; 
  }
`;


const Span = styled.div`
  padding-left: 3px;
  color: #4331d6
`;

export default function SideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <MenuButton onClick={toggleSidebar}>
        <MenuIcon fontSize={"medium"} sx={{ color: '#ff69ac' }} />
      </MenuButton>
      <SidebarContainer sidebarOpen={sidebarOpen}>
        <SidebarContent>
          <div className="header">
            <PeopleIcon fontSize="large" sx={{ color: '#ff69ac' }} />
          </div>
          <LinkItem to="/app/register">
            <DashboardIcon fontSize="medium" sx={{ color: '#422bff' }} />
            <Span>Cadastro</Span>
          </LinkItem>
          <LinkItem to="/app/reports">
            <AssessmentIcon fontSize="medium" sx={{ color: '#422bff' }} />
            <Span>Relatório</Span>
          </LinkItem>
        </SidebarContent>
      </SidebarContainer>
    </>
  );
}
