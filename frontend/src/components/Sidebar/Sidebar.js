import React from 'react';
import styles from './Sidebar.module.scss';

const Sidebar = ({ isOpen, onClose, children }) => {
  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <button className={styles.closeButton} onClick={onClose}>Close</button>
      {children}
    </div>
  );
}

export default Sidebar;
