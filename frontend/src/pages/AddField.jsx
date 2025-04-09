import { useState } from 'react';

const AddField = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    price_per_hour: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    const res = await fetch('http://localhost:5000/fields/add', {
      method: 'POST',
      body: data,
    });

    const result = await res.json();
    console.log(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="description" placeholder="Description" onChange={handleChange} />
      <input name="location" placeholder="Location" onChange={handleChange} />
      <input name="price_per_hour" placeholder="Price" onChange={handleChange} />
      <input name="image" type="file" onChange={handleChange} />
      <button type="submit">Add Field</button>
    </form>
  );
};

export default AddField;
