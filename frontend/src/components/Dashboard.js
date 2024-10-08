import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/employee/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <h2>Employee Dashboard</h2>
      {profile ? (
        <div>
          <h3>Name: {profile.name}</h3>
          <p>Email: {profile.email}</p>
          <h4>Skills:</h4>
          <ul>
            {profile.skills.map(skill => (
              <li key={skill._id}>{skill.skillName} - {skill.competencyLevel}</li>
            ))}
          </ul>
          <h4>Certifications:</h4>
          <ul>
            {profile.certifications.map(cert => (
              <li key={cert._id}>{cert.certificationName}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Dashboard;
