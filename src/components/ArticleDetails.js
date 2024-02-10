// pages/article/[id].js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import PersonaPicker from './PersonaPicker';
import initialPersona from '../lib/initialPersona';
import contentfulClient from '../lib/contentfulClient';

function Callout({ title, body, userPersona, location }) {
    const baseStyle = "border-l-4 p-4 my-4";
    let borderColorClass = "";

    // Assign border color based on userPersona and location
    if (userPersona === "Developer") {
        borderColorClass = "border-blue-500";
    } else if (userPersona === "Administrator") {
        borderColorClass = "border-green-500";
    }
    // Add more conditions for different userPersonas and locations as needed

    return (
        <div className={`${baseStyle} ${borderColorClass}`}>
            <h3 className="font-bold">{title}</h3>
            <p>{documentToReactComponents(body)}</p>
        </div>
    );
}

export default function Article() {
    const [article, setArticle] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query;

    const [selectedPersona, setSelectedPersona] = useState(initialPersona);

    const renderOptions = {
        renderNode: {
            [BLOCKS.EMBEDDED_ENTRY]: (node) => {
                const { title, body, location, userPersona } = node.data.target.fields;

                console.log("Selected Persona:", selectedPersona.userPersona, "Article User Persona:", userPersona);
                console.log("Selected Location:", selectedPersona.location, "Article Location:", location);

                // Check if the selected user persona is included in the article's userPersona array
                const personaMatches = userPersona && userPersona.includes(selectedPersona.userPersona);

                // Adjusted logic for locationMatches to account for unspecified location
                const locationMatches = !location || selectedPersona.location === location;

                // Additional check to ensure rendering only when both persona and location criteria are met
                // or when persona matches and location is not a limiting factor (not specified)
                if (personaMatches && locationMatches) {
                    return <Callout title={title} body={body} userPersona={userPersona} location={location} />;
                }

                // If the conditions are not met, return null to avoid rendering this component
                return null;
            }
        }
    };

    useEffect(() => {
        // Ensure the id is present (router.query might be initially empty)
        if (!id) {
            return;
        }

        // Fetch the article from Contentful using the ID
        contentfulClient.getEntry(id)
            .then((entry) => {
                setArticle(entry.fields);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, [id]); // This effect depends on `id` and runs whenever `id` changes

    if (isLoading) return <div>Loading...</div>;
    if (!article) return <p>Article not found</p>;

    return (

        <div className="max-w-4xl mx-auto px-4 py-8">
            <PersonaPicker onPersonaChange={setSelectedPersona} />
            <div className="prose max-w-none rich-text">
                <div className="mb-4">
                    <Link href="/">
                        ← Back to Articles
                    </Link>
                </div>
                <h1 className="text-2xl font-bold mb-4">{article.articleTitle}</h1>
                {documentToReactComponents(article.articleContent, renderOptions)}
            </div>
        </div>
    );
}
