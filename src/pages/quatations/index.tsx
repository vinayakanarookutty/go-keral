import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin, message } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

interface Quotation {
  _id: string;
  customerName: string;
  bookingDatefrom: string;
  bookingDateto: string;
  price: number;
  remarks: string;
  createdAt: string;
}

const QuatationsPage: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/quatations');
      setQuotations(response.data);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      message.error('Failed to fetch quotations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <Title level={2} className="mb-8 text-center text-green-800">
          Your Quotations
        </Title>

        {loading ? (
          <div className="text-center">
            <Spin size="large" />
          </div>
        ) : quotations.length === 0 ? (
          <Text>No quotations found</Text>
        ) : (
          <Row gutter={[16, 16]}>
            {quotations.map((quotation) => (
              <Col span={12} key={quotation._id}>
                <Card className="shadow-sm">
                  <Text strong>Customer Name:</Text> {quotation.customerName} <br />
                  <Text strong>Booking Date (From):</Text>{' '}
                  {new Date(quotation.bookingDatefrom).toLocaleDateString()} <br />
                  <Text strong>Booking Date (To):</Text>{' '}
                  {new Date(quotation.bookingDateto).toLocaleDateString()} <br />
                  <Text strong>Price:</Text> ₹{quotation.price} <br />
                  <Text strong>Remarks:</Text> {quotation.remarks || 'N/A'} <br />
                  <Text strong>Created At:</Text>{' '}
                  {new Date(quotation.createdAt).toLocaleString()}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default QuatationsPage;
