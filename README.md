# AnswerAI Help Center Demo README

## Overview

This project is a Next.js demo for AnswerAI's Help Center, designed to showcase dynamic content personalization using Contentful as the CMS and integrating with an AI-powered chatbot. The demo illustrates how composable content can easily adapt to different user personas, plan types, and locations, enhancing the user experience with personalized content. This approach not only benefits the frontend display but also enriches the source data for an AI chatbot, making interactions more relevant and engaging.

### Features

- **Personalization:** Demonstrates content personalization based on user persona, plan type, and location.
- **Composable Content:** Utilizes Contentful to manage and deliver dynamic content.
- **AI Integration:** Shows how personalized content feeds into an AI-powered chatbot for tailored user interactions.
- **Persona Switching:** Allows users to change personas via a dropdown, reflecting different content and chatbot responses.
- **Content Memorization:** Includes a script for memorizing content in Pinecone, enhancing the chatbot's ability to deliver relevant information.

## Project Structure

### Key Components

- `src/components/Home.js`: The main page displaying personalized articles fetched from Contentful based on the selected persona.
- `pages/article/[id].js`: A dynamic route for individual articles, showcasing detailed content and integrating with the chatbot for interactive user support.
- `components/PersonaPicker.js`: A component for selecting user personas, influencing the displayed content and chatbot interactions.
- `src/lib/contentfulClient.js`: Initializes the Contentful client for fetching content.
- `src/lib/pinecone.js`: A script for processing and memorizing content in Pinecone, aiding the AI chatbot's functionality.

### Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/)
- **CMS:** [Contentful](https://www.contentful.com/)
- **AI:** [Flowise](https://github.com/FlowiseAI/Flowise) or [AnswerAI Enterprise](https://theanswer.ai/)
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js (LTS version)
- A Contentful account with a configured space for the help center articles
- An OpenAI API key for AI interactions
- A Pinecone account and API key for content memorization
- Flowise installed OR an AnswerAI Enterprise Account

### Setup

1. **Clone the repository:**

```bash
git clone <repository-url>
```

2. **Install dependencies:**

Using pnpm, install the project's dependencies.

```bash
cd <project-directory>
pnpm install
```

3. **Environment Configuration:**

Create a `.env.local` file in the root of your project directory and add the following variables with your own values:

```dotenv
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=<Your_Contentful_Space_ID>
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=<Your_Contentful_Access_Token>
OPENAI_API_KEY=<Your_OpenAI_API_Key>
PINECONE_API_KEY=<Your_Pinecone_API_Key>
```

4. Import the Workflow to Flowise or AnswerAI
-Follow the instructions here to install Flowise locally, or visit AnswerAI to signup for the enterprise beta.
- Create a new workflow, and in the upper right choose click on the gear. Here you can import the `Help Center Demo Chatflow.json` file.
- Attach your Pinecone and OpenAI API keys. 
- NOTE: The Contentful DocumentLoader is only on AnswerAI enterprise at the moment so you will need to load the content into Pinecone yourself if using Flowise. 

5. **Running the project locally:**

To start the development server, run:

```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser to view the application.

### Using the Demo

- **Switch Personas:** Use the persona picker dropdown to switch between different user personas.
- **View Articles:** Browse through the personalized articles fetched based on the selected persona's preferences.
- **Interact with the Chatbot:** Access detailed article pages to engage with the AI-powered chatbot, which provides tailored responses.

## Content Management with Contentful

This demo uses Contentful for managing help center articles. Each article is tagged with metadata such as user personas, plan types, and locations to support personalization.

### Content Model

- **Article:** Contains fields for the title, content (rich text), tags (user personas, plan types, locations), etc.

## AI and Personalization Script

The `pinecone.js` script processes articles from Contentful, extracting plain text and generating embeddings using OpenAI's API. These embeddings, along with the article metadata, are then memorized in Pinecone, enabling the AI chatbot to provide relevant, personalized responses.

## Contributing

Contributions are welcome! If you have suggestions or want to improve the demo, please feel free to fork the repository, make changes, and submit a pull request.

## License

This project is open-source and available under the [MIT License](LICENSE).

---

This README aims to provide a comprehensive guide to setting up and exploring the AnswerAI Help Center demo. For further assistance or feedback, please open an issue in the project repository.