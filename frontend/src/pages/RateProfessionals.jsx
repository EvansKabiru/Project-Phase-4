import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const RateProfessionals = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const submitRating = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You need to log in first!");
      return;
    }

    try {
      const res = await fetch(`https://project-phase-4-1.onrender.com/professionals/${id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!res.ok) throw new Error("Failed to submit rating");

      toast.success("Rating submitted successfully!");
      navigate(`/professionals/${id}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">Rate This Professional</h2>
      <form onSubmit={submitRating} className="mt-4 space-y-4">
        <label className="block">
          <span>Rating:</span>
          <select value={rating} onChange={(e) => setRating(e.target.value)} className="border p-2 w-full">
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num} Star{num > 1 ? "s" : ""}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span>Comment:</span>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="border p-2 w-full"></textarea>
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit Rating</button>
      </form>
    </div>
  );
};

export default RateProfessionals;
