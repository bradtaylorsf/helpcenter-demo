// ./src/components/Home.js
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import PersonaPicker from '../components/PersonaPicker';
import contentfulClient from '../lib/contentfulClient';
import initialPersona from '../lib/initialPersona';
import getChatflowConfig from '../lib/getChatflowConfig';
import getChatflowTheme from '../lib/getChatflowTheme';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import dynamic from 'next/dynamic';
const BubbleChat = dynamic(() => import('flowise-embed-react').then((mod) => ({ default: mod.BubbleChat })), {
  ssr: false,
});

const extractTagsFromRichText = (richTextDocument) => {
  let tags = [];
  console.log("Rich Text Document:", richTextDocument);
  const findTags = (node) => {
    if (node.nodeType === BLOCKS.EMBEDDED_ENTRY || node.nodeType === INLINES.EMBEDDED_ENTRY) {
      // Here, you would access the embedded entry and its tags
      // This is a simplified example; actual implementation may vary based on your content model
      const userPersonas = node.data.target.fields.userPersona || [];
      const locations = node.data.target.fields.location ? [node.data.target.fields.location] : [];
      tags = [...tags, ...userPersonas, ...locations];
    } else if (node.content) {
      node.content.forEach(findTags);
    }
  };

  findTags(richTextDocument);
  return tags;
};


export default function Home() {
  const [articles, setArticles] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(initialPersona);

  const chatflowConfig = getChatflowConfig(selectedPersona);
  const theme = getChatflowTheme(selectedPersona);


  useEffect(() => {
    contentfulClient.getEntries({ content_type: 'helpCenterArticle' })
      .then((response) => {
        const enrichedArticles = response.items.map(article => {
          const richTextDocument = article.fields.articleContent; // Assuming this is your rich text field
          const tags = extractTagsFromRichText(richTextDocument);
          return { ...article, extractedTags: tags };
        });
        setArticles(enrichedArticles);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Update the cookie whenever selectedPersona changes
    Cookies.set('selectedPersona', JSON.stringify(selectedPersona), { expires: 7 });
  }, [selectedPersona]);


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
      <PersonaPicker onPersonaChange={setSelectedPersona} />
      <h1 className="text-3xl font-bold text-center mb-10">Articles</h1>
      <ul className="space-y-4">
        {filteredArticles.map(article => (
          <li key={article.sys.id} className={`transition transform hover:scale-105 duration-300 ease-in-out bg-white shadow-lg rounded-lg p-6 border-4 ${getBorderColorClass(article.fields.planType)}`}>
            <Link href={`/article/${article.sys.id}`} className="text-2xl font-bold hover:text-blue-500">
              {article.fields.articleTitle}
            </Link>
            {/* Assuming tags are an array of strings under article.fields.tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {article.extractedTags?.map((tag, index) => (
                <span key={index} className="bg-gray-200 text-gray-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <BubbleChat chatflowid="0815d6ca-5a13-45a1-9694-b6f24d102214" apiHost="https://chatflow.theanswer.ai" theme={theme} chatflowConfig={chatflowConfig} />
    </div>
  );
}
