import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const RatingContext = createContext();

export const RatingProvider = ({ children }) => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const authToken = sessionStorage.getItem("token");

    // FETCH ALL RATINGS
    useEffect(() => { fetchRatings(); }, []);
    const fetchRatings = () => {
        fetch("http://localhost:5000/ratings")
        .then((res) => res.json())
        .then((data) => {
            setRatings(data);
            setLoading(false);
        })
        .catch(() => {
            toast.error("Failed to fetch ratings");
            setLoading(false);
        });
    };

    // SUBMIT A RATING
    const addRating = (professionalId, rating, comment) => {
        if (!authToken) {
            toast.error("You must be logged in to rate a professional");
            return;
        }

        fetch("http://localhost:5000/ratings", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({ professional_id: professionalId, rating, comment })
        })
        .then((res) => res.json())
        .then((newRating) => {
            setRatings([...ratings, newRating]);
            toast.success("Rating submitted successfully!");
        })
        .catch(() => {
            toast.error("Failed to submit rating");
        });
    };

    // UPDATE A RATING
    const updateRating = (ratingId, updatedRating, updatedComment) => {
        if (!authToken) {
            toast.error("You must be logged in to update a rating");
            return;
        }

        fetch(`http://localhost:5000/ratings/${ratingId}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({ rating: updatedRating, comment: updatedComment })
        })
        .then((res) => res.json())
        .then((updated) => {
            setRatings(ratings.map(rating => rating.id === ratingId ? updated : rating));
            toast.success("Rating updated successfully!");
        })
        .catch(() => {
            toast.error("Failed to update rating");
        });
    };

    // DELETE A RATING
    const deleteRating = (ratingId) => {
        if (!authToken) {
            toast.error("You must be logged in to delete a rating");
            return;
        }

        fetch(`http://localhost:5000/ratings/${ratingId}`, {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
        })
        .then((res) => res.json())
        .then(() => {
            setRatings(ratings.filter(rating => rating.id !== ratingId));
            toast.success("Rating deleted successfully!");
        })
        .catch(() => {
            toast.error("Failed to delete rating");
        });
    };

    return (
        <RatingContext.Provider value={{ ratings, loading, addRating, updateRating, deleteRating }}>
            {children}
        </RatingContext.Provider>
    );
};
export default RatingContext;