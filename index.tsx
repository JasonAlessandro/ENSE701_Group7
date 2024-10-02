// src/pages/index.tsx
import Link from 'next/link';
import { FC } from 'react';

const Home: FC = () => {
  return (
    <div>
      <h1>Welcome to the Software Empirical Evidence Database (SPEED)</h1>
      <nav>
        <ul>
          <li>
            <Link href="/submit">Submit an Article</Link>
          </li>
          <li>
            <Link href="/moderation">Moderation</Link>
          </li>
          <li>
            <Link href="/analysis">Analysis</Link>
          </li>
          <li>
            <Link href="/search">Search Database</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
