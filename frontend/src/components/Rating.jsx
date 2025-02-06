import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';

const Rating = ({ professionalId }) => {
  const { current_user } = useContext(UserContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!rating || !comment) {
      toast.error('Please provide both rating and comment.');
      return;
    }

    fetch('http://localhost:5000/rate-professional', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${current_user.token}`,
      },
      body: JSON.stringify({ professionalId, rating, comment }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success('Rating submitted successfully!');
        } else {
          toast.error('Error submitting rating.');
        }
      })
      .catch(() => {
        toast.error('An error occurred while submitting the rating.');
      });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">Rate Professional</h3>
      <div className="mt-4">
        <label className="block text-sm">Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border p-2 rounded w-full mt-2"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-2 rounded w-full mt-2"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Submit Rating
      </button>
    </div>
  );
};

export default Rating;
