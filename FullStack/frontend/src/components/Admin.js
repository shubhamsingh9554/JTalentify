import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import '../styles/AdminDashboard.css';
import { Chart, registerables } from 'chart.js';
import Navbar from './Navbar';
import '../styles/Navbar.css';
Chart.register(...registerables);

const AdminDashboard = () => {
  const [skillName, setSkillName] = useState('');
  const [certificationName, setCertificationName] = useState('');
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeSection, setActiveSection] = useState('employees');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkills();
    fetchCertifications();
    fetchEmployees();
  }, []);

  const fetchSkills = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/admin/skills', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCertifications = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/admin/certifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCertifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/admin/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedEmployees = res.data.map(employee => ({
        ...employee,
        skills: employee.skills || [],
        certifications: employee.certifications || [],
      }));
      setEmployees(formattedEmployees);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/admin/add-skill', { skillName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkillName('');
      fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCertificationSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/admin/add-certification', { certificationName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCertificationName('');
      fetchCertifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/admin/skills/${skillId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCertification = async (certificationId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/admin/certifications/${certificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCertifications();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      document.body.classList.toggle('dark-mode', newMode);
      return newMode;
    });
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleClosePopup = () => {
    setSelectedEmployee(null);
  };

  const prepareChartData = () => {
    const skillCounts = {};
    const certCounts = {};
    const employeeProgress = {};

    employees.forEach(employee => {
      employee.skills.forEach(skill => {
        const skillName = skill.skillId?.skillName || 'Unknown Skill';
        skillCounts[skillName] = (skillCounts[skillName] || 0) + 1;
        employeeProgress[employee.name] = skill.progress || 0;
      });

      employee.certifications.forEach(cert => {
        const certName = cert.certificationId?.certificationName || 'Unknown Certification';
        certCounts[certName] = (certCounts[certName] || 0) + 1;
      });
    });

    return {
      skillLabels: Object.keys(skillCounts),
      skillData: Object.values(skillCounts),
      certLabels: Object.keys(certCounts),
      certData: Object.values(certCounts),
      progressLabels: Object.keys(employeeProgress),
      progressData: Object.values(employeeProgress),
      totalSkills: skills.length,
      totalCertifications: certifications.length,
      totalEmployees: employees.length
    };
  };

  const { skillLabels, skillData, certLabels, certData, progressLabels, progressData, totalSkills, totalCertifications, totalEmployees } = prepareChartData();

  return (
    <div>
      <Navbar />
      <div className={`admin-dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="sidebar">
          <h2>Admin Dashboard</h2>
          <ul>
            <li><a href="#" onClick={() => setActiveSection('employees')}>Employee Profiles</a></li>
            <li><a href="#" onClick={() => setActiveSection('skills')}>Manage Skills</a></li>
            <li><a href="#" onClick={() => setActiveSection('certifications')}>Manage Certifications</a></li>
            <li><a href="#" onClick={toggleDarkMode}>
              {isDarkMode ? 'Disable Dark Mode' : 'Enable Dark Mode'}
            </a></li>
          </ul>
        </div>
        <div className="content">
          {activeSection === 'skills' && (
            <>
              <h3 id="skills">Available Skills</h3>
              <form onSubmit={handleSkillSubmit}>
                <input
                  type="text"
                  placeholder="Skill Name"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="admin-input"
                />
                <button type="submit" className="admin-button">Add Skill</button>
              </form>
              <ul className="admin-list">
                {skills.map((skill, index) => (
                  <li key={skill._id} className="admin-list-item">
                    {index + 1}. {skill.skillName}
                    <button onClick={() => handleDeleteSkill(skill._id)} className="admin-delete-button">Delete</button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {activeSection === 'certifications' && (
            <>
              <h3 id="certifications">Available Certifications</h3>
              <form onSubmit={handleCertificationSubmit}>
                <input
                  type="text"
                  placeholder="Certification Name"
                  value={certificationName}
                  onChange={(e) => setCertificationName(e.target.value)}
                  className="admin-input"
                />
                <button type="submit" className="admin-button">Add Certification</button>
              </form>
              <ul className="admin-list">
                {certifications.map((cert, index) => (
                  <li key={cert._id} className="admin-list-item">
                    {index + 1}. {cert.certificationName}
                    <button onClick={() => handleDeleteCertification(cert._id)} className="admin-delete-button">Delete</button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {activeSection === 'employees' && (
            <>
              <div className="cards-section">
                <div className="card">
                  <h4>Total Skills</h4>
                  <p>{totalSkills}</p>
                </div>
                <div className="card">
                  <h4>Total Certifications</h4>
                  <p>{totalCertifications}</p>
                </div>
                <div className="card">
                  <h4>Total Employees</h4>
                  <p>{totalEmployees}</p>
                </div>
              </div>

              <div className="charts">
                <div className="chart-container">
                  <h4>Skills Distribution (Bar)</h4>
                  <Bar
                    data={{
                      labels: skillLabels,
                      datasets: [
                        {
                          label: 'Number of Employees',
                          data: skillData,
                          backgroundColor: 'rgba(52, 17, 163, 0.8)',
                          borderColor: '#3411A3',
                          borderWidth: 1,
                        },
                      ],
                    }}
                  />
                </div>
                <div className="chart-container">
                  <h4>Certifications Distribution (Pie)</h4>
                  <Pie
                    data={{
                      labels: certLabels,
                      datasets: [
                        {
                          data: certData,
                          backgroundColor: ['#71EAE1', '#FF6196', '#3411A3', 'white'],
                          borderWidth: 1,
                        },
                      ],
                    }}
                  />
                </div>
                <div className="chart-container">
                  <h4>Employee Skill Progress (Line)</h4>
                  <Line
                    data={{
                      labels: progressLabels,
                      datasets: [
                        {
                          label: 'Skill Progress (%)',
                          data: progressData,
                          backgroundColor: 'rgba(255, 97, 150, 0.2)',
                          borderColor: '#FF6196',
                          borderWidth: 1,
                        },
                      ],
                    }}
                  />
                </div>
              </div>

              <h3 id="employees">Employee Profiles</h3>
              <ul className="admin-list">
                {employees.map((employee, index) => (
                  <li key={employee._id} className="admin-list-item">
                    {index + 1}. {employee.name}
                    <button onClick={() => handleViewEmployee(employee)} className="admin-button">View</button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {selectedEmployee && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-popup" onClick={handleClosePopup}>
              &times;
            </button>
            <h3>{selectedEmployee.name}</h3>
            <p>Email: {selectedEmployee.email}</p>
            <h4>Skills:</h4>
            <ul>
              {selectedEmployee.skills.map(skill => (
                <li key={skill._id}>
                  {skill.skillId?.skillName} (Progress: {skill.progress}%)
                </li>
              ))}
            </ul>
            <h4>Certifications:</h4>
            <ul>
              {selectedEmployee.certifications.map(cert => (
                <li key={cert._id}>
                  {cert.certificationId?.certificationName}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
