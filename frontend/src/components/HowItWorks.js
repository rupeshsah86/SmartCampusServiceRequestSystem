import React from 'react';
import '../styles/how-it-works.css';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Register Account',
      description: 'Create your account as a student, faculty member, or administrator with your campus credentials.',
      icon: '👤'
    },
    {
      number: '2',
      title: 'Submit Request',
      description: 'Fill out a detailed service request form with category, priority, location, and description.',
      icon: '📝'
    },
    {
      number: '3',
      title: 'Track Status',
      description: 'Monitor your request progress through our dashboard with real-time status updates and notifications.',
      icon: '📊'
    },
    {
      number: '4',
      title: 'Get Resolution',
      description: 'Receive updates when your request is assigned, in progress, and finally resolved by our team.',
      icon: '🔧'
    },
    {
      number: '5',
      title: 'Provide Feedback',
      description: 'Rate the service quality and provide feedback to help us improve our campus services.',
      icon: '⭐'
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <div className="how-it-works-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Simple 5-step process to get your campus issues resolved
          </p>
        </div>
        
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="step-connector"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;