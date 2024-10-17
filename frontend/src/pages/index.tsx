import Link from "next/link";
import { FC, useState, useEffect, useCallback } from "react";
import Rating from "react-rating-stars-component";

interface Article {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  published_date: string;
  ratings: number[];
}

interface HomeProps {
  articles: Article[];
}

const Home: FC<HomeProps> = ({ articles: initialArticles }) => {
  const [articles] = useState(initialArticles);
  const [filteredArticles, setFilteredArticles] =
    useState<Article[]>(initialArticles);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [savedQueries, setSavedQueries] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Article | null>(null);
  const [isAscending, setIsAscending] = useState(true); // Update to useState here
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isColumnDropdownOpen, setColumnDropdownOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    author: true,
    isbn: true,
    description: true,
    published_date: true,
    rating: true,
  });

  useEffect(() => {
    const storedQueries = localStorage.getItem("savedQueries");
    if (storedQueries) {
      setSavedQueries(JSON.parse(storedQueries));
    }
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

  const getAverageRating = (ratings: number[]): number => {
    return ratings.length
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;
  };

  const sortArticles = useCallback(() => {
    if (!sortField) return;

    let sortedArticles;
    if (sortField === "ratings") {
      sortedArticles = [...filteredArticles].sort((a, b) => {
        const avgRatingA = getAverageRating(a.ratings);
        const avgRatingB = getAverageRating(b.ratings);
        return isAscending ? avgRatingA - avgRatingB : avgRatingB - avgRatingA;
      });
    } else {
      sortedArticles = [...filteredArticles].sort((a, b) => {
        const valueA = a[sortField]?.toString().toLowerCase() || "";
        const valueB = b[sortField]?.toString().toLowerCase() || "";
        return isAscending
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    }

    setFilteredArticles(sortedArticles);
  }, [filteredArticles, sortField, isAscending]);

  useEffect(() => {
    sortArticles();
  }, [sortArticles]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const searchQuery = e.target.value.toLowerCase();
    const filtered = articles.filter(
      (article) =>
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
    localStorage.removeItem("savedQueries");
  };

  const handleQueryClick = (query: string) => {
    setSearchTerm(query);
    const searchQuery = query.toLowerCase();
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery) ||
        article.author.toLowerCase().includes(searchQuery)
    );
    setFilteredArticles(filtered);
  };

  const handleSortFieldChange = (field: keyof Article) => {
    if (sortField === field) {
      // If the same field is clicked, toggle the sort direction
      setIsAscending(!isAscending);
    } else {
      // If a new field is clicked, set that field and reset to ascending order
      setSortField(field);
      setIsAscending(true);
    }
  };

  const getSortArrow = (field: keyof Article) => {
    if (sortField === field) {
      return isAscending ? "↑" : "↓";
    }
    return "";
  };

  return (
    <div style={containerStyle}>
      <h1>Welcome to the Software Empirical Evidence Database (SPEED)</h1>

      {/* Menu Dropdown */}
      <div
        style={{
          position: "relative",
          display: "inline-block",
          float: "right",
        }}
      >
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
        <button onClick={handleSaveSearch} style={buttonStyle}>
          Save Search
        </button>
      </div>

      {/* Saved Queries */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Saved Search Queries</h2>
        {savedQueries.length === 0 ? (
          <p>No saved queries.</p>
        ) : (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {" "}
            {/* Ensure list styling */}
            {savedQueries.map((query, index) => (
              <li
                key={index}
                style={{ display: "inline-block", marginRight: "10px" }}
              >
                {" "}
                {/* Inline-block to ensure they don't take full width */}
                <span
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                  onClick={() => handleQueryClick(query)}
                >
                  {query}
                </span>
              </li>
            ))}
          </ul>
        )}
        <button onClick={handleClearQueries} style={buttonStyle}>
          Clear Saved Queries
        </button>
      </div>

      {/* Column Visibility Dropdown */}
      <div
        style={{
          position: "relative",
          display: "inline-block",
          marginBottom: "20px",
          float: "right",
        }}
      >
        <button onClick={toggleColumnDropdown} style={dropdownButtonStyle}>
          Hide/Show Columns
        </button>
        {isColumnDropdownOpen && (
          <div style={dropdownStyleColumns}>
            <div style={checkboxContainerStyle}>
              <label>Title</label>
              <input
                type="checkbox"
                checked={visibleColumns.title}
                onChange={() => handleCheckboxChange("title")}
                style={checkboxStyle}
              />
            </div>
            <div style={checkboxContainerStyle}>
              <label>Author</label>
              <input
                type="checkbox"
                checked={visibleColumns.author}
                onChange={() => handleCheckboxChange("author")}
                style={checkboxStyle}
              />
            </div>
            <div style={checkboxContainerStyle}>
              <label>ISBN</label>
              <input
                type="checkbox"
                checked={visibleColumns.isbn}
                onChange={() => handleCheckboxChange("isbn")}
                style={checkboxStyle}
              />
            </div>
            <div style={checkboxContainerStyle}>
              <label>Description</label>
              <input
                type="checkbox"
                checked={visibleColumns.description}
                onChange={() => handleCheckboxChange("description")}
                style={checkboxStyle}
              />
            </div>
            <div style={checkboxContainerStyle}>
              <label>Journal Year</label>
              <input
                type="checkbox"
                checked={visibleColumns.published_date}
                onChange={() => handleCheckboxChange("published_date")}
                style={checkboxStyle}
              />
            </div>
            <div style={checkboxContainerStyle}>
              <label>Rating</label>
              <input
                type="checkbox"
                checked={visibleColumns.rating}
                onChange={() => handleCheckboxChange("rating")}
                style={checkboxStyle}
              />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr>
            {visibleColumns.title && (
              <th>
                Title{" "}
                <button
                  onClick={() => handleSortFieldChange("title")}
                  style={sortButtonStyle}
                >
                  Sort {getSortArrow("title")}
                </button>
              </th>
            )}
            {visibleColumns.author && (
              <th>
                Author{" "}
                <button
                  onClick={() => handleSortFieldChange("author")}
                  style={sortButtonStyle}
                >
                  Sort {getSortArrow("author")}
                </button>
              </th>
            )}
            {visibleColumns.isbn && (
              <th>
                ISBN{" "}
                <button
                  onClick={() => handleSortFieldChange("isbn")}
                  style={sortButtonStyle}
                >
                  Sort {getSortArrow("isbn")}
                </button>
              </th>
            )}
            {visibleColumns.description && (
              <th>
                Description{" "}
                <button
                  onClick={() => handleSortFieldChange("description")}
                  style={sortButtonStyle}
                >
                  Sort {getSortArrow("description")}
                </button>
              </th>
            )}
            {visibleColumns.published_date && (
              <th>
                Journal Year{" "}
                <button
                  onClick={() => handleSortFieldChange("published_date")}
                  style={sortButtonStyle}
                >
                  Sort {getSortArrow("published_date")}
                </button>
              </th>
            )}
            {visibleColumns.rating && (
              <th>
                Rating{" "}
                <button
                  onClick={() => handleSortFieldChange("ratings")}
                  style={sortButtonStyle}
                >
                  Sort {getSortArrow("ratings")}
                </button>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredArticles.map((article) => (
            <tr key={article._id}>
              {visibleColumns.title && <td>{article.title}</td>}
              {visibleColumns.author && <td>{article.author}</td>}
              {visibleColumns.isbn && <td>{article.isbn}</td>}
              {visibleColumns.description && <td>{article.description}</td>}
              {visibleColumns.published_date && (
                <td>{article.published_date.slice(0, 4)}</td>
              )}
              {visibleColumns.rating && (
                <td>
                  <Rating
                    count={5}
                    value={getAverageRating(article.ratings)}
                    size={24}
                    edit={false}
                    activeColor="#ffd700"
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        th,
        td {
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`
    );
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
  marginLeft: "10px",
  backgroundColor: "#2e7d32",
  border: "none",
  cursor: "pointer",
  padding: "5px",
  color: "white",
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
  alignItems: "center",
  float: "right",
};

export default Home;
