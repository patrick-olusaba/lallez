import React from 'react';
import Slideshow from '../components/Slideshow';
import WorkGrid from '../components/WorkGrid';
import './Home.css';

const Home: React.FC = () => {
  return (
    <main className="page-home">
      <Slideshow />
      <WorkGrid />
    </main>
  );
};

export default Home;
