// components/SearchBar.js
import React from 'react';
import styles from './SearchBar.module.scss';

const SearchBar = ({ setSearchQuery }) => {
  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <input
      className={styles.search}
      type="text"
      placeholder="Search..."
      onChange={handleChange}
    />
  );
};

export default SearchBar;