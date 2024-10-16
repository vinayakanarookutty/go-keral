import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Avatar, Spin, Rate, message, Input, Modal } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state || {
    origin: 'Cochin',
    destination: 'Munnar',
    distance: 120,
    duration: 180,
  };

  const [loading, setLoading] = useState(true);
  const [driverList, setDriverList] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchDriverDetails();
  }, []);

  const fetchDriverDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/driverList');
      setDriverList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      message.error('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const confirmBooking = async () => {
    if (!selectedDriver) {
      message.error('Please select a driver');
      return;
    }
  
    setLoading(true);
    try {
      const bookingData = {
        ...bookingDetails,
        driverId: selectedDriver.id,
        driverName: selectedDriver.name,
        driverRating: selectedDriver.rating,
      };
  
      const response = await axios.post('http://localhost:3000/bookings', bookingData);
  
      if (response.status === 201) {
        message.success('Booking confirmed successfully!');
        navigate('/bookingsucess');
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      message.error('An error occurred while confirming the booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = driverList.filter((driver) =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Title level={2} className="text-center text-green-800 mb-8">
          Select a Driver
        </Title>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <Title level={4} className="text-green-700 mb-4">Trip Details</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text strong>Origin:</Text> {bookingDetails.origin}
            </div>
            <div>
              <Text strong>Destination:</Text> {bookingDetails.destination}
            </div>
            <div>
              <Text strong>Distance:</Text> {bookingDetails.distance} km
            </div>
            <div>
              <Text strong>Duration:</Text> {bookingDetails.duration} minutes
            </div>
          </div>
        </div>

        <Input
          prefix={<SearchOutlined />}
          placeholder="Search drivers by name"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6"
        />

        {loading ? (
          <div className="text-center">
            <Spin size="large" />
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="text-center">
            <Text>No drivers found</Text>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredDrivers.map((driver) => (
              <div
                key={driver.id}
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedDriver?.id === driver.id ? 'border-green-500 border-2' : ''
                }`}
                onClick={() => handleDriverSelect(driver)}
              >
                <div className="flex flex-col items-center">
                  <Avatar size={80} icon={<UserOutlined />} src={driver.imageUrl} />
                  <Text strong className="mt-4 text-lg">{driver.name}</Text>
                  <Rate disabled defaultValue={driver.rating} className="my-2" />
                  <Text>Experience: {driver.experience} years</Text>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={confirmBooking}
            className={`px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 ${
              selectedDriver
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedDriver || loading}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      </div>

      <Modal
        title="Driver Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <button
            key="close"
            onClick={handleModalClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-300"
          >
            Close
          </button>,
        ]}
      >
        {selectedDriver && (
          <div className="flex flex-col items-center">
            <Avatar size={100} icon={<UserOutlined />} src={selectedDriver.imageUrl} />
            <Title level={4} className="mt-4">{selectedDriver.name}</Title>
            <Rate disabled defaultValue={selectedDriver.rating} className="my-2" />
            <Text className="mt-2">Experience: {selectedDriver.experience} years</Text>
            <Text className="mt-2">Languages: {selectedDriver.languages || 'English, Hindi'}</Text>
            <Text className="mt-2">License Type: {selectedDriver.licenseType || 'Commercial'}</Text>
            <Text className="mt-2">Vehicle: {selectedDriver.vehicle || 'Toyota Innova'}</Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingConfirmation;