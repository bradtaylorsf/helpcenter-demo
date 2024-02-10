// components/PersonaPicker.js
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const personas = [
    { name: "Techie Tim", userPersona: "Developer", planType: "Enterprise Plan", location: "North America" },
    { name: "Analytical Amy", userPersona: "Analyst", planType: "Team Plan", location: "Europe" },
    { name: "User-focused Uma", userPersona: "User", planType: "Free Plan", location: "Asia-Pacific" },
    { name: "Admin Alex", userPersona: "Administrator", planType: "Team Plan", location: "Latin America" },
    { name: "DevOps Dani", userPersona: "Developer", planType: "Enterprise Plan", location: "Middle East & Africa" },
];

const PersonaPicker = ({ onPersonaChange }) => {
    const initialPersona = () => {
        const savedPersona = Cookies.get('selectedPersona');
        return savedPersona ? JSON.parse(savedPersona) : personas[0];
    };

    const [selectedPersona, setSelectedPersona] = useState(initialPersona);

    useEffect(() => {
        Cookies.set('selectedPersona', JSON.stringify(selectedPersona), { expires: 7 });
        if (onPersonaChange) {
            onPersonaChange(selectedPersona);
        }
    }, [selectedPersona]);

    const handlePersonaChange = (event) => {
        const newPersona = personas.find(p => p.name === event.target.value);
        setSelectedPersona(newPersona);
    };

    return (
        <div className="persona-picker">
            <select onChange={handlePersonaChange} value={selectedPersona ? selectedPersona.name : ''} className="form-select block w-full mt-1">
                {personas.map((persona) => (
                    <option key={persona.name} value={persona.name}>{persona.name}</option>
                ))}
            </select>
            {selectedPersona && (
                <div className="mt-4">
                    <p><strong>Selected Persona:</strong> {selectedPersona.name}</p>
                    <p><strong>Role:</strong> {selectedPersona.userPersona}</p>
                    <p><strong>Plan Type:</strong> {selectedPersona.planType}</p>
                    <p><strong>Location:</strong> {selectedPersona.location}</p>
                </div>
            )}
        </div>
    );
};

export default PersonaPicker;
