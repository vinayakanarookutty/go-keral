import React, { useState } from 'react';
import { Modal, Button, Form, Input, Select, DatePicker, Card, Row, Col, Tag, Typography } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { Text } = Typography;

function UserPersonalModal({ email, personalInfo }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [driverInfo, setDriverInfo] = useState(personalInfo);

  const showModal = () => {
    // Populate the form with the existing personalInfo data
    form.setFieldsValue({
      ...personalInfo,
      dob: dayjs(personalInfo?.dob) // Set dob as a dayjs object for DatePicker
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      dob: values.dob // Store the dayjs date object for submission
    };
    console.log('Updated Driver Information:', formattedValues);
    setDriverInfo(formattedValues);

    const updatedInfo = { ...formattedValues, mail:email }; // Include email in the data to send

    setIsModalVisible(false);
    try {
      fetch("http://localhost:3000/updateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedInfo),
      });
    } catch (error) {
      console.error('Error submitting form: ', error);
    }
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
            <p><Text strong>Date of Birth:</Text> {personalInfo?.dob?.substring(0, 10).split('-').reverse().join('-')}</p>
            <p><Text strong>Address:</Text> {personalInfo?.address}</p>
       
          </Card>
        </Col>
        
        <Col xs={24} sm={24} md={12}>
          <Card title="Hobbies">
            <div style={{ marginBottom: 16 }}>
              <Text strong>Hobbies:</Text><br />
              {personalInfo?.hobbies?.map((lang) => (
                <Tag color="blue" key={lang} style={{ margin: '4px' }}>
                  {lang}
                </Tag>
              ))}
            </div>
           
          </Card>
        </Col>
      </Row>

      <Modal
        title=" Personal Information"
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
            rules={[{ required: true, message: "Please enter your date of birth!" }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter your address!" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Hobbies"
            name="hobbies"
            rules={[{ required: true, message: "Please enter theyour hobbies" }]}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Select or enter hobbies"
            >
              <Option value="Traveling">Traveling</Option>
              <Option value="Reading">Reading</Option>
              
            </Select>
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

export default UserPersonalModal;
