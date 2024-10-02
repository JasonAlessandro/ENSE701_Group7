// src/pages/submit.tsx
import { useState, ChangeEvent, FormEvent } from 'react';

type FormData = {
  title: string;
  authors: string;
  journal: string;
  year: string;
  volume: string;
  pages: string;
  doi: string;
};

const Submit = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    authors: '',
    journal: '',
    year: '',
    volume: '',
    pages: '',
    doi: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted', formData);
  };

  return (
    <div>
      <h1>Submit an Article</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input name="title" value={formData.title} onChange={handleChange} />

        <label>Authors:</label>
        <input name="authors" value={formData.authors} onChange={handleChange} />

        <label>Journal:</label>
        <input name="journal" value={formData.journal} onChange={handleChange} />

        <label>Year:</label>
        <input name="year" value={formData.year} onChange={handleChange} />

        <label>Volume:</label>
        <input name="volume" value={formData.volume} onChange={handleChange} />

        <label>Pages:</label>
        <input name="pages" value={formData.pages} onChange={handleChange} />

        <label>DOI:</label>
        <input name="doi" value={formData.doi} onChange={handleChange} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Submit;
