import { FC, useEffect, useState } from "react";

interface Book {
  _id: string;
  title: string;
  isbn: string;
  author: string;
  description: string;
  published_date: string;
  publisher: string;
  moderation: 'pending' | 'accepted' | 'rejected'; // Ensure this field is included
}

const Moderation: FC = () => {
  const [pendingBooks, setPendingBooks] = useState<Book[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPendingBooks();
  }, []);

  const fetchPendingBooks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/pending`);
      if (!response.ok) {
        throw new Error("Failed to fetch pending books");
      }
      const data = await response.json();
      setPendingBooks(data);
    } catch (error) {
      console.error("Error fetching pending books:", error);
      setMessage("Error fetching pending books. Please try again.");
    }
  };

  const handleAccept = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}/accept`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to accept the book");
      }
      
      // Refresh the pending books after accepting one
      fetchPendingBooks();
      setMessage("Book accepted successfully!");
    } catch (error) {
      console.error("Error accepting book:", error);
      setMessage("Error accepting book. Please try again.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}/reject`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to reject the book");
      }
      
      // Refresh the pending books after rejecting one
      fetchPendingBooks();
      setMessage("Book rejected successfully!");
    } catch (error) {
      console.error("Error rejecting book:", error);
      setMessage("Error rejecting book. Please try again.");
    }
  };

  return (
    <div>
      <h1>Moderation Panel</h1>
      {message && <p>{message}</p>}
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
              <th>Publisher</th>
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
                <td>{new Date(book.published_date).toLocaleDateString("en-US")}</td>
                <td>{book.publisher}</td>
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
