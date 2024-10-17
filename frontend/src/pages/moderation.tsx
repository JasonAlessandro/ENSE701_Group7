import { FC, useEffect, useState, useCallback } from "react";
import { useNotification } from '../Notification';
import { useRouter } from "next/router";

interface Book {
  _id: string;
  title: string;
  isbn: string;
  author: string;
  description: string;
  published_date: string;
  ratings: number[];
  moderation: 'pending' | 'accepted' | 'rejected';
}

const Moderation: FC = () => {
  const [pendingBooks, setPendingBooks] = useState<Book[]>([]);
  const { addNotification } = useNotification();
  const router = useRouter();

  const fetchPendingBooks = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/pending`);
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

  useEffect(() => {
    fetchPendingBooks();
  }, [fetchPendingBooks]);

  const handleAccept = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}/accept`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to accept the Articles");
      }

      fetchPendingBooks();
      addNotification("Article accepted successfully!");
    } catch (error) {
      console.error("Error accepting Articles:", error);
      addNotification("Error accepting Articles. Please try again.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}/reject`, {
        method: "DELETE",
      });

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
    <div>
      <h1>Moderation Panel</h1>
      <button onClick={() => router.push("/")}>Back to Home</button>
      {pendingBooks.length === 0 ? (
        <p>No books pending moderation.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Description</th>
              <th>Published Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingBooks.map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>{book.description}</td>
                <td>{new Date(book.published_date).toLocaleDateString("en-GB")}</td>
                <td>
                  <button onClick={() => handleAccept(book._id)}>Accept</button>
                  <button onClick={() => handleReject(book._id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Moderation;
