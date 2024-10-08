import React, { useEffect, useState } from 'react';
import { Tabs, Card, Avatar, Typography, Form, Input, Button, Table, Tag, Modal, message, Select, Checkbox, Row, Col, Layout } from 'antd';
import { UserOutlined, CarOutlined, SettingOutlined, PlusOutlined, BellOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

export default function DriverProfile() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [form] = Form.useForm();
  const location = useLocation();
  const { email } = location.state || {};

  const showModal = () => setIsModalVisible(true);
  useEffect(()=>{
    fetch(`http://localhost:3000/userDetails?id=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
       
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        
      })
      .catch((error) => {
        console.error('Error:', error);
        message.error('Registration failed. Please try again.');
      });
  },[])
  const handleOk = () => {
    form.validateFields().then((values) => {
      setVehicles([...vehicles, { ...values, key: Date.now() }]);
      setIsModalVisible(false);
      form.resetFields();
      message.success('Vehicle added successfully!');
    });
  };

  const onFinish = (values) => {
    console.log('Success:', values);
    message.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Make',
      dataIndex: 'make',
      key: 'make',
      responsive: ['md'],
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      responsive: ['lg'],
    },
    {
      title: 'License Plate',
      dataIndex: 'licensePlate',
      key: 'licensePlate',
      responsive: ['sm'],
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => (
        <Tag color={text === 'Premium' ? 'gold' : 'green'}>{text}</Tag>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      {/* Top Header */}
      <Header className="flex items-center justify-between px-8 bg-white border-b">
        <div className="flex items-center gap-4">
          <img 
            src="../../../public/gokeral.png" 
            alt="Logo" 
            className="h-8 w-auto"
          />
          <Title level={4} className="!mb-0"> Go Keral </Title>
        </div>
        <div className="flex items-center gap-4">
          <Button type="text" icon={<BellOutlined />} />
          <Avatar icon={<UserOutlined />} className="bg-blue-500" />
        </div>
      </Header>

      <Content className="p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header Card */}
          <Card 
            className="mb-8 overflow-hidden"
            cover={
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 relative">
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            }
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar 
                size={{ xs: 80, sm: 100, md: 120 }} 
                icon={<UserOutlined />} 
                className="border-4 border-white shadow-lg -mt-16 bg-blue-500"
              />
              <div className="text-center sm:text-left -mt-8 sm:mt-0">
                <Title level={2} className="!mb-0">John Doe</Title>
                <Text className="text-gray-500">{email || 'Professional Driver'}</Text>
              </div>
            </div>
          </Card>

          {/* Main Content Card */}
          <Card className="shadow-sm">
            <Tabs
              defaultActiveKey="1"
              className="full-width-tabs"
              items={[
                {
                  key: '1',
                  label: (
                    <span className="flex items-center px-2">
                      <UserOutlined className="mr-2" />
                      <span className="hidden sm:inline">Profile</span>
                    </span>
                  ),
                  children: (
                    <Form onFinish={onFinish} layout="vertical" className="max-w-4xl">
                      <Row gutter={[24, 16]}>
                        <Col xs={24} sm={12}>
                          <Form.Item 
                            label="Phone Number" 
                            name="phoneNumber"
                            rules={[{ required: true, message: 'Please input your phone number!' }]}
                          >
                            <Input size="large" placeholder="Enter your phone number" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item 
                            label="Date of Birth" 
                            name="dob"
                            rules={[{ required: true, message: 'Please input your date of birth!' }]}
                          >
                            <Input size="large" type="date" />
                          </Form.Item>
                        </Col>
                        <Col xs={24}>
                          <Form.Item 
                            label="Address" 
                            name="address"
                            rules={[{ required: true, message: 'Please input your address!' }]}
                          >
                            <Input.TextArea 
                              rows={3} 
                              size="large"
                              placeholder="Enter your complete address" 
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24}>
                          <Form.Item>
                            <Button type="primary" size="large" htmlType="submit">
                              Update Profile
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  ),
                },
                {
                  key: '2',
                  label: (
                    <span className="flex items-center px-2">
                      <CarOutlined className="mr-2" />
                      <span className="hidden sm:inline">Vehicles</span>
                    </span>
                  ),
                  children: (
                    <div>
                      <div className="mb-6">
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />} 
                          onClick={showModal}
                          size="large"
                        >
                          Add Vehicle
                        </Button>
                      </div>
                      <Table 
                        columns={columns} 
                        dataSource={vehicles}
                        scroll={{ x: true }}
                        className="custom-table"
                        pagination={{
                          responsive: true,
                          defaultPageSize: 5,
                          showSizeChanger: true,
                          showTotal: (total, range) => 
                            `${range[0]}-${range[1]} of ${total} items`
                        }}
                      />
                    </div>
                  ),
                },
                {
                  key: '3',
                  label: (
                    <span className="flex items-center px-2">
                      <SettingOutlined className="mr-2" />
                      <span className="hidden sm:inline">Settings</span>
                    </span>
                  ),
                  children: (
                    <Form layout="vertical">
                      <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                          <Card 
                            title="Notification Settings" 
                            className="h-full shadow-sm hover:shadow-md transition-shadow"
                          >
                            <Form.Item>
                              <Checkbox.Group className="flex flex-col gap-3">
                                <Checkbox value="email">Email Notifications</Checkbox>
                                <Checkbox value="sms">SMS Notifications</Checkbox>
                                <Checkbox value="push">Push Notifications</Checkbox>
                              </Checkbox.Group>
                            </Form.Item>
                          </Card>
                        </Col>
                        <Col xs={24} md={12}>
                          <Card 
                            title="Account Settings" 
                            className="h-full shadow-sm hover:shadow-md transition-shadow"
                          >
                            <Form.Item label="Language">
                              <Select
                                size="large"
                                defaultValue="english"
                                options={[
                                  { value: 'english', label: 'English' },
                                  { value: 'spanish', label: 'Spanish' },
                                  { value: 'french', label: 'French' },
                                ]}
                              />
                            </Form.Item>
                            <Form.Item label="Time Zone">
                              <Select
                                size="large"
                                defaultValue="utc"
                                options={[
                                  { value: 'utc', label: 'UTC (GMT+0)' },
                                  { value: 'est', label: 'EST (GMT-5)' },
                                  { value: 'pst', label: 'PST (GMT-8)' },
                                ]}
                              />
                            </Form.Item>
                          </Card>
                        </Col>
                        <Col xs={24}>
                          <Button type="primary" size="large">Save Settings</Button>
                        </Col>
                      </Row>
                    </Form>
                  ),
                },
              ]}
            />
          </Card>
        </div>
      </Content>

      {/* Vehicle Modal */}
      <Modal
        title="Add New Vehicle"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="make" 
                label="Make" 
                rules={[{ required: true, message: 'Please input vehicle make!' }]}
              >
                <Input size="large" placeholder="Enter vehicle make" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="model" 
                label="Model" 
                rules={[{ required: true, message: 'Please input vehicle model!' }]}
              >
                <Input size="large" placeholder="Enter vehicle model" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="year" 
                label="Year" 
                rules={[{ required: true, message: 'Please input vehicle year!' }]}
              >
                <Input size="large" type="number" placeholder="Enter vehicle year" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="licensePlate" 
                label="License Plate" 
                rules={[{ required: true, message: 'Please input license plate!' }]}
              >
                <Input size="large" placeholder="Enter license plate" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item 
                name="type" 
                label="Type" 
                rules={[{ required: true, message: 'Please select vehicle type!' }]}
              >
                <Select
                  size="large"
                  placeholder="Select vehicle type"
                  options={[
                    { value: 'Standard', label: 'Standard' },
                    { value: 'Premium', label: 'Premium' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Custom styles */}
      <style jsx global>{`
        .ant-tabs-nav {
          margin-bottom: 24px !important;
        }
        
        .ant-tabs-tab {
          padding: 12px 24px !important;
          margin: 0 !important;
        }

        .ant-tabs-tab-active {
          background: rgba(59, 130, 246, 0.1);
          border-radius: 8px;
        }

        .ant-card {
          border-radius: 12px;
        }

        .ant-input, .ant-input-textarea, .ant-select-selector, .ant-btn {
          border-radius: 8px !important;
        }

        .custom-table .ant-table {
          background: transparent;
        }

        .ant-table-thead > tr > th {
          background: #f8fafc !important;
        }

        .full-width-tabs .ant-tabs-nav::before {
          border: none !important;
        }
      `}</style>
    </Layout>
  );
}