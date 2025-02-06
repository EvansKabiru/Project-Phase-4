import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const ProfessionalContext = createContext();

export const ProfessionalProvider = ({ children }) => {
    const [professionals, setProfessionals] = useState([]);
    const [loading, setLoading] = useState(true);

    // FETCH ALL PROFESSIONALS
    useEffect(() => { fetchProfessionals(); }, []);
    const fetchProfessionals = () => {
        fetch("https://project-phase-4-1.onrender.com/professionals")
        .then((res) => res.json())
        .then((data) => {
            setProfessionals(data);
            setLoading(false);
        })
        .catch(() => {
            toast.error("Failed to fetch professionals");
            setLoading(false);
        });
    };

    // ADD PROFESSIONAL
    const addProfessional = (professionalData) => {
        toast.loading("Adding professional...");
        fetch("https://project-phase-4-1.onrender.com/professionals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(professionalData)
        })
        .then((resp) => resp.json())
        .then((response) => {
            toast.dismiss();
            if (response.msg) {
                toast.success("Professional added successfully");
                fetchProfessionals(); // Reload professionals list after adding
            } else {
                toast.error(response.error || "Failed to add professional");
            }
        });
    };

    // UPDATE PROFESSIONAL
    const updateProfessional = (professionalId, updatedData) => {
        toast.loading("Updating professional...");
        fetch(`https://project-phase-4-1.onrender.com/professionals/${professionalId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        })
        .then((resp) => resp.json())
        .then((response) => {
            toast.dismiss();
            if (response.msg) {
                toast.success("Professional updated successfully");
                fetchProfessionals(); // Reload professionals list after updating
            } else {
                toast.error(response.error || "Failed to update professional");
            }
        });
    };

    // DELETE PROFESSIONAL
    const deleteProfessional = (professionalId) => {
        toast.loading("Deleting professional...");
        fetch(`https://project-phase-4-1.onrender.com/professionals/${professionalId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then((resp) => resp.json())
        .then((response) => {
            toast.dismiss();
            if (response.success) {
                toast.success("Professional deleted successfully");
                fetchProfessionals(); // Reload professionals list after deletion
            } else {
                toast.error(response.error || "Failed to delete professional");
            }
        });
    };

    return (
        <ProfessionalContext.Provider value={{
            professionals,
            loading,
            addProfessional,
            updateProfessional,
            deleteProfessional
        }}>
            {children}
        </ProfessionalContext.Provider>
    );
};
export default ProfessionalContext;