// src/pages/search.tsx
import { useState, ChangeEvent, FormEvent } from 'react';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div>
      <h1>Search the Database</h1>
      <form onSubmit={handleSearch}>
        <label>Search by SE Practice:</label>
        <input
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          placeholder="Enter search term..."
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default Search;
