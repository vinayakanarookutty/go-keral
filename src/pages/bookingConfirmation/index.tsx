import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Avatar, Spin, Rate, message, Input, Modal, Card } from 'antd';
import { UserOutlined, SearchOutlined, CarOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Form, DatePicker, Select, Button, InputNumber,  } from 'antd'
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

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
    setIsModalOpen(true);
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

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    try {
      values.customerName="Vinayak"
      const response = await axios.post('http://localhost:3000/quatation', values);
      if (response.status === 201) {
        message.success('Quotation submitted successfully!');
        navigate('/quatationsuccess');
        form.resetFields(); // Reset form after submission
      } else {
        message.error('Failed to submit the quotation.');
      }
    } catch (error) {
      message.error('An error occurred while submitting the quotation.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
    <div className="container mx-auto px-4 py-12">
      <Card className="mb-10 shadow-lg hover:shadow-xl transition-shadow duration-300" 
            hoverable
            style={{ background: 'white', borderRadius: '16px' }}>
        <Title level={2} className="text-center text-gray-800 mb-6 font-light">Trip Details</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['Origin', 'Destination', 'Distance', 'Duration'].map((item, index) => (
            <div key={index} className="text-center">
              <Text strong className="text-lg text-gray-600">{item}:</Text>
              <p className="text-xl text-gray-800 mt-2">
                {item === 'Distance' ? `${bookingDetails[item.toLowerCase()]} km` :
                 item === 'Duration' ? `${bookingDetails[item.toLowerCase()]} minutes` :
                 bookingDetails[item.toLowerCase()]}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-10 shadow-lg hover:shadow-xl transition-shadow duration-300"
            hoverable
            style={{ background: 'white', borderRadius: '16px' }}>
        <Title level={2} className="text-center text-gray-800 mb-6 font-light">Select a Driver</Title>
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search drivers by name"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-8 rounded-full"
          size="large"
        />

        {loading ? (
          <div className="text-center py-8">
            <Spin size="large" />
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="text-center py-8">
            <Text className="text-gray-600">No drivers found</Text>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {filteredDrivers.map((driver) => (
              <Card
                key={driver.id}
                hoverable
                className={`text-center transition-all duration-300 transform hover:scale-105 ${
                  selectedDriver?.id === driver.id ? 'border-blue-500 border-2' : ''
                }`}
                onClick={() => handleDriverSelect(driver)}
                style={{ borderRadius: '12px' }}
              >
                <Avatar size={100} icon={<UserOutlined />} src={driver.imageUrl} className="mb-4" />
                <Title level={4} className="mb-2">{driver.name}</Title>
                <Rate disabled defaultValue={driver.rating} className="mb-2" />
                <Text className="text-gray-600">Experience: {driver.experience} years</Text>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Card className="mb-10 shadow-lg hover:shadow-xl transition-shadow duration-300"
            hoverable
            style={{ background: 'white', borderRadius: '16px' }}>
        <Title level={2} className="text-center text-gray-800 mb-6 font-light">Select a Vehicle</Title>
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search vehicles by make"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-8 rounded-full"
          size="large"
        />

        {loading ? (
          <div className="text-center py-8">
            <Spin size="large" />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-8">
            <Text className="text-gray-600">No vehicles found</Text>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {filteredVehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                hoverable
                className={`text-center transition-all duration-300 transform hover:scale-105 ${
                  selectedVehicle?.id === vehicle.id ? 'border-blue-500 border-2' : ''
                }`}
                onClick={() => handleVehicleSelect(vehicle)}
                style={{ borderRadius: '12px' }}
              >
                <Avatar size={100} icon={<CarOutlined />} src={vehicle.imageUrl} className="mb-4" />
                <Title level={4} className="mb-2">{vehicle.make} {vehicle.model}</Title>
                <Text className="text-gray-600">Year: {vehicle.year}</Text>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <div className="text-center">
        <button
          onClick={confirmBooking}
          className={`px-10 py-4 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105 ${
            selectedDriver && selectedVehicle
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!selectedDriver || !selectedVehicle || loading}
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </div>
    </div>

    <Modal
      title={<Title level={3} className="text-center text-gray-800">Driver Details</Title>}
      visible={isModalVisible}
      onCancel={handleModalClose}
      footer={[
        <button
          key="close"
          onClick={handleModalClose}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-300"
        >
          Close
        </button>,
      ]}
      className="rounded-2xl overflow-hidden"
      bodyStyle={{ background: 'white' }}
    >
      {selectedDriver && (
        <div className="flex flex-col items-center">
          <Avatar size={140} icon={<UserOutlined />} src={selectedDriver.imageUrl} className="mb-6" />
          <Title level={3} className="mb-3">{selectedDriver.name}</Title>
          <Rate disabled defaultValue={selectedDriver.rating} className="mb-4" />
          <Text className="text-lg mb-2">Experience: {selectedDriver.experience} years</Text>
          <Text className="text-lg mb-2">Languages: {selectedDriver.languages || 'English, Hindi'}</Text>
          <Text className="text-lg mb-2">License Type: {selectedDriver.licenseType || 'Commercial'}</Text>
          <Text className="text-lg">Vehicle: {selectedDriver.vehicle || 'Toyota Innova'}</Text>
        </div>
      )}
    </Modal>

    <Modal
      title={<Title level={3} className="text-center text-gray-800">Give Quotation</Title>}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      centered
      className="quotation-modal rounded-2xl overflow-hidden"
    >
      <div className="quotation-header mb-6">
        <Text strong className="text-lg">Vehicle: </Text>
        <Text className="text-lg">{selectedVehicle?.make} {selectedVehicle?.model}</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="quotation-form"
      >
        <Form.Item
          name="bookingDatefrom"
          label="Booking Date From"
          rules={[{ required: true, message: 'Please select the booking date' }]}
        >
          <DatePicker style={{ width: '100%' }} size="large" />
        </Form.Item>

        <Form.Item
          name="bookingDateto"
          label="Booking Date To"
          rules={[{ required: true, message: 'Please select the booking date' }]}
        >
          <DatePicker style={{ width: '100%' }} size="large" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price (in INR)"
          rules={[{ required: true, message: 'Please enter the price' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Enter price"
            min={0}
            formatter={(value) => `₹ ${value}`}
            size="large"
          />
        </Form.Item>

        <Form.Item name="remarks" label="Remarks">
          <Input.TextArea placeholder="Additional remarks (optional)" rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large" className="h-12 text-lg font-semibold">
            Submit Quotation
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  </div>
  );
};

export default BookingConfirmation;