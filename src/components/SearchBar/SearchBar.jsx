import { useState } from "react";
import "./SearchBar.css";
import propTypes from "prop-types";

export const SearchBar = ({ onSubmit }) => {
  const [query, setQuery] = useState("");

  const handleChange = ({ target: { value } }) => {
    setQuery(value.toLowerCase().trim());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query === "") {
      alert("Type something please");
      return;
    }

    onSubmit(query);
  };

  return (
    <header className="searchbar">
      <form className="searchForm" onSubmit={handleSubmit}>
        <button type="submit" className="searchForm-button"></button>

        <input
          className="searchForm-input"
          type="text"
          autoComplete="off"
          // autoFocus
          placeholder="Search images and photos"
          onChange={handleChange}
        />
      </form>
    </header>
  );
};

SearchBar.propTypes = {
  onSubmit: propTypes.func.isRequired,
};
