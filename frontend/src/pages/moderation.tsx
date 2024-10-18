import Link from "next/link";
import { FC, useEffect, useState, useCallback } from "react";
import { useNotification } from "../Notification";

interface Book {
  _id: string;
  title: string;
  isbn: string;
  author: string;
  description: string;
  published_date: string;
  moderation: string; // Assuming this is still part of the Book interface
}

const Moderation: FC = () => {
  const [pendingBooks, setPendingBooks] = useState<Book[]>([]);
  const [acceptedBooks, setAcceptedBooks] = useState<Book[]>([]); // State for accepted books
  const { addNotification } = useNotification();

  const fetchPendingBooks = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/pending`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch pending Articles");
      }
      const data = await response.json();
      setPendingBooks(data);
    } catch (error) {
      console.error("Error fetching pending Articles:", error);
      addNotification("Error fetching pending Articles. Please try again.");
    }
  }, [addNotification]);

  const fetchAcceptedBooks = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books?moderation=accepted`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch accepted Articles");
      }
      const data = await response.json();
      setAcceptedBooks(data);
    } catch (error) {
      console.error("Error fetching accepted Articles:", error);
      addNotification("Error fetching accepted Articles. Please try again.");
    }
  }, [addNotification]);

  useEffect(() => {
    fetchPendingBooks();
    fetchAcceptedBooks(); // Fetch accepted books when the component mounts
  }, [fetchPendingBooks, fetchAcceptedBooks]);

  const handleAccept = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}/accept`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to accept the Articles");
      }

      fetchPendingBooks();
      fetchAcceptedBooks(); // Fetch accepted books again after accepting
      addNotification("Article accepted successfully!");
    } catch (error) {
      console.error("Error accepting Articles:", error);
      addNotification("Error accepting Articles. Please try again.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}/reject`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject the Articles");
      }

      fetchPendingBooks();
      addNotification("Article rejected successfully!");
    } catch (error) {
      console.error("Error rejecting Articles:", error);
      addNotification("Error rejecting Articles. Please try again.");
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '80%', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: "center" }}>Moderation Panel</h1>
        <div style={{ marginBottom: "20px" }}>
          <Link href="/">
            <button>Back to Home</button>
          </Link>
        </div>
        {pendingBooks.length === 0 ? (
          <p>No books pending moderation.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Title</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Author</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>DOI</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Description</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Journal Year</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingBooks.map((book) => (
                <tr key={book._id}>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{book.title}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{book.author}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{book.isbn}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{book.description}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{book.published_date.toString().slice(0, 4)}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    <button style={{ marginRight: '10px' }} onClick={() => handleAccept(book._id)}>Accept</button>
                    <button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleReject(book._id)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Accepted Articles Table */}
        <h2 style={{ textAlign: "center", marginTop: "30px" }}>Accepted Articles</h2>
        {acceptedBooks.length === 0 ? (
          <p>No articles have been accepted yet.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Title</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Author</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>DOI</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Description</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Journal Year</th>
              </tr>
            </thead>
            <tbody>
              {acceptedBooks.map((book) => (
                <tr key={book._id}>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{book.title}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{book.author}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{book.isbn}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{book.description}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{book.published_date.toString().slice(0, 4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Moderation;
