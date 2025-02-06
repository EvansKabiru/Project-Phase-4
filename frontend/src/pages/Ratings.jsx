import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Ratings = () => {
  const { id } = useParams(); // Get professional's ID from URL
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState(null); // Store errors

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await fetch(`https://project-phase-4-1.onrender.com/professionals/${id}/ratings`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` // If authentication is required
          }
        });

        if (!res.ok) throw new Error(`Error ${res.status}: Failed to fetch ratings`);

        const data = await res.json();
        setRatings(data);
      } catch (error) {
        console.error("Fetching ratings failed:", error);
        setError(error.message);
      }
    };

    fetchRatings();
  }, [id]);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">Ratings & Reviews</h2>

      {/* Display Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Display No Ratings Message */}
      {ratings.length === 0 && !error ? (
        <p className="mt-4">No ratings yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {ratings.map((rate) => (
            <li key={rate.id} className="border p-4 rounded shadow-md">
              <p><strong>Rating:</strong> {"⭐".repeat(rate.rating)}</p>
              <p><strong>Comment:</strong> {rate.comment}</p>
              {rate.created_at && (
                <p className="text-gray-500 text-sm">
                  <strong>Posted on:</strong> {new Date(rate.created_at).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Ratings;
