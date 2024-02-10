import dynamic from 'next/dynamic';

const HomeWithNoSSR = dynamic(() => import('../components/Home'), {
    ssr: false, // Disable server-side rendering for this component
});

export default function HomePage() {
    return <HomeWithNoSSR />;
}