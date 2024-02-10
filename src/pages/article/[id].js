// pages/article/[id].js
import { createClient } from 'contentful';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';

// Initialize Contentful client outside the component to avoid re-creating it on re-renders
const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

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


const renderOptions = {
    renderNode: {
        [BLOCKS.EMBEDDED_ENTRY]: (node) => {
            const { title, body, location, userPersona } = node.data.target.fields;
            return <Callout title={title} body={body} userPersona={userPersona} location={location} />;
        }
    }
};

export default function Article() {
    const [article, setArticle] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        // Ensure the id is present (router.query might be initially empty)
        if (!id) {
            return;
        }

        // Fetch the article from Contentful using the ID
        client.getEntry(id)
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
