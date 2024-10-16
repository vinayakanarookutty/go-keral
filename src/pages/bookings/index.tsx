import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin, message } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      message.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <Title level={2} className="mb-8 text-center text-green-800">
          Your Bookings
        </Title>

        {loading ? (
          <div className="text-center">
            <Spin size="large" />
          </div>
        ) : bookings.length === 0 ? (
          <Text>No bookings found</Text>
        ) : (
          <Row gutter={[16, 16]}>
            {bookings.map((booking) => (
              <Col span={12} key={booking._id}>
                <Card className="shadow-sm">
                  <Text strong>Origin:</Text> {booking.origin} <br />
                  <Text strong>Destination:</Text> {booking.destination} <br />
                  <Text strong>Distance:</Text> {booking.distance} km <br />
                  <Text strong>Duration:</Text> {booking.duration} mins <br />
                  <Text strong>Driver:</Text> {booking.driverName} <br />
                  <Text strong>Rating:</Text> {booking.driverRating} <br />
                  <Text strong>Date:</Text> {new Date(booking.date).toLocaleString()}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
