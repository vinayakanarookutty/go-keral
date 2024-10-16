import React, { useEffect, useState } from 'react';
import { Tabs, Card, Avatar, Typography, Form, Input, Button, Table, Tag, Modal, message, Select, Checkbox, Row, Col, Layout, Upload } from 'antd';
import { UserOutlined, CarOutlined, SettingOutlined, PlusOutlined, BellOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
const { Dragger } = Upload;
const { Title, Text } = Typography;
const { Header, Content } = Layout;
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import PdfComp from '../../components/pdf';


export default function DriverProfile() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [form] = Form.useForm();
  const location = useLocation();
  const { email } = location.state || {};
  const [fileList1, setFileList1] = useState([]);
  const [fileList2, setFileList2] = useState([]);
  const [fileList3, setFileList3] = useState([]);
  const [fileList4, setFileList4] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [bookings, setBookings] = useState([]);
  

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
  const showModal = () => setIsModalVisible(true);
  useEffect(() => {
    fetch(`http://localhost:3000/driverDetails?id=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

    })
      .then(response => response.json())
      .then(data => {
        setUserDetails(data);
        console.log(data)

      })
      .catch((error) => {
        console.error('Error:', error);
        message.error('Registration failed. Please try again.');
      });
  }, [])


  // //vehicle fetching
  // useEffect(() => {
  //   fetch(`http://localhost:3000/getvehicles`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       setGetVehicles(data);
  //       console.log(data)

  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //       message.error('Registration failed. Please try again.');
  //     });
  // }, [])

  const handleOk = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();

      // Append form fields
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      // Append files
      if (fileList1[0]) formData.append('Driving_Licence', fileList1[0].originFileObj);
      if (fileList2[0]) formData.append('Vehicle_Insurance_Proof', fileList2[0].originFileObj);
      if (fileList3[0]) formData.append('Proof_Of_Address', fileList3[0].originFileObj);
      if (fileList4[0]) formData.append('Police_Clearance_Certificate', fileList4[0].originFileObj);

      // Send the FormData to your backend
      fetch('http://localhost:3000/addvehicles', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          message.success('Vehicle added successfully!');
          setIsModalVisible(false);
          form.resetFields();
        })
        .catch((error) => {
          console.error('Error:', error);
          message.error('Failed to add vehicle.');
        });
    });
  };



  const onFinish = (values) => {
    console.log('Success:', values);
    // Append files

    message.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
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
  const handleFileClick = async (filePath) => {
    console.log("haiiii")
    setPdfFile(`http://localhost:3000/${filePath}`);
    const response = await fetch(`http://localhost:3000/${filePath}`);
  
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Open the PDF in a new window or tab
      window.open(url, '_blank');
    }
  };

  const columns = [
    { title: 'Make', dataIndex: 'make', key: 'make' },
    { title: 'Model', dataIndex: 'model', key: 'model' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'License Plate', dataIndex: 'licensePlate', key: 'licensePlate' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    {
      title: 'Driving Licence',
      dataIndex: 'Driving_Licence',
      key: 'Driving_Licence',
      render: (text, record) => (
        <Button onClick={() => handleFileClick(record.Driving_Licence)}>
          View Driving Licence
        </Button>
      ),
    },
    {
      title: 'Vehicle Insurance Proof',
      dataIndex: 'Vehicle_Insurance_Proof',
      key: 'Vehicle_Insurance_Proof',
      render: (text, record) => (
        <Button onClick={() => handleFileClick(record.Vehicle_Insurance_Proof)}>
          View Insurance
        </Button>
      ),
    },
    {
      title: 'Proof Of Address',
      dataIndex: 'Proof_Of_Address',
      key: 'Proof_Of_Address',
      render: (text, record) => (
        <Button onClick={() => handleFileClick(record.Proof_Of_Address)}>
          View Address Proof
        </Button>
      ),
    },
    {
      title: 'Police Clearance Certificate',
      dataIndex: 'Police_Clearance_Certificate',
      key: 'Police_Clearance_Certificate',
      render: (text, record) => (
        <Button onClick={() => handleFileClick(record.Police_Clearance_Certificate)}>
          View Police Certificate
        </Button>
      ),
    },
  ];
  
  const columns2 = [
    { title: 'Origin', dataIndex: 'origin', key: 'origin' },
    { title: 'Destination', dataIndex: 'destination', key: 'destination' },
    { title: 'Distance', dataIndex: 'distance', key: 'distance' },
    { title: 'Duration', dataIndex: 'duration', key: 'duration' },
    { title: 'DriverName', dataIndex: 'driverName', key: 'driverName' },
    
  ];

  const handleUpload = (info, setFileList) => {
    const { fileList } = info;
    setFileList(fileList.slice(-1)); // Only keep the last file
  };
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

      <Content  className="p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header Card */}
          <Card
            className="mb-8 overflow-hidden"
            cover={
              // <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 relative">
              //   <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
              // </div>
              <>
              
              </>
            }
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Image
                width={200}
                src="https://i.pinimg.com/236x/85/59/09/855909df65727e5c7ba5e11a8c45849a.jpg"
              />
              <div className="text-center sm:text-left -mt-8 sm:mt-0">
                <Title level={2} className="!mb-0">{userDetails?.name}</Title>
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
                      <span className="hidden sm:inline">Bookings</span>
                    </span>
                  ),
                  children: (
                    <div>
                     
                      <Table
  columns={columns2}
  dataSource={bookings || []} // Default to empty array
  scroll={{ x: true }}
  className="custom-table"
  pagination={{
    responsive: true,
    defaultPageSize: 5,
    showSizeChanger: true,
    showTotal: (total, range) =>
      `${range[0]}-${range[1]} of ${total} items`,
  }}
  loading={loading}
  rowKey="_id"
/>

                    </div>
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
  dataSource={vehicles || []} // Default to empty array
  scroll={{ x: true }}
  className="custom-table"
  pagination={{
    responsive: true,
    defaultPageSize: 5,
    showSizeChanger: true,
    showTotal: (total, range) =>
      `${range[0]}-${range[1]} of ${total} items`,
  }}
  loading={loading}
  rowKey="_id"
/>
{pdfFile && (
        <div style={{ marginTop: 20 }}>
          <h3>PDF Preview</h3>
          <div style={{ height: '750px' }}>
          {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
  <Viewer fileUrl={pdfFile} />
</Worker> */}
  <PdfComp pdfFile={pdfFile}/>
  
          </div>
        </div>
      )}
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
        <Form form={form} layout="vertical"  >
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
                    { value: 'Premium', label: 'Premium' },
                    { value: 'Luxury', label: 'Luxury' },
                  ]}
                />
              </Form.Item>
            </Col>
            {/* Upload Fields */}
            <Col xs={24} sm={12}>
              <Form.Item label="Driving Licence" required>
                <Dragger
                  fileList={fileList1}
                  beforeUpload={() => false}
                  onChange={(info) => handleUpload(info, setFileList1)}
                >
                  <Button icon={<UploadOutlined />}>Driving Licence</Button>
                </Dragger>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Vehicle Insurance Proof" required>
                <Dragger
                  fileList={fileList2}
                  beforeUpload={() => false}
                  onChange={(info) => handleUpload(info, setFileList2)}
                >
                  <Button icon={<UploadOutlined />}>Vehicle Insurance Proof</Button>
                </Dragger>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Proof Of Address" required>
                <Dragger
                  fileList={fileList3}
                  beforeUpload={() => false}
                  onChange={(info) => handleUpload(info, setFileList3)}
                >
                  <Button icon={<UploadOutlined />}>Proof Of Address</Button>
                </Dragger>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Police Clearance Certificate" required>
                <Dragger
                  fileList={fileList4}
                  beforeUpload={() => false}
                  onChange={(info) => handleUpload(info, setFileList4)}
                >
                  <Button icon={<UploadOutlined />}>Police Clearance Certificate</Button>
                </Dragger>
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