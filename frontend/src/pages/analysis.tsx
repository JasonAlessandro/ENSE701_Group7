import Link from "next/link";
import { FC, useEffect, useState } from "react";
import Rating from "react-rating-stars-component";
import { useNotification } from "../Notification"; 

interface Article {
  _id: string;
  title: string;
  isbn: string;
  author: string;
  description: string;
  published_date: number;
  ratings: number[];
  moderation: string;
}

const Analysis: FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [updatedArticle, setUpdatedArticle] = useState<Article | null>(null);
  const { addNotification } = useNotification(); 

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books?moderation=accepted`
      );
      const data = await response.json();
      setArticles(data);
    };
    fetchArticles();
  }, []);

  const handleEditClick = (article: Article) => {
    setEditingArticle(article);
    setUpdatedArticle(article);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (updatedArticle) {
      setUpdatedArticle({ ...updatedArticle, [e.target.name]: e.target.value });
    }
  };

  const handleUpdate = async () => {
    if (updatedArticle) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${updatedArticle._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedArticle),
          }
        );

        if (response.ok) {
          setArticles(
            articles.map((article) =>
              article._id === updatedArticle._id ? updatedArticle : article
            )
          );
          setEditingArticle(null);
          setUpdatedArticle(null);
          addNotification("Article updated successfully!"); 
        } else {
          throw new Error("Failed to update article");
        }
      } catch (error) {
        console.error("Failed to update article:", error);
        addNotification("Error updating article. Please try again.");
      }
    }
  };

  const handleRating = async (articleId: string, newRating: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${articleId}/rate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating: newRating }),
        }
      );

      if (response.ok) {
        setArticles(
          articles.map((article) =>
            article._id === articleId
              ? { ...article, ratings: [...article.ratings, newRating] }
              : article
          )
        );
        addNotification("Rating submitted successfully!"); 
      } else {
        throw new Error("Failed to rate the article");
      }
    } catch (error) {
      console.error("Failed to rate the article:", error);
      addNotification("Error rating the article. Please try again.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
      <div style={{ width: "80%", maxWidth: "1500px" }}>
        <h1 style={{ textAlign: "center" }}>Analysis Panel</h1>

        {/* Back Button */}
        <div style={{ marginBottom: "20px" }}>
          <Link href="/">
            <button>Back to Home</button>
          </Link>
        </div>

        {articles.length === 0 ? (
          <p>No accepted articles found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    width: "30%",
                    padding: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  Title
                </th>
                <th
                  style={{
                    width: "15%",
                    padding: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  Author
                </th>
                <th
                  style={{
                    width: "10%",
                    padding: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  DOI
                </th>
                <th
                  style={{
                    width: "45%",
                    padding: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    width: "10%",
                    padding: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  Journal Year
                </th>
                <th
                  style={{
                    width: "15%",
                    padding: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  Rating
                </th>
                <th
                  style={{
                    width: "9%",
                    padding: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  Edit
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article._id}>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {article.title}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {article.author}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {article.isbn}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {article.description}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {article.published_date.toString().slice(0, 4)}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    <Rating
                      count={5}
                      value={
                        Math.floor(
                          article.ratings.reduce((a, b) => a + b, 0) /
                            article.ratings.length
                        ) || 0
                      }
                      size={24}
                      activeColor="#ffd700"
                      onChange={(newRating: number) =>
                        handleRating(article._id, newRating)
                      }
                    />
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    <button onClick={() => handleEditClick(article)}>
                      Edit
                    </button>
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
              style={{ ...inputStyle, height: "auto" }}
            />
            <input
              type="number"
              name="published_date"
              value={updatedArticle?.published_date}
              onChange={handleInputChange}
              placeholder="YYYY"
              style={inputStyle}
            />
            <div style={{ marginTop: '10px' }}>
              <button style={{ marginRight: '10px' }} onClick={handleUpdate}>Save Changes</button>
              <button onClick={() => setEditingArticle(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
