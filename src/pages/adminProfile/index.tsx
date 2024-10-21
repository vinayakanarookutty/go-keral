import React, { useEffect, useState } from 'react';
import { Tabs, Card, Avatar, Typography, Form, Input, Button, Table, Tag, Modal, message, Select, Checkbox, Row, Col, Layout, Upload } from 'antd';
import { UserOutlined, CarOutlined, SettingOutlined, PlusOutlined, BellOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { Image } from 'antd';
import PdfComp from '../../components/pdf';

import axios from 'axios';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

import '@react-pdf-viewer/core/lib/styles/index.css';



export default function AdminProfile() {
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [userList, setUserList] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [form] = Form.useForm();
  const location = useLocation();
  const { email } = location.state || {};
  const [vehicles, setVehicles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    fetchBookings();
    fetchVehicles();
    fetchQuotations()
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

  const columnsVehicle = [
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
  

  
  useEffect(() => {
    fetchProfileDetails()
    fetchDriverDetails()
    fetch(`http://localhost:3000/adminDetails?id=${email}`, {
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

  const fetchProfileDetails = async () => {
    try {
      const response = await axios.get('http://localhost:3000/userList');
      console.log('Fetched UserList:', response.data); // Check the structure
      const data = Array.isArray(response.data) ? response.data : [];
      setUserList(data)
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





 



  // Columns configuration with Serial No and Block field
const columns = [
    {
      title: 'Sl No', 
      key: 'slNo',
      render: (text, record, index) => index + 1, // Auto-increment Sl No
    },
    { 
      title: 'Id', 
      dataIndex: '_id', 
      key: 'id' 
    },
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name' 
    },
    { 
      title: 'Email', 
      dataIndex: 'email', 
      key: 'email' 
    },
    { 
      title: 'Block', 
      dataIndex: 'block', 
      key: 'block' 
    },
  ];

  const columnsQuotation = [
    {
      title: 'Sl No',
      key: 'slNo',
      render: (text, record, index) => index + 1, // Auto-increment Sl No
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Booking Date From',
      dataIndex: 'bookingDatefrom',
      key: 'bookingDatefrom',
      render: (date) => formatDate(date), // Format date
    },
    {
      title: 'Booking Date To',
      dataIndex: 'bookingDateto',
      key: 'bookingDateto',
      render: (date) => formatDate(date), // Format date
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
  ];
  
  // Utility function to format date
  const formatDate = (dateString) => {
    if (!dateString) return ''; // Handle empty date
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  };
  
  
  const columns2 = [
    { title: 'Origin', dataIndex: 'origin', key: 'origin' },
    { title: 'Destination', dataIndex: 'destination', key: 'destination' },
    { title: 'Distance', dataIndex: 'distance', key: 'distance' },
    { title: 'Duration', dataIndex: 'duration', key: 'duration' },
    { title: 'DriverName', dataIndex: 'driverName', key: 'driverName' },
    
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
                      <span className="hidden sm:inline">Users</span>
                    </span>
                  ),
                  children: (
                    <>
                    <h1>Users</h1>
                    <Table
  columns={columns}
  dataSource={userList|| []} // Default to empty array
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
                    </>
                  ),
                },
                {
                  key: '2',
                  label: (
                    <span className="flex items-center px-2">
                      <CarOutlined className="mr-2" />
                      <span className="hidden sm:inline">Drivers</span>
                    </span>
                  ),
                  children: (
                   <>
                    <h1>Drivers</h1>
                    <Table
  columns={columns}
  dataSource={driverList|| []} // Default to empty array
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
                   </>
                  ),
                },
                {
                  key: '3',
                  label: (
                    <span className="flex items-center px-2">
                      <SettingOutlined className="mr-2" />
                      <span className="hidden sm:inline">Pins</span>
                    </span>
                  ),
                  children: (
                    <>
                    <h1>Pins</h1>
                    <Table
  columns={columns}
  dataSource={userList|| []} // Default to empty array
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
                    </>
                  ),
                },
                {
                  key: '5',
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
                  key: '6',
                  label: (
                    <span className="flex items-center px-2">
                      <CarOutlined className="mr-2" />
                      <span className="hidden sm:inline">Vehicles</span>
                    </span>
                  ),
                  children: (
                    <div>
                     
                      <Table
  columns={columnsVehicle}
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
                  key: '7',
                  label: (
                    <span className="flex items-center px-2">
                      <CarOutlined className="mr-2" />
                      <span className="hidden sm:inline">Quatations</span>
                    </span>
                  ),
                  children: (
                   <>
                    <h1>Quatations</h1>
                    <Table
  columns={columnsQuotation}
  dataSource={quotations|| []} // Default to empty array
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
                   </>
                  ),
                },
              ]}
            />
          </Card>
        </div>
      </Content>

      {/* Vehicle Modal */}
   

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