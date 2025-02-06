import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const MyProfessionals = () => {
  const [myProfessionals, setMyProfessionals] = useState([]);

  useEffect(() => {
    const fetchMyProfessionals = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You need to log in first!");
        return;
      }

      try {
        const res = await fetch("/my-professionals", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch professionals");

        const data = await res.json();
        setMyProfessionals(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchMyProfessionals();
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">My Selected Professionals</h2>
      {myProfessionals.length === 0 ? (
        <p className="mt-4">You haven't selected any professionals yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {myProfessionals.map((pro) => (
            <li key={pro.id} className="border p-4 rounded shadow-md">
              <h3 className="text-lg font-bold">{pro.full_name}</h3>
              <p>{pro.profession_field}</p>
              <Link to={`/professionals/${pro.id}`} className="text-blue-500">View Details</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyProfessionals;
