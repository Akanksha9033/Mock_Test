import React from 'react';
import { Link } from 'react-router-dom';
 
const cardImages = [
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
  'https://images.pexels.com/photos/4145196/pexels-photo-4145196.jpeg',
  'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
  'https://images.pexels.com/photos/5212346/pexels-photo-5212346.jpeg',
  'https://images.pexels.com/photos/6334095/pexels-photo-6334095.jpeg',
];
 
const HomePage = () => {
  return (
    <div style={styles.wrapper}>
      <Link to="/signin" style={{ textDecoration: 'none' }}>
        <button style={styles.signInBtn}>Sign In</button>
      </Link>
 
      <div style={styles.overlay}>
        <div style={styles.container}>
          {/* LEFT */}
          <div style={styles.left}>
            <h1 style={styles.heading}>
              Learn with <span style={styles.brand}>Edzest</span>
            </h1>
            <p style={styles.subheading}>
              Build your job-ready AI habit with hands-on tests, practical skills, and expert mentorship.
            </p>
 
            <ul style={styles.benefitsList}>
              <li>✅ Interactive mock tests to measure progress</li>
              <li>✅ Personalized AI-powered learning plans</li>
              <li>✅ Expert mentors available 24/7</li>
              <li>✅ Community forums for peer learning</li>
              <li>✅ Mobile and desktop friendly platform</li>
            </ul>
 
            <Link to="/signin" style={{ textDecoration: 'none' }}>
              <button style={styles.primaryBtn}>Start Learning →</button>
            </Link>
          </div>
 
          {/* RIGHT - 3D Carousel */}
          <div style={styles.right}>
            <div className="carousel3d">
              {cardImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`card-${index}`}
                  className="card3d"
                  style={{
                    transform: `rotateY(${index * (360 / cardImages.length)}deg) translateZ(500px)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
 
      {/* ✨ 3D Carousel Styles */}
      <style>{`
        .carousel3d {
          width: 100%;
          height: 500px;
          position: relative;
          transform-style: preserve-3d;
          animation: spin 25s linear infinite;
          transform-origin: center center;
          perspective: 1200px;
        }
 
        .card3d {
          position: absolute;
          width: 280px;
          height: 420px;
          object-fit: cover;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          transition: transform 0.5s ease, box-shadow 0.5s ease;
        }
 
        .card3d:hover {
          transform: scale(1.1) translateZ(60px);
          z-index: 2;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7);
        }
 
        @keyframes spin {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }
 
        @media (max-width: 768px) {
          .card3d {
            width: 200px;
            height: 300px;
          }
 
          .carousel3d {
            height: 400px;
          }
        }
      `}</style>
    </div>
  );
};
 
const styles = {
  wrapper: {
    background: 'linear-gradient(120deg, #2f3aa0, #6b8de3)',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: `'Segoe UI', sans-serif`,
    color: '#fff',
  },
  signInBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: '10px 20px',
    backgroundColor: '#fff',
    color: '#4748ac',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    zIndex: 100,
  },
  overlay: {
    width: '100%',
    height: '100%',
    padding: '60px 20px',
    boxSizing: 'border-box',
  },
  container: {
    maxWidth: '1300px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: '1',
    minWidth: '320px',
    paddingRight: '30px',
  },
  heading: {
    fontSize: '44px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '20px',
    lineHeight: '1.2',
  },
  brand: {
    color: '#ffd700',
  },
  subheading: {
    fontSize: '18px',
    color: '#ddd',
    marginBottom: '25px',
    maxWidth: '500px',
  },
  benefitsList: {
    marginBottom: '40px',
    maxWidth: '500px',
    paddingLeft: '20px',
    color: '#e1e1f7',
    fontSize: '16px',
    lineHeight: '1.6',
  },
  primaryBtn: {
    backgroundColor: '#fff',
    color: '#4748ac',
    padding: '14px 28px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  right: {
    flex: '1',
    minWidth: '350px',
    height: '480px',
    overflow: 'hidden',
    position: 'relative',
  },
};
 
export default HomePage;