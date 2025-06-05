import React from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// --- Brand Palette & Typography ---
const brandColors = {
  deepIndigo: '#2A2A4A',
  electricTeal: '#00C2C2',
  brightCoral: '#FF6B6B',
  softGold: '#FFD166',
  offWhite: '#F8F8F8',
  mediumGray: '#A0A0A0',
  darkGray: '#505050',
};

const fontFamily = "'Inter', sans-serif"; // Ensure Inter is loaded in your project

// --- Animation Variants ---
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

// --- Styles (using JS objects for simplicity) ---
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    fontFamily,
    backgroundColor: brandColors.deepIndigo,
    color: brandColors.offWhite,
    overflowX: 'hidden',
  },
  navbar: {
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(42, 42, 74, 0.8)', // Slightly transparent Deep Indigo
    backdropFilter: 'blur(10px)',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
    boxSizing: 'border-box',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: brandColors.electricTeal,
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: brandColors.offWhite,
    textDecoration: 'none',
    fontSize: '16px',
  },
  section: {
    padding: '100px 40px',
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    position: 'relative',
  },
  heroSection: {
    minHeight: '100vh',
    paddingTop: '120px', // Account for fixed navbar
    background: `linear-gradient(rgba(42, 42, 74, 0.7), rgba(42, 42, 74, 0.9)), url('/index6.jpeg') no-repeat center center/cover`, // Using index6.jpeg for hero background
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    fontWeight: 'bold',
    color: brandColors.offWhite,
    marginBottom: '20px',
    lineHeight: 1.2,
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
    color: brandColors.mediumGray,
    maxWidth: '700px',
    marginBottom: '40px',
    lineHeight: 1.6,
  },
  ctaButton: {
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: brandColors.deepIndigo,
    backgroundColor: brandColors.electricTeal,
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  howItWorksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '40px',
    maxWidth: '1200px',
    width: '100%',
    marginTop: '60px',
  },
  howItWorksCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '30px',
    borderRadius: '15px',
    border: `1px solid ${brandColors.electricTeal}33`,
  },
  iconPlaceholder: {
    fontSize: '48px',
    marginBottom: '20px',
    color: brandColors.electricTeal,
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: brandColors.softGold,
    marginBottom: '15px',
  },
  cardText: {
    fontSize: '16px',
    color: brandColors.mediumGray,
    lineHeight: 1.6,
  },
  brandPromiseText: {
    fontSize: 'clamp(1.1rem, 3vw, 1.8rem)',
    color: brandColors.offWhite,
    maxWidth: '800px',
    lineHeight: 1.7,
    fontStyle: 'italic',
  },
  footer: {
    padding: '40px',
    textAlign: 'center',
    backgroundColor: brandColors.darkGray,
    color: brandColors.mediumGray,
    fontSize: '14px',
  },
  sectionTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 'bold',
    color: brandColors.offWhite,
    marginBottom: '20px',
    position: 'relative',
  },
  sectionSubtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    color: brandColors.mediumGray,
    maxWidth: '700px',
    marginBottom: '60px',
  },
  carouselContainer: {
    width: '100%',
    maxWidth: '1000px', // Adjust as needed
    height: '500px', // Adjust as needed, or make aspect ratio based
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '15px',
    backgroundColor: 'rgba(0,0,0,0.2)', // Slight background for the carousel area
    marginTop: '40px',
  },
  carouselImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
};

// --- Placeholder Components ---
const Navbar: React.FC = () => (
  <motion.nav style={styles.navbar} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
    <div style={styles.logo}>FindingLyra</div>
    <div style={styles.navLinks}>
      {/* Placeholder links - replace with actual navigation */} 
      <a href="#how-it-works" style={styles.navLink}>How It Works</a>
      <a href="#features" style={styles.navLink}>Features</a>
      <a href="#join" style={styles.navLink}>Join</a>
    </div>
  </motion.nav>
);

const Footer: React.FC = () => (
  <footer style={styles.footer}>
    © {new Date().getFullYear()} FindingLyra. All rights reserved. Connect Your Universe.
    {/* Add social media links or other footer content here */}
  </footer>
);

// --- Image Data for Carousels ---
const appShowcaseImages = [
  '/index8.jpeg',
  '/index9.jpeg',
  '/index10.jpeg',
];

const lifestyleImages = [
  '/index11.jpeg',
  '/index12.jpeg',
  '/index13.jpeg',
];

// --- Section Components ---
const HeroSection: React.FC = () => {
  const { scrollYProgress } = useScroll();
  // Parallax for a potential background image/element if you add one
  const yParallax = useTransform(scrollYProgress, [0, 0.3], [0, -100]); // Adjust range as needed

  return (
    <motion.section 
      style={{...styles.section, ...styles.heroSection}} 
      id="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          // Example: background: 'url(/path-to-subtle-star-animation.svg)', 
          // For now, a subtle gradient animation could be an option or keep it static
          opacity: 0.3, // Increased opacity for visibility if it's a subtle pattern
          zIndex: -1, 
          y: yParallax // Apply parallax
        }}
        // Example animation for a background element if it were an SVG
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 0.3, transition: { delay: 0.5, duration: 1 } }}
      />
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.h1 style={styles.heroTitle} variants={fadeIn}>Connect Through Sound & Stars</motion.h1>
        <motion.p style={styles.heroSubtitle} variants={fadeIn}>
          Findinglyra is where your playlist meets your person. Discover genuine connections forged in the heart of music and cosmic alignment.
        </motion.p>
        <motion.a 
          href="#join" 
          style={styles.ctaButton} 
          variants={fadeIn}
          whileHover={{ scale: 1.05, boxShadow: `0px 0px 15px ${brandColors.electricTeal}` }}
          whileTap={{ scale: 0.95 }}
        >
          Find Your Harmony
        </motion.a>
      </motion.div>
    </motion.section>
  );
};

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: '🎵', // Placeholder Icon: Music Note / Sound Wave
      title: 'Share Your Sound',
      text: 'Connect your music world or tell us your favorite tunes. Let your true rhythm shine and reveal your unique sonic identity.',
    },
    {
      icon: '✨', // Placeholder Icon: Intertwined Stars / Score Gauge
      title: 'Unlock Your Harmony',
      text: 'Our Harmony Score & AI insights reveal deep compatibility. See who truly gets your vibe, guided by music and cosmic alignment.',
    },
    {
      icon: '💬', // Placeholder Icon: Chat Bubbles with Music / Concert Tickets
      title: 'Ignite Your Spark',
      text: 'Match, chat, and explore real-world experiences. From shared playlists to concert buddies, your journey starts here.',
    },
  ];

  return (
    <motion.section 
      style={styles.section} 
      id="how-it-works"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2 style={styles.sectionTitle} variants={fadeIn}>How Findinglyra Works</motion.h2>
      <motion.p style={styles.sectionSubtitle} variants={fadeIn}>
        Discovering your cosmic connection is simple. Follow these steps to start your journey towards harmonious relationships.
      </motion.p>
      <motion.div style={styles.howItWorksGrid} variants={staggerContainer}>
        {steps.map((step, index) => (
          <motion.div key={index} style={styles.howItWorksCard} variants={fadeIn}>
            <div style={styles.iconPlaceholder}>{step.icon}</div>
            <h3 style={styles.cardTitle}>{step.title}</h3>
            <p style={styles.cardText}>{step.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

// Optional: Brief Features Highlight Section (can be expanded or removed)
const FeaturesHighlightSection: React.FC = () => (
  <motion.section 
    style={{...styles.section, backgroundColor: brandColors.darkGray}} 
    id="features"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6 }}
  >
    <motion.h2 style={styles.sectionTitle} variants={fadeIn}>Features That Resonate</motion.h2>
    <motion.p style={styles.sectionSubtitle} variants={fadeIn}>
      Explore a universe of features designed to deepen connections and celebrate your shared love for music.
    </motion.p>
    {/* Placeholder for feature items - could be a grid or list */}
    <motion.div style={{color: brandColors.mediumGray}} variants={fadeIn}>
      Musical Journey Timelines, Collaborative Playlists, Concert Buddy Finder, and more coming soon!
    </motion.div>
  </motion.section>
);

const BrandPromiseSection: React.FC = () => (
  <motion.section 
    style={styles.section} 
    id="promise"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.8 }}
  >
    <motion.h2 style={styles.sectionTitle} variants={fadeIn}>Beyond Superficial Swipes</motion.h2>
    <motion.p style={styles.brandPromiseText} variants={fadeIn}>
      "Findinglyra is more than an app; it's a community, a journey, a discovery. We believe in the power of music to unite and the cosmos to guide. Find your frequency, find your constellation."
    </motion.p>
  </motion.section>
);

const AppShowcaseSection: React.FC = () => {
  const sectionRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'] // Trigger animation when section is in viewport
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [-100, 100]); // Adjust parallax range as needed
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // New variants for staggered entrance
  const sectionContentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Time between each child animating in
        delayChildren: 0.2,   // Optional delay before children start animating
      },
    },
  };

  const itemFadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const carouselScaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }, // Custom ease for a nice pop
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === appShowcaseImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Slide every 4 seconds
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <motion.section 
      ref={sectionRef}
      style={{...styles.section, backgroundColor: brandColors.darkGray, y: yParallax }} 
      id="app-showcase"
      initial="hidden" // Set initial state for the parent container
      whileInView="visible" // Trigger animation when in view
      viewport={{ once: true, amount: 0.2 }} // Animate once, when 20% is visible
      variants={sectionContentVariants} // Apply stagger container variants
    >
      <motion.h2 style={styles.sectionTitle} variants={itemFadeInUp}>App Sneak Peek</motion.h2>
      <motion.p style={styles.sectionSubtitle} variants={itemFadeInUp}>
        Get a glimpse of the intuitive and beautiful interface designed to help you find your match.
      </motion.p>
      <motion.div style={styles.carouselContainer} variants={carouselScaleIn}>
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.img
            key={currentIndex} // Important for AnimatePresence to detect changes
            src={appShowcaseImages[currentIndex]}
            alt={`App Screenshot ${currentIndex + 1}`}
            style={styles.carouselImage}
            custom={currentIndex} // Can be used for directing animation if needed
            initial={{ opacity: 0, x: 300 }} // Slide in from right
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }} // Slide out to left
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.5 } }}
          />
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
};

const LifestyleInspirationSection: React.FC = () => {
  const sectionRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [-100, 100]); // Adjust parallax range as needed
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Variants for staggered entrance (copied from AppShowcaseSection for consistency)
  const sectionContentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemFadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const carouselScaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === lifestyleImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <motion.section 
      ref={sectionRef}
      style={{...styles.section, y: yParallax}} 
      id="lifestyle-inspiration"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionContentVariants} // Apply stagger container variants
    >
      <motion.h2 style={styles.sectionTitle} variants={itemFadeInUp}>Vibe & Connections</motion.h2>
      <motion.p style={styles.sectionSubtitle} variants={itemFadeInUp}>
        Immerse yourself in the experiences and connections that await.
      </motion.p>
      <motion.div style={styles.carouselContainer} variants={carouselScaleIn}>
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.img
            key={currentIndex}
            src={lifestyleImages[currentIndex]}
            alt={`Lifestyle Image ${currentIndex + 1}`}
            style={styles.carouselImage}
            custom={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.5 } }}
          />
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
};

const CallToActionSection: React.FC = () => (
  <motion.section 
    style={{...styles.section, backgroundColor: brandColors.electricTeal}} 
    id="join"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.8 }}
  >
    <motion.h2 style={{...styles.sectionTitle, color: brandColors.deepIndigo}} variants={fadeIn}>Ready to Find Your Rhythm?</motion.h2>
    <motion.p style={{...styles.sectionSubtitle, color: brandColors.deepIndigo + 'dd', marginBottom: '40px'}} variants={fadeIn}>
      Join the Findinglyra beta and be among the first to experience a new wave of connection.
    </motion.p>
    <motion.a 
      href="/signup" // Assuming a signup route
      style={{...styles.ctaButton, backgroundColor: brandColors.deepIndigo, color: brandColors.offWhite}}
      variants={fadeIn}
      whileHover={{ scale: 1.05, boxShadow: `0px 0px 20px ${brandColors.softGold}` }}
      whileTap={{ scale: 0.95 }}
    >
      Join the Beta
    </motion.a>
  </motion.section>
);

// --- Main Homepage Component ---

const Homepage: React.FC = () => {
  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <AppShowcaseSection />
        <FeaturesHighlightSection />
        <LifestyleInspirationSection />
        <BrandPromiseSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
