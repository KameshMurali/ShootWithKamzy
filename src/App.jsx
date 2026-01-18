import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import FloatingThemeToggle from './components/FloatingThemeToggle';
import './App.css';

function App() {
  useEffect(() => {
    // Disable right-click context menu globally
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable drag and drop for images
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu, false);
    document.addEventListener('dragstart', handleDragStart, false);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, false);
      document.removeEventListener('dragstart', handleDragStart, false);
    };
  }, []);

  return (
    <>
      {/* Top Navigation */}
      <Navigation />

      {/* Floating, draggable theme toggle (global control) */}
      <FloatingThemeToggle />

      {/* Main content */}
      <main>
        <Hero />
        <Carousel />
        <Services />
        <About />
        <Contact />
      </main>
    </>
  );
}

export default App;
