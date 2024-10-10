import React, { useState } from 'react';

interface FormData {
  title: string;
  isbn: string;
  author: string;
  description: string;
  published_date: string;
  publisher: string;
}

const Submit = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    isbn: '',
    author: '',
    description: '',
    published_date: '',
    publisher: '',
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data);

      setMessage('Article sent for moderation.');
      setFormData({
        title: '',
        isbn: '',
        author: '',
        description: '',
        published_date: '',
        publisher: '',
      });

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input name="title" value={formData.title} onChange={handleChange} required />
        <br />
        <label>ISBN:</label>
        <input name="isbn" value={formData.isbn} onChange={handleChange} required />
        <br />
        <label>Author:</label>
        <input name="author" value={formData.author} onChange={handleChange} required />
        <br />
        <label>Description:</label>
        <input name="description" value={formData.description} onChange={handleChange} />
        <br />
        <label>Published Date:</label>
        <input type="date" name="published_date" value={formData.published_date} onChange={handleChange} required />
        <br />
        <label>Publisher:</label>
        <input name="publisher" value={formData.publisher} onChange={handleChange} required />
        <br />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Submit;
