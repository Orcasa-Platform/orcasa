import Home from '@/components/home';

export default async function HomePage() {
  return <Home />;
}

// By default Next.js caches data fetches on server-side components indefinitely. There is a way to
// configure the behaviour with options passed to the Fetch API but since we're using Axios, the
// only way is to set this value on the homepage.
// What it means is that Next.js should not cache requests made in server-side components more than
// 10 minutes.
export const revalidate = 600;
