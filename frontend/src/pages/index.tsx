import Link from "next/link";
import { FC, useState, useEffect } from "react";

interface Article {
  _id: string;
  title: string;
  isbn: string;
  author: string;
  description: string;
  published_date: string;
  publisher: string;
}

interface HomeProps {
  articles: Article[];
}

const Home: FC<HomeProps> = ({ articles: initialArticles }) => {
  const [articles, setArticles] = useState(initialArticles);
  const [sortField, setSortField] = useState<keyof Article | null>(null);
  const [isAscending, setIsAscending] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    sortArticles("published_date");
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const sortArticles = (field: keyof Article) => {
    const isSameField = sortField === field;
    setSortField(field);
    if (isSameField) {
      setIsAscending(!isAscending);
    } else {
      setIsAscending(true);
    }

    const sortedArticles = [...articles].sort((a, b) => {
      if (field === "published_date") {
        const dateA = new Date(a.published_date).getTime();
        const dateB = new Date(b.published_date).getTime();
        return isSameField ? (isAscending ? dateB - dateA : dateA - dateB) : dateA - dateB;
      } else {
        const valueA = a[field].toString().toLowerCase();
        const valueB = b[field].toString().toLowerCase();
        return isSameField
          ? (isAscending ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB))
          : valueA.localeCompare(valueB);
      }
    });

    setArticles(sortedArticles);
  };

  const getSortArrow = (field: keyof Article) => {
    if (sortField === field) {
      return isAscending ? "↑" : "↓";
    }
    return "";
  };

  return (
    <div>
      <h1>Welcome to the Software Empirical Evidence Database (SPEED)</h1>

      <div style={{ position: "relative", display: "inline-block", float: "right" }}>
        <div style={menuBoxStyle}>
          <button onClick={toggleDropdown} style={dropdownButtonStyle}>
            Menu
          </button>
        </div>
        {isClient && isDropdownOpen && (
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
            <Link href="/search" style={dropdownItemStyle}>
              Search Database
            </Link>
          </div>
        )}
      </div>

      <h2>Submitted Articles</h2>
      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>
                Title
                <button onClick={() => sortArticles("title")} style={sortButtonStyle}>
                  Sort {getSortArrow("title")}
                </button>
              </th>
              <th>
                Author
                <button onClick={() => sortArticles("author")} style={sortButtonStyle}>
                  Sort {getSortArrow("author")}
                </button>
              </th>
              <th>
                ISBN
                <button onClick={() => sortArticles("isbn")} style={sortButtonStyle}>
                  Sort {getSortArrow("isbn")}
                </button>
              </th>
              <th>Description</th>
              <th>
                Published Date
                <button onClick={() => sortArticles("published_date")} style={sortButtonStyle}>
                  Sort {getSortArrow("published_date")}
                </button>
              </th>
              <th>
                Publisher
                <button onClick={() => sortArticles("publisher")} style={sortButtonStyle}>
                  Sort {getSortArrow("publisher")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
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

      <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
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

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  backgroundColor: "white",
  boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
  zIndex: 1,
  right: 0,
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

export default Home;
