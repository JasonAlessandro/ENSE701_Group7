import Link from "next/link";
import { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";

interface Article {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  published_date: string;
  publisher: string;
}

interface HomeProps {
  articles: Article[];
}

const Home: FC<HomeProps> = ({ articles: initialArticles }) => {
  const [articles, setArticles] = useState(initialArticles);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(initialArticles);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [savedQueries, setSavedQueries] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Article | null>(null);
  const [isAscending, setIsAscending] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false); // For menu dropdown
  const [isColumnDropdownOpen, setColumnDropdownOpen] = useState(false); // For column visibility dropdown
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    author: true,
    isbn: true,
    description: true,
    published_date: true,
    publisher: true,
  });
  const router = useRouter();

  useEffect(() => {
    const storedQueries = localStorage.getItem("savedQueries");
    if (storedQueries) {
      setSavedQueries(JSON.parse(storedQueries));
    }
  }, []);

  useEffect(() => {
    setIsAscending(true);
    sortArticles("published_date");
  }, []);

  const handleCheckboxChange = (column: keyof typeof visibleColumns) => {
    setVisibleColumns({ ...visibleColumns, [column]: !visibleColumns[column] });
  };

  const toggleMenuDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleColumnDropdown = () => {
    setColumnDropdownOpen(!isColumnDropdownOpen);
  };

  const sortArticles = (field: keyof Article) => {
    const isSameField = sortField === field;
    setSortField(field);
    setIsAscending(!isAscending);

    let sortedArticles;
    if (field === 'published_date') {
      sortedArticles = [...filteredArticles].sort((a, b) => {
        const dateA = new Date(a.published_date).getTime();
        const dateB = new Date(b.published_date).getTime();
        return isAscending ? dateA - dateB : dateB - dateA;
      });
    } else {
      sortedArticles = [...filteredArticles].sort((a, b) => {
        const valueA = a[field].toString().toLowerCase();
        const valueB = b[field].toString().toLowerCase();
        return isAscending
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    }

    setFilteredArticles(sortedArticles);
  };

  const getSortArrow = (field: keyof Article) => {
    if (sortField === field) {
      return isAscending ? "↑" : "↓";
    }
    return "";
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const searchQuery = e.target.value.toLowerCase();
    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery) ||
      article.author.toLowerCase().includes(searchQuery)
    );
    setFilteredArticles(filtered);
  };

  const handleSaveSearch = () => {
    if (searchTerm && !savedQueries.includes(searchTerm)) {
      const updatedQueries = [...savedQueries, searchTerm];
      setSavedQueries(updatedQueries);
      localStorage.setItem("savedQueries", JSON.stringify(updatedQueries));
    }
  };

  const handleClearQueries = () => {
    setSavedQueries([]);
    localStorage.removeItem('savedQueries');
  };

  const handleQueryClick = (query: string) => {
    setSearchTerm(query);
    const searchQuery = query.toLowerCase();
    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery) ||
      article.author.toLowerCase().includes(searchQuery)
    );
    setFilteredArticles(filtered);
  };

  return (
    <div style={containerStyle}>
      <h1>Welcome to the Software Empirical Evidence Database (SPEED)</h1>

      {/* Menu Dropdown */}
      <div style={{ position: "relative", display: "inline-block", float: "right" }}>
        <div style={menuBoxStyle}>
          <button onClick={toggleMenuDropdown} style={dropdownButtonStyle}>
            Menu
          </button>
        </div>
        {isDropdownOpen && (
          <div style={dropdownStyle}>
            <Link href="/submit" style={dropdownItemStyle}>
              Submit an Article
            </Link>
            <Link href="/moderation" style={dropdownItemStyle}>
              Moderation
            </Link>
            <Link href="/analysis" style={dropdownItemStyle}>
              Analysis
            </Link>
          </div>
        )}
      </div>

      {/* Search and Save Queries */}
      <div style={searchSectionStyle}>
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={handleSearchChange}
          style={inputStyle}
        />
        <button onClick={handleSaveSearch} style={buttonStyle}>Save Search</button>
      </div>

      {/* Saved Queries */}
      <div style={{ marginBottom: "20px" }}>
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
        <button onClick={handleClearQueries} style={buttonStyle}>Clear Saved Queries</button>
      </div>

      {/* Column Visibility Dropdown */}
      <div style={{ position: "relative", display: "inline-block", marginBottom: "20px" }}>
        <button onClick={toggleColumnDropdown} style={dropdownButtonStyle}>
          Hide/Show Columns
        </button>
        {isColumnDropdownOpen && (
          <div style={dropdownStyleColumns}>
            <div style={checkboxContainerStyle}>
              <input type="checkbox" checked={visibleColumns.title} onChange={() => handleCheckboxChange('title')} style={checkboxStyle} />
              <label>Title</label>
            </div>
            <div style={checkboxContainerStyle}>
              <input type="checkbox" checked={visibleColumns.author} onChange={() => handleCheckboxChange('author')} style={checkboxStyle} />
              <label>Author</label>
            </div>
            <div style={checkboxContainerStyle}>
              <input type="checkbox" checked={visibleColumns.isbn} onChange={() => handleCheckboxChange('isbn')} style={checkboxStyle} />
              <label>ISBN</label>
            </div>
            <div style={checkboxContainerStyle}>
              <input type="checkbox" checked={visibleColumns.description} onChange={() => handleCheckboxChange('description')} style={checkboxStyle} />
              <label>Description</label>
            </div>
            <div style={checkboxContainerStyle}>
              <input type="checkbox" checked={visibleColumns.published_date} onChange={() => handleCheckboxChange('published_date')} style={checkboxStyle} />
              <label>Published Date</label>
            </div>
            <div style={checkboxContainerStyle}>
              <input type="checkbox" checked={visibleColumns.publisher} onChange={() => handleCheckboxChange('publisher')} style={checkboxStyle} />
              <label>Publisher</label>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            {visibleColumns.title && <th>Title <button onClick={() => sortArticles("title")} style={sortButtonStyle}>Sort {getSortArrow("title")}</button></th>}
            {visibleColumns.author && <th>Author <button onClick={() => sortArticles("author")} style={sortButtonStyle}>Sort {getSortArrow("author")}</button></th>}
            {visibleColumns.isbn && <th>ISBN <button onClick={() => sortArticles("isbn")} style={sortButtonStyle}>Sort {getSortArrow("isbn")}</button></th>}
            {visibleColumns.description && <th>Description <button onClick={() => sortArticles("description")} style={sortButtonStyle}>Sort {getSortArrow("description")}</button></th>}
            {visibleColumns.published_date && <th>Published Date <button onClick={() => sortArticles("published_date")} style={sortButtonStyle}>Sort {getSortArrow("published_date")}</button></th>}
            {visibleColumns.publisher && <th>Publisher <button onClick={() => sortArticles("publisher")} style={sortButtonStyle}>Sort {getSortArrow("publisher")}</button></th>}
          </tr>
        </thead>
        <tbody>
          {filteredArticles.map(article => (
            <tr key={article._id}>
              {visibleColumns.title && <td>{article.title}</td>}
              {visibleColumns.author && <td>{article.author}</td>}
              {visibleColumns.isbn && <td>{article.isbn}</td>}
              {visibleColumns.description && <td>{article.description}</td>}
              {visibleColumns.published_date && <td>{new Date(article.published_date).toLocaleDateString('en-GB')}</td>}
              {visibleColumns.publisher && <td>{article.publisher}</td>}
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
};

export const getServerSideProps = async () => {
  let articles = [];

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`);
    if (!response.ok) {
      throw new Error("Failed to fetch articles");
    }
    articles = await response.json();
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      articles,
    },
  };
};

// Styles for dropdown menus and buttons
const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  backgroundColor: "white",
  boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
  zIndex: 1,
  right: 0,
  padding: "10px",
};

const dropdownStyleColumns: React.CSSProperties = {
  position: "absolute",
  backgroundColor: "white",
  boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
  zIndex: 1,
  left: 0,
  padding: "10px",
  display: "flex",
  flexDirection: "column",
};

const dropdownItemStyle: React.CSSProperties = {
  display: "block",
  padding: "10px 20px",
  textDecoration: "none",
  color: "black",
};

const dropdownButtonStyle: React.CSSProperties = {
  padding: "10px 15px",
  cursor: "pointer",
  background: "green",
  border: "none",
  color: "white",
  fontSize: "16px",
  transition: "background 0.3s",
};

const menuBoxStyle: React.CSSProperties = {
  display: "inline-block",
};

const sortButtonStyle: React.CSSProperties = {
  marginLeft: '10px',
  backgroundColor: '#2e7d32',
  border: 'none',
  cursor: 'pointer',
  padding: '5px',
  color: 'white',
};

const containerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "20px",
};

const searchSectionStyle: React.CSSProperties = {
  marginBottom: "20px",
};

const inputStyle: React.CSSProperties = {
  padding: "8px",
  marginRight: "10px",
  width: "200px",
};

const buttonStyle: React.CSSProperties = {
  padding: "8px 15px",
  backgroundColor: "#2e7d32",
  border: "none",
  color: "white",
  cursor: "pointer",
  marginRight: "10px",
};

const checkboxContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
};

const checkboxStyle: React.CSSProperties = {
  marginRight: "10px",
};

export default Home;
