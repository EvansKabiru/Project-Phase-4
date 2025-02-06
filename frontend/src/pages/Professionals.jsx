import React, { useContext, useEffect, useState } from 'react';
import { ProfessionalContext } from '../context/ProfessionalContext';
import ProfessionalCard from '../components/ProfessionalCard';
import SearchBar from '../components/Searchbar';

export default function Professionals() {
  const { professionals } = useContext(ProfessionalContext);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setFilteredProfessionals(professionals);
  }, [professionals]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredProfessionals(professionals);
    } else {
      const filtered = professionals.filter((professional) =>
        professional.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProfessionals(filtered);
    }
  }, [searchQuery, professionals]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Professionals</h1>

        {/* Search Bar Component */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Professionals List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {filteredProfessionals.length > 0 ? (
            filteredProfessionals.map((professional) => (
              <ProfessionalCard
                key={professional.id}
                professional={professional}
              />
            ))
          ) : (
            <div className="text-center text-lg text-gray-500">No professionals found</div>
          )}
        </div>
      </div>
    </div>
  );
}

