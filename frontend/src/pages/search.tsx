import { useState, useEffect } from 'react';

const Search = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedQueries, setSavedQueries] = useState<string[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`);
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    // Retrieve saved search queries from localStorage when the component mounts
    const storedQueries = localStorage.getItem('savedQueries');
    if (storedQueries) {
      setSavedQueries(JSON.parse(storedQueries));
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveSearch = () => {
    if (searchTerm && !savedQueries.includes(searchTerm)) {
      const updatedQueries = [...savedQueries, searchTerm];
      setSavedQueries(updatedQueries);
      // Save the updated queries to localStorage
      localStorage.setItem('savedQueries', JSON.stringify(updatedQueries));
    }
  };

  const handleClearQueries = () => {
    setSavedQueries([]);
    localStorage.removeItem('savedQueries');
  };

  const handleQueryClick = (query: string) => {
    setSearchTerm(query); // Set the search term to the clicked query
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Search Database</h1>
      <input
        type="text"
        placeholder="Search by title or author"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button onClick={handleSaveSearch}>Save Search</button>

      {filteredArticles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Description</th>
              <th>Published Date</th>
              <th>Publisher</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td>{article.author}</td>
                <td>{article.isbn}</td>
                <td>{article.description}</td>
                <td>{new Date(article.published_date).toLocaleDateString("en-US")}</td>
                <td>{article.publisher}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Saved Search Queries</h2>
      {savedQueries.length === 0 ? (
        <p>No saved queries.</p>
      ) : (
        <ul>
          {savedQueries.map((query, index) => (
            <li
              key={index}
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() => handleQueryClick(query)}
            >
              {query}
            </li>
          ))}
        </ul>
      )}

      <button onClick={handleClearQueries}>Clear Saved Queries</button>
    </div>
  );
};

export default Search;
