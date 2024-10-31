import React, { useState } from 'react';
import { Modal, Button, Form, Input, Select, DatePicker, Card, Row, Col, Tag, Typography } from 'antd';
import dayjs from 'dayjs'; // Import dayjs for date handling

const { Option } = Select;
const { Title, Text } = Typography;

function DriverPersonalModal() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [driverInfo, setDriverInfo] = useState({
    dob: dayjs('1990-05-15'), // Use dayjs for initial date
    address: '123 Main St, City, Country',
    languages: ['English', 'Spanish', 'Custom Language'],
    area: 'Downtown',
    certifications: ['Defensive Driving Certified', 'Custom Certification'],
    emergencyContact: 'Jane Doe - 987-654-3210'
  });

  const showModal = () => {
    form.setFieldsValue({
      ...driverInfo,
      dob: driverInfo.dob // DatePicker will handle dayjs object
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      dob: values.dob // Keep as dayjs object for state
    };
    console.log('Updated Driver Information:', formattedValues);
    setDriverInfo(formattedValues);
    console.log(driverInfo)
    setIsModalVisible(false);
    try {
        fetch("http://localhost:3000/updateDriver", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(driverInfo),
        })
      } catch (error) {
        console.error('Error submitting form: ', error);
      }
  };

  // Custom language and certification handlers
  const handleLanguageChange = (value) => {
    form.setFieldsValue({ languages: value });
  };

  const handleCertificationChange = (value) => {
    form.setFieldsValue({ certifications: value });
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Edit Driver Information
      </Button>
      
      {/* Display Driver Information */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} sm={24} md={12}>
          <Card title="Personal Information">
            <p><Text strong>Date of Birth:</Text> {driverInfo.dob.format('YYYY-MM-DD')}</p>
            <p><Text strong>Address:</Text> {driverInfo.address}</p>
            <p><Text strong>Emergency Contact:</Text> {driverInfo.emergencyContact}</p>
            <p><Text strong>Operating Area:</Text> {driverInfo.area}</p>
          </Card>
        </Col>
        
        <Col xs={24} sm={24} md={12}>
          <Card title="Languages & Certifications">
            <div style={{ marginBottom: 16 }}>
              <Text strong>Languages:</Text><br />
              {driverInfo.languages.map((lang) => (
                <Tag color="blue" key={lang} style={{ margin: '4px' }}>
                  {lang}
                </Tag>
              ))}
            </div>
            <div>
              <Text strong>Certifications:</Text><br />
              {driverInfo.certifications.map((cert) => (
                <Tag color="green" key={cert} style={{ margin: '4px' }}>
                  {cert}
                </Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Driver Personal Information"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[{ required: true, message: "Please enter the driver's date of birth!" }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter the driver's address!" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Languages Spoken"
            name="languages"
            rules={[{ required: true, message: "Please enter the languages spoken by the driver!" }]}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Select or enter languages"
              onChange={handleLanguageChange}
            >
              <Option value="English">English</Option>
              <Option value="Spanish">Spanish</Option>
              <Option value="French">French</Option>
              <Option value="German">German</Option>
              <Option value="Hindi">Hindi</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Operating Area"
            name="area"
            rules={[{ required: true, message: "Please enter the driver's operating area!" }]}
          >
            <Input placeholder="E.g., Downtown, Suburban" />
          </Form.Item>

          <Form.Item
            label="Certifications"
            name="certifications"
            rules={[{ required: true, message: "Please enter the driver's certifications!" }]}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Select or enter certifications"
              onChange={handleCertificationChange}
            >
              <Option value="Defensive Driving Certified">Defensive Driving Certified</Option>
              <Option value="First Aid Certified">First Aid Certified</Option>
              <Option value="Hazardous Materials Endorsement">Hazardous Materials Endorsement</Option>
              <Option value="Commercial Driving License">Commercial Driving License</Option>
              <Option value="Customer Service Training">Customer Service Training</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Emergency Contact"
            name="emergencyContact"
            rules={[{ required: true, message: "Please enter an emergency contact!" }]}
          >
            <Input placeholder="Name - Phone Number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Information
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default DriverPersonalModal;