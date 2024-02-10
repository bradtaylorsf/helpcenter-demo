import { createClient } from 'contentful';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

const personas = [
  { name: "Techie Tim", userPersona: "Developer", planType: "Enterprise Plan", location: "North America" },
  { name: "Analytical Amy", userPersona: "Analyst", planType: "Team Plan", location: "Europe" },
  { name: "User-focused Uma", userPersona: "User", planType: "Free Plan", location: "Asia-Pacific" },
  { name: "Admin Alex", userPersona: "Administrator", planType: "Team Plan", location: "Latin America" },
  { name: "DevOps Dani", userPersona: "Developer", planType: "Enterprise Plan", location: "Middle East & Africa" },
];

export default function Home() {
  const [articles, setArticles] = useState([]);

  // Try to read the saved persona from the cookie at the initial state setup
  const initialPersona = () => {
    const savedPersona = Cookies.get('selectedPersona');
    if (savedPersona) {
      const persona = JSON.parse(savedPersona);
      const matchedPersona = personas.find(p => p.name === persona.name);
      return matchedPersona || personas[0]; // Return the matched persona or default to the first one
    }
    return personas[0]; // Default to the first persona if there's no cookie
  };

  const [selectedPersona, setSelectedPersona] = useState(initialPersona);

  useEffect(() => {
    // Fetch articles from Contentful
    client.getEntries({ content_type: 'helpCenterArticle' })
      .then((response) => setArticles(response.items))
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Update the cookie whenever selectedPersona changes
    Cookies.set('selectedPersona', JSON.stringify(selectedPersona), { expires: 7 });
  }, [selectedPersona]);


  const handlePersonaChange = (event) => {
    const persona = personas.find(p => p.name === event.target.value);
    console.log("New selected persona:", persona);
    setSelectedPersona(persona);
  };

  const filteredArticles = selectedPersona ? articles.filter(article => {
    // Check if the selected persona's planType is included in the article's planType array
    // This assumes article.fields.planType is an array as mentioned
    const articlePlanTypes = article.fields.planType; // This should be an array according to your description

    if (selectedPersona.planType === "Enterprise Plan") return true; // Show all articles for Enterprise Plan
    // For other plan types, check if the article's planType array includes the selectedPersona's planType
    return articlePlanTypes.includes(selectedPersona.planType);
  }) : [];



  const getBorderColorClass = (planTypes) => {
    if (planTypes.includes('Free Plan')) {
      return 'border-blue-200'; // Light blue for Free
    } else if (planTypes.includes('Team Plan')) {
      return 'border-blue-400'; // Medium blue for Team
    } else if (planTypes.includes('Enterprise Plan')) {
      return 'border-blue-800'; // Dark blue for Enterprise
    }
    return 'border-gray-200'; // Default border color
  };


  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">Articles</h1>
      <div className="mb-6">
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
      <ul className="space-y-4">
        {filteredArticles.map(article => (
          <li key={article.sys.id} className={`transition transform hover:scale-105 duration-300 ease-in-out bg-white shadow-lg rounded-lg p-6 border-4 ${getBorderColorClass(article.fields.planType)}`}>
            <Link href={`/article/${article.sys.id}`} className="text-2xl font-bold hover:text-blue-500">

              {article.fields.articleTitle}
            </Link>
            {/* Assuming tags are an array of strings under article.fields.tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {article.fields.tags?.map((tag, index) => (
                <span key={index} className="bg-gray-200 text-gray-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
