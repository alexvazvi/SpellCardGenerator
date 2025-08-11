import React from 'react';
import './PageContainer.css';

interface PageContainerProps {
  children: React.ReactNode;
  darkMode?: boolean; // Make darkMode optional
}

const PageContainer: React.FC<PageContainerProps> = ({ children, darkMode }) => {
  return (
    <div className={`page-container-wrapper ${darkMode ? 'dark-mode' : ''}`}>
      {children}
    </div>
  );
};

export default PageContainer;
