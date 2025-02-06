import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Ratings from "./Ratings";

const ProfessionalDetails = () => {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const res = await fetch(`https://project-phase-4-1.onrender.com/professionals/${id}`);

        if (!res.ok) {
          const errorText = await res.text(); // Get error response as text
          throw new Error(`Failed to fetch: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        setProfessional(data);
      } catch (error) {
        console.error("Error fetching professional:", error);
        setError(error.message);
      }
    };

    fetchProfessional();
  }, [id]);

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!professional) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold">{professional.full_name}</h2>
      <p className="text-lg text-gray-600">{professional.profession_field}</p>
      <p className="mt-4">{professional.description}</p>

      <Link
        to={`/professionals/${id}/rate`}
        className="mt-4 inline-block bg-blue-500 text-white p-2 rounded"
      >
        Rate This Professional
      </Link>

      <h3 className="mt-6 text-2xl font-bold">Ratings</h3>
      <Ratings professionalId={id} />
    </div>
  );
};

export default ProfessionalDetails;
