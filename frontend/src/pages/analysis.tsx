import Link from "next/link";
import { FC, useEffect, useState } from "react";

interface Article {
  _id: string;
  title: string;
  isbn: string;
  author: string;
  description: string;
  published_date: string;
  publisher: string;
  moderation: string;
}

const Analysis: FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [updatedArticle, setUpdatedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books?moderation=accepted`);
      const data = await response.json();
      setArticles(data);
    };
    fetchArticles();
  }, []);

  const handleEditClick = (article: Article) => {
    setEditingArticle(article);
    setUpdatedArticle(article);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (updatedArticle) {
      setUpdatedArticle({ ...updatedArticle, [e.target.name]: e.target.value });
    }
  };

  const handleUpdate = async () => {
    if (updatedArticle) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${updatedArticle._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedArticle),
      });

      if (response.ok) {
        setArticles(articles.map(article => (article._id === updatedArticle._id ? updatedArticle : article)));
        setEditingArticle(null);
        setUpdatedArticle(null);
      } else {
        console.error("Failed to update article");
      }
    }
  };

  
  const inputStyle = {
    width: '100%', 
    padding: '8px',
    marginBottom: '10px', 
    border: '1px solid #ccc', 
    borderRadius: '4px', 
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
      <div style={{ width: '80%', maxWidth: '1500px' }}> {}
        <h1 style={{ textAlign: 'center' }}>Analysis Panel</h1> {}
        {articles.length === 0 ? (
          <p>No accepted articles found.</p>
        ) : (
          <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ width: '30%', padding: '8px', border: '1px solid #ddd' }}>Title</th>
                <th style={{ width: '15%', padding: '8px', border: '1px solid #ddd' }}>Author</th>
                <th style={{ width: '10%', padding: '8px', border: '1px solid #ddd' }}>ISBN</th>
                <th style={{ width: '45%', padding: '8px', border: '1px solid #ddd' }}>Description</th>
                <th style={{ width: '10%', padding: '8px', border: '1px solid #ddd' }}>Published Date</th>
                <th style={{ width: '10%', padding: '8px', border: '1px solid #ddd' }}>Publisher</th>
                <th style={{ width: '6.5%', padding: '8px', border: '1px solid #ddd' }}>Edit</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article._id}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{article.title}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{article.author}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{article.isbn}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{article.description}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {new Date(article.published_date).toLocaleDateString("en-US")}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{article.publisher}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <button onClick={() => handleEditClick(article)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {editingArticle && (
          <div>
            <h2>Edit Article</h2>
            <input
              type="text"
              name="title"
              value={updatedArticle?.title}
              onChange={handleInputChange}
              placeholder="Title"
              style={inputStyle}
            />
            <input
              type="text"
              name="author"
              value={updatedArticle?.author}
              onChange={handleInputChange}
              placeholder="Author"
              style={inputStyle} 
            />
            <input
              type="text"
              name="isbn"
              value={updatedArticle?.isbn}
              onChange={handleInputChange}
              placeholder="ISBN"
              style={inputStyle} 
            />
            <textarea
              name="description"
              value={updatedArticle?.description}
              onChange={handleInputChange}
              placeholder="Description"
              rows={3}
              style={{ ...inputStyle, height: 'auto' }} 
            />
            <input
              type="text"
              name="publisher"
              value={updatedArticle?.publisher}
              onChange={handleInputChange}
              placeholder="Publisher"
              style={inputStyle} 
            />
            <input
              type="date"
              name="published_date"
              value={updatedArticle?.published_date?.split('T')[0]} 
              onChange={handleInputChange}
              style={inputStyle} 
            />
            <button onClick={handleUpdate}>Save Changes</button>
            <button onClick={() => setEditingArticle(null)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
