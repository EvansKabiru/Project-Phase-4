import { useEffect, useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ProfessionalContext } from "../context/ProfessionalContext";
import { RatingContext } from "../context/RatingContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaStar, FaSearch } from "react-icons/fa";

const Home = () => {
    const { current_user, logout } = useContext(UserContext);
    const { professionals, loading } = useContext(ProfessionalContext);
    const { ratings } = useContext(RatingContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProfessionals, setFilteredProfessionals] = useState([]);

    // Search functionality
    useEffect(() => {
        if (searchTerm === "") {
            setFilteredProfessionals(professionals);
        } else {
            const filtered = professionals.filter((professional) =>
                professional.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProfessionals(filtered);
        }
    }, [searchTerm, professionals]);

    // Handle logout
    const handleLogout = () => {
        logout();
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold">Welcome to PRO-GET</h1>
                {current_user ? (
                    <div className="flex items-center space-x-4">
                        <span>{`Hello, ${current_user.username}`}</span>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex space-x-4">
                        <Link to="/login" className="text-blue-500">
                            Login
                        </Link>
                        <Link to="/register" className="text-blue-500">
                            Register
                        </Link>
                    </div>
                )}
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    className="border rounded-lg p-2 w-full"
                    placeholder="Search for professionals"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div>Loading professionals...</div>
                ) : (
                    filteredProfessionals.map((professional) => {
                        const professionalRatings = ratings.filter(
                            (rating) => rating.professional_id === professional.id
                        );

                        // Calculate average rating
                        const avgRating =
                            professionalRatings.length > 0
                                ? professionalRatings.reduce((acc, rating) => acc + rating.rating, 0) /
                                  professionalRatings.length
                                : 0;

                        return (
                            <div
                                key={professional.id}
                                className="bg-white border rounded-lg p-4 shadow-lg hover:shadow-2xl"
                            >
                                <h2 className="text-xl font-semibold">{professional.name}</h2>
                                <p className="text-gray-500">{professional.category}</p>
                                <div className="flex items-center space-x-1 mt-2">
                                    <span>{avgRating.toFixed(1)}</span>
                                    <FaStar className="text-yellow-500" />
                                </div>
                                <Link
                                    to={`/professionals/${professional.id}`}
                                    className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    View Details
                                </Link>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Home;
