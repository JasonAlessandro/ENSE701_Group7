// src/pages/search.tsx
import { useState, ChangeEvent, FormEvent } from 'react';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Add API call logic here to fetch search results
  };

  return (
    <div>
      <h1>Search the Database</h1>
      <form onSubmit={handleSearch}>
        <label>Search by SE Practice:</label>
        <input
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {/* Display search results here */}
    </div>
  );
};

export default Search;
