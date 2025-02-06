import React from 'react';
import { Link } from 'react-router-dom';

const ProfessionalCard = ({ professional }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-gray-800">{professional.full_name}</h3>
      <p className="text-lg text-gray-600">Professional Field: {professional.professional_field}</p>
      <p className="text-lg text-gray-600">Age: {professional.age}</p>
      <p className="text-lg text-gray-600">Location: {professional.location}</p>
      <p className="text-lg text-gray-600">Email: {professional.email}</p>
      <p className="text-lg text-gray-600">Phone: {professional.phone_number}</p>

      <div className="mt-4">
        <Link
          to={`/professionaldetails/${professional.id}`}
          className="text-blue-500 hover:underline"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfessionalCard;
