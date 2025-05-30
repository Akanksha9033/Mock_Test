import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={styles.wrapper}>
      {/* Sign In Button */}
      <Link to="/signin" style={{ textDecoration: 'none' }}>
        <button style={styles.signInBtn}>Sign In</button>
      </Link>

      <div style={styles.overlay}>
        <div style={styles.container}>
          {/* LEFT CONTENT */}
          <div style={styles.left}>
            <h1 style={styles.heading}>
              Learn with <span style={styles.brand}>Edzest</span> from anywhere.
            </h1>
            <p style={styles.subheading}>
              Master job-ready skills at your own pace through live mock tests, practice sets, and expert mentorship.
            </p>

            {/* Buttons */}
            <div style={styles.buttonGroup}>
              <Link to="/signin" style={{ textDecoration: 'none' }}>
                <button style={styles.primaryBtn}>Start Learning Free</button>
              </Link>
            </div>

            {/* Features */}
            <ul style={styles.featureList}>
              <li>✔️ Courses curated by industry professionals</li>
              <li>✔️ Hands-on mock tests & live assignments</li>
              <li>✔️ Personal mentorship & doubt support</li>
            </ul>
          </div>

          {/* RIGHT IMAGE */}
          <div style={styles.right}>
            <img
              src="/assets/hero-edzest-student.png"
              alt="Edzest student"
              style={styles.heroImage}
            />

            {/* YouTube Icon */}
            <a href="https://www.youtube.com/@edzest" target="_blank" rel="noopener noreferrer">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
                alt="YouTube"
                style={{ ...styles.icon, top: '5%', right: '10%' }}
              />
            </a>

            {/* LinkedIn Icon */}
            <a href="https://www.linkedin.com/company/edzest" target="_blank" rel="noopener noreferrer">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                alt="LinkedIn"
                style={{ ...styles.icon, bottom: '5%', right: '10%' }}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundImage: 'url("/assets/hero-bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
 overlay: {
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(8px)',
  width: '100%',
  height: '100%',
  padding: '60px 20px',
  boxSizing: 'border-box',
},

  signInBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: '10px 20px',
    backgroundColor: '#4748ac',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    zIndex: 2,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: '1',
    minWidth: '300px',
    paddingRight: '20px',
  },
  heading: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#1e1e2f',
    marginBottom: '20px',
  },
  brand: {
    color: '#4748ac',
  },
  subheading: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '30px',
    maxWidth: '500px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    backgroundColor: '#4748ac',
    color: '#fff',
    padding: '12px 24px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    color: '#444',
    fontSize: '16px',
    lineHeight: '1.8',
  },
  right: {
    flex: '1',
    minWidth: '300px',
    position: 'relative',
    textAlign: 'center',
  },
  heroImage: {
    maxWidth: '420px',
    borderRadius: '20px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  },
  icon: {
    position: 'absolute',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    transition: 'transform 0.3s',
    cursor: 'pointer',
  },
};

export default HomePage;
