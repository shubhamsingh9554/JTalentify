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
  const [notification, setNotification] = useState(null);
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

  const showNotification = (message) => {
    setNotification(message); 
    setTimeout(() => setNotification(null), 3000); 
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
      showNotification('Skill added successfully'); 
    } catch (err) {
      console.error(err);
      showNotification('Failed to add skill');
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
      showNotification('Certification added successfully');
    } catch (err) {
      console.error(err);
      showNotification('Failed to add certification');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/admin/skills/${skillId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSkills();
      showNotification('Skill deleted successfully');
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete skill');
    }
  };

  const handleDeleteCertification = async (certificationId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/admin/certifications/${certificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCertifications();
      showNotification('Certification deleted successfully');
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete certificate');
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

  // Function to prepare data for the chart
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
      {notification && <div className="notification">{notification}</div>}
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
                  <h4>Skills Distribution</h4>
                  <Bar
                    data={{
                      labels: skillLabels,
                      datasets: [
                        {
                          label: 'Number of Employees',
                          data: skillData,
                          backgroundColor: 'rgba(52, 17, 163, 0.6)',
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
                <div className="chart-container pie-chart-container">
                  <h4>Certifications Distribution</h4>
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
                    options={{
                      maintainAspectRatio: false, // This allows the chart to respect the height and width set in CSS
                    }}
                  />
                </div>
                <div className="chart-container">
                  <h4>Employee Skill Progress</h4>
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
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(employee => (
                    <tr key={employee._id}>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>
                        <button onClick={() => handleViewEmployee(employee)} className="admin-view-button">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {selectedEmployee && (
          <div className="popup">
            <div className="popup-content">
              <h4>{selectedEmployee.name}'s Details</h4>
              <h5>Email: {selectedEmployee.email}</h5>
              <h5>Department: Engineering</h5>
              <h5>Designation: Software Engineer</h5>
              <h5>Skills</h5>
              <ul>
                {selectedEmployee.skills.map((skill, index) => (
                  <li key={skill._id}>
                    {index + 1}. {skill.skillId ? skill.skillId.skillName : 'No skill data'} - {skill.competencyLevel}
                    <p> Progress : {skill.progress}%</p>
                  </li>
                ))}
              </ul>

              <h5>Certifications</h5>
              <ul>
                {selectedEmployee.certifications.map((cert, index) => (
                  <li key={cert._id}>
                    {index + 1}. {cert.certificationId ? cert.certificationId.certificationName : 'No certification data'}
                  </li>
                ))}
              </ul>

              <button onClick={handleClosePopup} className="admin-close-button">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

