import Cookies from 'js-cookie';
import personas from "./personas";
const initialPersona = () => {
    const savedPersona = Cookies.get('selectedPersona');
    if (savedPersona) {
        const persona = JSON.parse(savedPersona);
        const matchedPersona = personas.find(p => p.name === persona.name);
        return matchedPersona || personas[0]; // Return the matched persona or default to the first one
    }
    return personas[0]; // Default to the first persona if there's no cookie
};

export default initialPersona;