import Link from 'next/link';
import { FC, useState } from 'react';

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

const Home: FC<HomeProps> = ({ articles }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <h1>Welcome to the Software Empirical Evidence Database (SPEED)</h1>
      
      <div style={{ position: 'relative', display: 'inline-block', float: 'right' }}>
        <div style={menuBoxStyle}>
          <button onClick={toggleDropdown} style={dropdownButtonStyle}>
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
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Description</th>
              <th>Published Date</th>
              <th>Publisher</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td>{article.author}</td>
                <td>{article.isbn}</td>
                <td>{article.description}</td>
                <td>{new Date(article.published_date).toLocaleDateString()}</td>
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
      throw new Error('Failed to fetch articles');
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
  position: 'absolute',
  backgroundColor: 'white',
  boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
  zIndex: 1,
  right: 0,
};

const dropdownItemStyle: React.CSSProperties = {
  display: 'block',
  padding: '10px 20px',
  textDecoration: 'none',
  color: 'black',
};

const dropdownButtonStyle: React.CSSProperties = {
  padding: '10px 15px',
  cursor: 'pointer',
  background: 'green',
  border: 'none',
  color: 'white',
  fontSize: '16px',
  transition: 'background 0.3s',
};

const menuBoxStyle: React.CSSProperties = {
  display: 'inline-block',
};

export default Home;
