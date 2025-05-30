import React from 'react';

const HeroSection = () => {
  return (
    <div style={styles.wrapper}>
      {/* Sign In Button */}
      <button style={styles.signInBtn}>Sign In</button>

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
            <button style={styles.primaryBtn}>Start Learning Free</button>
            <button style={styles.secondaryBtn}>▶ Watch Intro Video</button>
          </div>

          {/* Features */}
          <ul style={styles.featureList}>
            <li>✔️ Courses curated by industry professionals</li>
            <li>✔️ Hands-on mock test & live assignments</li>
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
          <img
            src="/assets/youtube.png"
            alt="YouTube"
            style={{ ...styles.icon, top: '5%', right: '15%' }}
          />
          <img
            src="/assets/google-drive.png"
            alt="Drive"
            style={{ ...styles.icon, bottom: '5%', left: '15%' }}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    padding: '60px 20px',
    background: '#f5f6fa',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  signInBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: '10px 20px',
    backgroundColor: '#ff7a00',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
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
    color: '#ff7a00',
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
    backgroundColor: '#ff7a00',
    color: '#fff',
    padding: '12px 24px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
  },
  secondaryBtn: {
    backgroundColor: '#fff',
    color: '#1e1e2f',
    padding: '12px 24px',
    fontSize: '16px',
    border: '2px solid #1e1e2f',
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
    maxWidth: '350px',
    borderRadius: '20px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  },
  icon: {
    position: 'absolute',
    width: '40px',
    animation: 'bounce 2s infinite',
  },
};

export default HeroSection;
