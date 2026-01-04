import React from 'react';
import '../styles/roles.css';

const RoleExplanation = () => {
  const roles = [
    {
      title: 'Students & Faculty',
      icon: '🎓',
      color: '#007bff',
      features: [
        'Submit service requests for maintenance, IT support, and facilities',
        'Track request status and receive real-time notifications',
        'View request history and previous submissions',
        'Provide feedback and ratings for completed services',
        'Access personal dashboard with request analytics'
      ]
    },
    {
      title: 'Administrators',
      icon: '👨‍💼',
      color: '#dc3545',
      features: [
        'View and manage all campus service requests',
        'Assign requests to appropriate teams and personnel',
        'Update request status and add resolution notes',
        'Access comprehensive analytics and reporting tools',
        'Manage user accounts and system settings',
        'Monitor service quality through feedback analysis'
      ]
    }
  ];

  return (
    <section className="roles">
      <div className="container">
        <div className="roles-header">
          <h2 className="section-title">User Roles</h2>
          <p className="section-subtitle">
            Different access levels for different campus community members
          </p>
        </div>
        
        <div className="roles-grid">
          {roles.map((role, index) => (
            <div key={index} className="role-card">
              <div className="role-header">
                <div 
                  className="role-icon"
                  style={{ backgroundColor: role.color }}
                >
                  {role.icon}
                </div>
                <h3 className="role-title">{role.title}</h3>
              </div>
              
              <div className="role-features">
                <ul className="features-list">
                  {role.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="feature-item">
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleExplanation;