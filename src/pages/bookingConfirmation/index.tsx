import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Avatar, Spin, Rate, message, Input, Modal, Card } from 'antd';
import { UserOutlined, SearchOutlined, CarOutlined } from '@ant-design/icons';
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
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    fetchDriverDetails();
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getvehicles');
      const data = Array.isArray(response.data) ? response.data : [];
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      message.error('Failed to fetch vehicles');
    }
  };

  const fetchDriverDetails = async () => {
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

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const confirmBooking = async () => {
    if (!selectedDriver || !selectedVehicle) {
      message.error('Please select both a driver and a vehicle');
      return;
    }
  
    setLoading(true);
    try {
      const bookingData = {
        ...bookingDetails,
        driverId: selectedDriver.id,
        driverName: selectedDriver.name,
        driverRating: selectedDriver.rating,
        vehicleId: selectedVehicle.id,
        vehicleMake: selectedVehicle.make,
        vehicleModel: selectedVehicle.model,
      };
  
      const response = await axios.post('http://localhost:3000/bookings', bookingData);
  
      if (response.status === 201) {
        message.success('Booking confirmed successfully!');
        navigate('/bookingsuccess');
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

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300" 
              hoverable
              style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
          <Title level={2} className="text-center text-green-800 mb-4">Trip Details</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <Text strong className="text-lg">Origin:</Text>
              <p className="text-xl text-green-600">{bookingDetails.origin}</p>
            </div>
            <div className="text-center">
              <Text strong className="text-lg">Destination:</Text>
              <p className="text-xl text-green-600">{bookingDetails.destination}</p>
            </div>
            <div className="text-center">
              <Text strong className="text-lg">Distance:</Text>
              <p className="text-xl text-green-600">{bookingDetails.distance} km</p>
            </div>
            <div className="text-center">
              <Text strong className="text-lg">Duration:</Text>
              <p className="text-xl text-green-600">{bookingDetails.duration} minutes</p>
            </div>
          </div>
        </Card>

        <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              hoverable
              style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
          <Title level={2} className="text-center text-green-800 mb-4">Select a Driver</Title>
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search drivers by name"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-6 rounded-full"
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
                <Card
                  key={driver.id}
                  hoverable
                  className={`text-center transition-all duration-300 transform hover:scale-105 ${
                    selectedDriver?.id === driver.id ? 'border-green-500 border-2' : ''
                  }`}
                  onClick={() => handleDriverSelect(driver)}
                >
                  <Avatar size={80} icon={<UserOutlined />} src={driver.imageUrl} className="mb-4" />
                  <Title level={4}>{driver.name}</Title>
                  <Rate disabled defaultValue={driver.rating} className="my-2" />
                  <Text>Experience: {driver.experience} years</Text>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              hoverable
              style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
          <Title level={2} className="text-center text-green-800 mb-4">Select a Vehicle</Title>
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search vehicles by make"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-6 rounded-full"
          />

          {loading ? (
            <div className="text-center">
              <Spin size="large" />
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center">
              <Text>No vehicles found</Text>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredVehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  hoverable
                  className={`text-center transition-all duration-300 transform hover:scale-105 ${
                    selectedVehicle?.id === vehicle.id ? 'border-green-500 border-2' : ''
                  }`}
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  <Avatar size={80} icon={<CarOutlined />} src={vehicle.imageUrl} className="mb-4" />
                  <Title level={4}>{vehicle.make} {vehicle.model}</Title>
                  <Text>Year: {vehicle.year}</Text>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <div className="text-center">
          <button
            onClick={confirmBooking}
            className={`px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105 ${
              selectedDriver && selectedVehicle
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedDriver || !selectedVehicle || loading}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      </div>

      <Modal
        title={<Title level={3} className="text-center text-green-800">Driver Details</Title>}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <button
            key="close"
            onClick={handleModalClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-300"
          >
            Close
          </button>,
        ]}
        className="rounded-2xl overflow-hidden"
        bodyStyle={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}
      >
        {selectedDriver && (
          <div className="flex flex-col items-center">
            <Avatar size={120} icon={<UserOutlined />} src={selectedDriver.imageUrl} className="mb-4" />
            <Title level={3} className="mb-2">{selectedDriver.name}</Title>
            <Rate disabled defaultValue={selectedDriver.rating} className="mb-4" />
            <Text className="text-lg mb-2">Experience: {selectedDriver.experience} years</Text>
            <Text className="text-lg mb-2">Languages: {selectedDriver.languages || 'English, Hindi'}</Text>
            <Text className="text-lg mb-2">License Type: {selectedDriver.licenseType || 'Commercial'}</Text>
            <Text className="text-lg">Vehicle: {selectedDriver.vehicle || 'Toyota Innova'}</Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingConfirmation;