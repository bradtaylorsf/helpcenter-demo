// ./src/lib/pinecone.js
require('dotenv').config();
const { createClient } = require('contentful');
const OpenAI = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');
const { documentToPlainTextString } = require('@contentful/rich-text-plain-text-renderer');

const INDEX_NAME = "answerai-demo-sandbox";
const NAMESPACE = "helpcenter-demo";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const contentfulClient = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

const pinecone = new Pinecone();

async function fetchEntriesForContentType(contentType) {
    try {
        const response = await contentfulClient.getEntries({
            content_type: contentType
        });
        console.log(`Article Titles for ${contentType}:`);
        return response.items;
    } catch (error) {
        console.error(error);
    }
}

async function upsertToPinecone(documents, index) {
    try {
        await index.upsert(documents);
        console.log("Upserted a batch of documents to Pinecone");
    } catch (error) {
        console.error("Error upserting document batch:", error);
    }
}

async function processEntries(contentType, index) {
    const entries = await fetchEntriesForContentType(contentType);
    let pineconeDocumentsBatch = [];

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const content = documentToPlainTextString(entry.fields.articleContent || entry.fields.body);
        const response = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: content,
        });

        if (
            !response ||
            !response.data ||
            !response.data[0] ||
            !response.data[0].embedding
        ) {
            console.error("Unexpected response from the OpenAI API:", response);
            continue;
        }

        const embedding = response.data[0].embedding;
        const metadata = {
            text: content,
        };

        // Only add properties that have a "truthy" value or customize as per your definition of having a value
        Object.keys(entry.fields).forEach(key => {
            if (entry.fields[key] && key !== 'body' && key != 'articleContent') { // This checks for "truthy" values; adjust if you need to check for specific conditions (e.g., not just an empty string but also not null)
                metadata[key] = entry.fields[key];
            }
        });


        pineconeDocumentsBatch.push({
            id: `entry_${entry.sys.id}`,
            values: embedding,
            metadata,
        });

        // Check if the batch size has reached 100
        if (pineconeDocumentsBatch.length === 20) {
            console.log("Upserting a batch of documents to Pinecone... ", pineconeDocumentsBatch.length);
            await upsertToPinecone(pineconeDocumentsBatch, index);
            pineconeDocumentsBatch = []; // Reset the batch
        }
    }

    // Upsert any remaining documents in the batch
    if (pineconeDocumentsBatch.length > 0) {
        await upsertToPinecone(pineconeDocumentsBatch, index);
    }
}

async function main() {
    // ... initialization code ...
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });

    const indexName = INDEX_NAME;

    // Check if the index already exists
    const index = pinecone.index(indexName).namespace(NAMESPACE);

    await processEntries('ripplingHelpArticle', index);
    await processEntries('helpCenterArticle', index);
    console.log("Contentful entries processed successfully");
}

main().catch((error) =>
    console.error("Error processing Contentful Entries files:", error)
);
