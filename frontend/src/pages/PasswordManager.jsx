import { useState, useEffect } from 'react';
import './PasswordManager.css';
import Menu from '../components/Menu';
import Service from '../components/Service.jsx';
import addServiceIcon from '../assets/user-plus.svg';


function PasswordManager() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState('');


  const fetchServices = async () => {
    try {
      const user_id = localStorage.getItem('user_id');
      const response = await fetch('http://localhost:5000/api/password-manager/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const sortedServices = data.services.sort((a, b) => // Order alphabetically
        a.service_name.localeCompare(b.service_name)
      );
  
      setServices(sortedServices);
  
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);


  const handleAdd = async () => {

    if (!inputValue.trim()) {
      setMessage("Please enter the service's name");
    } else {
      const addResponse = await fetch('http://localhost:5000/api/password-manager/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: inputValue,
          user_id: localStorage.getItem('user_id'),
          password: localStorage.getItem('password')
        }),
      });

      if (!addResponse.ok) {
        const addErrorData = await addResponse.json();
        console.error('Error adding new service:', addErrorData);
        return;
      }

      const data = await addResponse.json();
      console.log('Service generated successfully.');
      fetchServices();
      setShowModal(false);
      setInputValue("");
    }
  }



  return (
    <>
      <div className="password-manager-page">
        <Menu />
        <div className="password-manager-content">
          {services.length > 0 && (
            <div className="services-container">
              {services.map(service => (
                <Service key={service.service_id} serviceName={service.service_name} fetchServices={fetchServices}/>
              ))}
            </div>
          )}
          <button className="add-account-button" onClick={() => setShowModal(true)}>
            <span><img src={addServiceIcon} alt="Add service icon" className="icon" /></span>
            <span><p>Add a new account</p></span>
          </button>

        </div>
      </div>

      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-box">
            <div className="custom-modal-header">
              <span className="custom-modal-title">Add a new account</span>
              {message && <p className="message">{message}</p>}
              <button className="custom-modal-close" onClick={() => setShowModal(false)}>X</button>
            </div>

            <div className="custom-modal-body">
              <input
                type="text"
                placeholder="Enter service name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="custom-modal-input"
              />
              <button className="custom-modal-add" onClick={handleAdd}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default PasswordManager;
