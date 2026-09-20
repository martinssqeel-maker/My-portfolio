import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ManualNoticeModal from './components/ManualNoticeModal';

export default function App() {
  return (
    <div className="min-h-screen bg-[#090a0d] text-[#eceef2] flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1 w-full">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Subtle Data Config Helper */}
      <ManualNoticeModal />
    </div>
  );
}
