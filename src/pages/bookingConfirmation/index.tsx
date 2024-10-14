import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Card, List, Avatar, Spin, Rate, Table,message, Divider, Row, Col, Button } from 'antd';
import { CarOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';
const { Title, Text } = Typography;

// Define dummy data for vehicle, driver, and tourist places
const dummyVehicle = {
  id: '1',
  name: 'Toyota Innova',
  type: 'SUV',
  seats: 7,
  imageUrl: 'https://via.placeholder.com/150',
};

const dummyDriver = {
  id: '1',
  name: 'Rahul Sharma',
  rating: 4.5,
  experience: 5,
  imageUrl: 'https://via.placeholder.com/150',
};

const dummyNearbyPlaces = [
  {
    id: '1',
    name: 'Munnar Hill Station',
    description: 'A beautiful hill station known for tea plantations.',
    distance: 15.23,
    rating: 4.5,
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    name: 'Periyar Wildlife Sanctuary',
    description: 'A popular wildlife reserve with boat rides.',
    distance: 30.1,
    rating: 4.2,
    imageUrl: 'https://via.placeholder.com/150',
  },
];

const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const bookingDetails = location.state || {
    origin: 'Cochin',
    destination: 'Munnar',
    distance: 120,
    duration: 180,
  };

  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [driverList, setDriverList] = useState([]);
  // Simulate loading effect
  useEffect(() => {
    fetchVehicles()
    fetchDriverDetails()
    const timeout = setTimeout(() => setLoading(false), 1000); // Simulate a delay
    return () => clearTimeout(timeout);
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getvehicles');
      console.log('Fetched Vehicles:', response.data); // Check the structure
      const data = Array.isArray(response.data) ? response.data : [];
      setVehicles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      message.error('Failed to fetch vehicles');
      setLoading(false);
    }
  };

  const fetchDriverDetails = async () => {
    try {
      const response = await axios.get('http://localhost:3000/driverList');
      console.log('Fetched DriverList:', response.data); // Check the structure
      const data = Array.isArray(response.data) ? response.data : [];
      setDriverList(data)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      message.error('Failed to fetch vehicles');
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" className="flex justify-center items-center h-screen" />;
  }

  const userColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  ];

  const userData = [
    { key: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Title level={2} className="mb-8 text-center">
        Booking Confirmation
      </Title>

      <Row gutter={16}>
        <Col span={12}>
          <Card className="mb-8">
            <Title level={4}>Trip Details</Title>
            <div className="grid grid-cols-2 gap-4">
              <Text><strong>Origin:</strong> {bookingDetails.origin}</Text>
              <Text><strong>Destination:</strong> {bookingDetails.destination}</Text>
              <Text><strong>Distance:</strong> {bookingDetails.distance} km</Text>
              <Text><strong>Duration:</strong> {bookingDetails.duration} minutes</Text>
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card className="mb-8">
            <Title level={4}>User Information</Title>
            <Table columns={userColumns} dataSource={userData} pagination={false} />
          </Card>
        </Col>
      </Row>
      <Title level={4}>Vehicle Details</Title>
{
    vehicles.map((vehicles:any)=>{
return (
    <Card className="mb-2">
   
    <div className="flex items-center">
      <Avatar size={64} icon={<CarOutlined />} src={dummyVehicle.imageUrl} />
      <div className="ml-4">
        <Text strong className="block">{vehicles.make}</Text>
        <Text>Model: {vehicles.model}</Text>
        <Text className="block">Type: {dummyVehicle.type}</Text>
      </div>
    </div>
  </Card>
)
    })

}
<Title level={4}>Driver Details</Title>
{
    driverList.map((driver:any)=>{
return (
    <Card className="mb-2">
   
    <div className="flex items-center">
      <Avatar size={64} icon={<CarOutlined />} src={dummyVehicle.imageUrl} />
      <div className="ml-4">
        <Text strong className="block">{driver.name}</Text>
        <Text>Email: {driver.email}</Text>
      </div>
    </div>
  </Card>
)
    })

}
     

      <Card className="mb-8">
        <Title level={4}>Nearby Tourist Places</Title>
        <List
          itemLayout="horizontal"
          dataSource={dummyNearbyPlaces}
          renderItem={(place) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<EnvironmentOutlined />} src={place.imageUrl} />}
                title={<Text strong>{place.name}</Text>}
                description={
                  <>
                    <Text className="block">{place.description}</Text>
                    <Text className="block">Distance: {place.distance.toFixed(2)} km</Text>
                    <Rate disabled defaultValue={place.rating} />
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Divider />
      <div className="text-center">
        <Button type="primary" size="large">
          Confirm Booking
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
