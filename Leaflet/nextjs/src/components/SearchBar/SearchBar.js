// components/SearchBar.js
import React from 'react';

const SearchBar = ({ setSearchQuery }) => {
  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search..."
      onChange={handleChange}
    />
  );
};

export default SearchBar;