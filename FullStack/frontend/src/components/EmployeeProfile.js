import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/EmployeeProfile.css';
import Navbar from './Navbar';
import '../styles/Navbar.css';
import profileImage from '../styles/profile.jfif';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [competencyLevel, setCompetencyLevel] = useState('');
  const [selectedCertification, setSelectedCertification] = useState('');
  const [progress, setProgress] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/employee/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setErrorMessage('Error fetching profile. Please try again.');
    }
  };

  const handleProgressChange = (skillId, value) => {
    setProgress({ ...progress, [skillId]: value });
  };

  const handleProgressSubmit = async (skillId) => {
    const updatedProgress = progress[skillId];
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/api/employee/skill/progress',
        { skillId, progress: updatedProgress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Progress updated successfully'); // Show success toast
      fetchProfile();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Error updating progress. Please try again.'); // Show error toast
      setErrorMessage('Error updating progress. Please try again.');
    }
  };

  const fetchAvailableSkillsAndCertifications = async () => {
    const token = localStorage.getItem('token');
    try {
      const skillsRes = await axios.get('http://localhost:5000/api/admin/skills', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(skillsRes.data);

      const certsRes = await axios.get('http://localhost:5000/api/admin/certifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCertifications(certsRes.data);
    } catch (err) {
      console.error('Error fetching available skills and certifications:', err);
      setErrorMessage('Error fetching skills and certifications. Please try again.');
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAvailableSkillsAndCertifications();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/employee/add-skill', { skillId: selectedSkill, competencyLevel }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedSkill('');
      setCompetencyLevel('');
      fetchProfile();
      toast.success('Skill added successfully'); // Show success toast
    } catch (err) {
      console.error('Error adding skill:', err);
      toast.error('Error adding skill. Please try again.'); // Show error toast
      setErrorMessage('Error adding skill. Please try again.');
    }
  };

  const handleAddCertification = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/employee/add-certification', { certificationId: selectedCertification }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedCertification('');
      fetchProfile();
      toast.success('Certification added successfully'); // Show success toast
    } catch (err) {
      console.error('Error adding certification:', err);
      toast.error('Error adding certification. Please try again.'); // Show error toast
      setErrorMessage('Error adding certification. Please try again.');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      document.body.classList.toggle('dark-mode', newMode);
      return newMode;
    });
  };

  return (
    <div>
      <Navbar />
      <ToastContainer /> {/* Add the ToastContainer for displaying notifications */}
      <div className={`employee-profile-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="sidebar">
          <h2>Employee Dashboard</h2>
          <ul>
            <li><a href="#" onClick={() => setActiveSection('profile')}>Profile</a></li>
            <li><a href="#" onClick={() => setActiveSection('skills')}>Manage Skills</a></li>
            <li><a href="#" onClick={() => setActiveSection('certifications')}>Manage Certifications</a></li>
            <li><a href="#" onClick={toggleDarkMode}>
              {isDarkMode ? 'Disable Dark Mode' : 'Enable Dark Mode'}
            </a></li>
          </ul>
        </div>

        <div className="content">
          {activeSection === 'profile' && profile && (
            <>
              <div className="profile-image-container">
                <img src={profileImage} alt="Profile" className="profile-image" />
              </div>
              <h3>Employee's Name : {profile.name}</h3>
              <h3>Department: Engineering</h3>
              <p>Designation: Software Enginer</p>
              <p>Email: {profile.email}</p>
            </>
          )}

          {activeSection === 'skills' && (
            <>
              <h4>Add Skill</h4>
              <form onSubmit={handleAddSkill}>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  required
                >
                  <option value="">Select a skill</option>
                  {skills.map(skill => (
                    <option key={skill._id} value={skill._id}>
                      {skill.skillName}
                    </option>
                  ))}
                </select>
                <select
                  value={competencyLevel}
                  onChange={(e) => setCompetencyLevel(e.target.value)}
                  required
                >
                  <option value="">Select competency level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <button type="submit">Add Skill</button>
              </form>

              <h4>Skills:</h4>
              {profile && profile.skills.length > 0 ? (
                <ul>
                  {profile.skills.map((skill, index) => (
                    <li key={skill._id}>
                      <p><strong>{index + 1})</strong></p>
                      <p><strong>Skill:</strong> {skill.skillName}</p>
                      <p><strong>Competency Level:</strong> {skill.competencyLevel}</p>
                      <p><strong>Progress:</strong> {skill.progress}%</p>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={progress[skill._id] !== undefined ? progress[skill._id] : skill.progress || 0}
                        onChange={(e) => handleProgressChange(skill._id, e.target.value)}
                      />

                      <button onClick={() => handleProgressSubmit(skill._id)}>
                        Submit Progress
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No skills found.</p>
              )}
            </>
          )}

          {activeSection === 'certifications' && (
            <>
              <h4>Add Certification</h4>
              <form onSubmit={handleAddCertification}>
                <select
                  value={selectedCertification}
                  onChange={(e) => setSelectedCertification(e.target.value)}
                  required
                >
                  <option value="">Select a certification</option>
                  {certifications.map(cert => (
                    <option key={cert._id} value={cert._id}>
                      {cert.certificationName}
                    </option>
                  ))}
                </select>
                <button type="submit">Add Certification</button>
              </form>

              <h4>Certifications:</h4>
              {profile && profile.certifications.length > 0 ? (
                <ul>
                  {profile.certifications.map((certification, index) => (
                    <li key={certification._id}>
                      <p><strong>{index + 1})</strong></p>
                      <p><strong>Certification:</strong> {certification.certificationName}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No certifications found.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
