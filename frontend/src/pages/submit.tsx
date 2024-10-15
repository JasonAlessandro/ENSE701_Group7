import { FC, useState } from "react";
import { useRouter } from "next/router";
import { useNotification } from '../Notification'; 

const Submit: FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    author: "",
    description: "",
    published_date: "",
  });
  const router = useRouter();
  const { addNotification } = useNotification(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      addNotification("Article submitted for moderation!"); 
      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      addNotification("Error submitting form. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Submit an Article</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>DOI:</label>
          <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} required />
        </div>
        <div>
          <label>Author:</label>
          <input type="text" name="author" value={formData.author} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '610px', height: '50px' }} />
        </div>
        <div>
          <label>Published Date:</label>
          <input type="date" name="published_date" value={formData.published_date} onChange={handleChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
      <button onClick={() => router.push("/")}>Back to Home</button> {/* Back to Home button */}
    </div>
    
  );
};

export default Submit;
