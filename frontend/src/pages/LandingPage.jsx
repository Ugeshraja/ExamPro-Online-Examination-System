import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Cpu, Trophy, Clock, CheckSquare, Award } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShieldCheck size={28} color="var(--color-primary-400)" />,
      title: "AI Proctoring Guard",
      desc: "Tab switch limits, fullscreen enforcement, and disabled copy-paste to ensure absolute academic integrity."
    },
    {
      icon: <Cpu size={28} color="var(--color-primary-400)" />,
      title: "Smart MCQs Generator",
      desc: "Randomized questions and options tailored for each candidate, preventing neighboring candidate collusion."
    },
    {
      icon: <Trophy size={28} color="var(--color-primary-400)" />,
      title: "Competitive Leaderboard",
      desc: "Real-time rank updates based on exam scores and percentage, driving students to excel."
    },
    {
      icon: <Clock size={28} color="var(--color-primary-400)" />,
      title: "Automated Timer Control",
      desc: "Smart timers that autosave state every second and auto-submit the exam upon expiration."
    },
    {
      icon: <CheckSquare size={28} color="var(--color-primary-400)" />,
      title: "Instant Results Sheet",
      desc: "Detailed score metrics mapping correct, wrong, and skipped questions immediately upon completion."
    },
    {
      icon: <Award size={28} color="var(--color-primary-400)" />,
      title: "PDF Certificates",
      desc: "Seamless scorecard downloads for portfolios, job postings, or academic credentials."
    }
  ];

  return (
    <div className="animate-fade" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '80px',
      alignItems: 'center',
      minHeight: '100vh',
      justifyContent: 'center'
    }}>
      {/* Hero Section */}
      <header className="glass-card" style={{
        textAlign: 'center',
        padding: '60px 40px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)'
      }}>
        <div style={{
          padding: '8px 16px',
          borderRadius: '9999px',
          background: 'rgba(37, 99, 235, 0.1)',
          border: '1px solid rgba(37, 99, 235, 0.2)',
          color: 'var(--color-primary-400)',
          fontWeight: '600',
          fontSize: '0.85rem',
          letterSpacing: '0.05em'
        }}>
          PRODUCTION-QUALITY EXAMINATION ENVIRONMENT
        </div>

        <h1 style={{
          fontSize: '3.5rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: '800',
          lineHeight: '1.1',
          maxWidth: '800px',
          background: 'linear-gradient(to right, #ffffff, var(--color-primary-300))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Secure, Proctor-Enforced Online Testing Ecosystem
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.2rem',
          maxWidth: '650px',
          lineHeight: '1.6'
        }}>
          ExamPro delivers a seamless, secure, and modern online test-taking experience for students and robust exam control panels for administrators.
        </p>

        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
          <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
            Get Started
          </button>
          <button onClick={() => navigate('/register')} className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
            Register as Student
          </button>
        </div>
      </header>

      {/* Feature Grid */}
      <section style={{ width: '100%' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.2rem',
          marginBottom: '16px',
          fontFamily: 'var(--font-heading)'
        }}>
          Engineered for Integrity and Scale
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto 48px auto'
        }}>
          Equipped with advanced client-side security measures to guarantee authentic outcomes.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          width: '100%'
        }}>
          {features.map((feat, index) => (
            <div key={index} className="glass-card glass-card-hover" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '24px',
        width: '100%',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        © 2026 ExamPro Systems Inc. All Rights Reserved. Built with React.js & Spring Boot.
      </footer>
    </div>
  );
};

export default LandingPage;
