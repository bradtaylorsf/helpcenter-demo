// pages/article/[id].js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import PersonaPicker from './PersonaPicker';
import initialPersona from '../lib/initialPersona';
import contentfulClient from '../lib/contentfulClient';
import getChatflowConfig from '../lib/getChatflowConfig';
import getChatflowTheme from '../lib/getChatflowTheme';
import dynamic from 'next/dynamic';
const BubbleChat = dynamic(() => import('flowise-embed-react').then((mod) => ({ default: mod.BubbleChat })), {
    ssr: false,
});

function Callout({ title, body, userPersona, location }) {
    const baseStyle = "border-l-4 p-4 my-4";

    return (
        <div className={`${baseStyle}`}>
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

    const chatflowConfig = getChatflowConfig(selectedPersona);
    const theme = getChatflowTheme(selectedPersona);

    const renderOptions = {
        renderNode: {
            [BLOCKS.EMBEDDED_ENTRY]: (node) => {
                const { title, body, location, userPersona } = node.data.target.fields;

                console.log("Selected Persona:", selectedPersona.userPersona, "Article User Persona:", userPersona);
                console.log("Selected Location:", selectedPersona.location, "Article Location:", location);

                // Check if the selected user persona is included in the article's userPersona array
                const personaMatches = userPersona && userPersona.includes(selectedPersona.userPersona);

                // Adjusted logic for locationMatches to account for unspecified location
                debugger;
                const locationMatches = location && selectedPersona.location === location;

                // Additional check to ensure rendering only when both persona and location criteria are met
                // or when persona matches and location is not a limiting factor (not specified)
                if (personaMatches || locationMatches) {
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
            <BubbleChat chatflowid="0815d6ca-5a13-45a1-9694-b6f24d102214" apiHost="https://chatflow.theanswer.ai" theme={theme} chatflowConfig={chatflowConfig} />
        </div>
    );
}
