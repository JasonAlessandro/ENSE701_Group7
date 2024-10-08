import { FC, useState } from "react";
import { useRouter } from "next/router";

const Submit: FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    author: "",
    description: "",
    published_date: "",
    publisher: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Reset the message on form submit

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit the form");
      }

      setMessage("Book submitted for moderation!");
      // Redirect to the homepage after submission
      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Error submitting form. Please try again.");
    }
  };

  return (
    <div>
      <h1>Submit a Book</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>ISBN:</label>
          <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} required />
        </div>
        <div>
          <label>Author:</label>
          <input type="text" name="author" value={formData.author} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
        </div>
        <div>
          <label>Published Date:</label>
          <input type="date" name="published_date" value={formData.published_date} onChange={handleChange} required />
        </div>
        <div>
          <label>Publisher:</label>
          <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Submit;
