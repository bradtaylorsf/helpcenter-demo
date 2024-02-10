import dynamic from 'next/dynamic';

const HomeWithNoSSR = dynamic(() => import('../../components/ArticleDetails'), {
    ssr: false, // Disable server-side rendering for this component
});

export default function ArticleDetails() {
    return <HomeWithNoSSR />;
}