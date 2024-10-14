import React from 'react';
import '../styles/ContactUs.css'; 
const ContactUs = () => {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>If you have any questions or need assistance, feel free to contact us using the information below.</p>
      
      <div className="contact-info">
        <p>Email: <span>support@jtalentify.com</span></p>
        <p>Phone: <span>+123-456-7890</span></p>
        <p>Address: <span>123 JTalentify St, Tech City, 10101</span></p>
      </div>
    </div>
  );
};

export default ContactUs;
