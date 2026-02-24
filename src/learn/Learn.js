import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LearnHome from './pages/LearnHome';
import LearnDetails from './pages/LearnDetails';
import ExamWinner from './pages/ExamWinner';
import SEO from '../components/SEO';

function Learn() {
  return (
    <>
      <SEO 
  title="Pixovia Learn - Free Educational Content"
  description="Access free educational content, courses, and tutorials on Pixovia Learn."
  keywords="free education, online courses, tutorials, learning"
  url="https://pixovia.pages.dev/learn"
/>

      <Routes>
        <Route path="/" element={<LearnHome />} />
        <Route path="/:id" element={<LearnDetails />} />
        <Route path="/examwinner" element={<ExamWinner />} />
      </Routes>
    </>
  );
}

export default Learn;
