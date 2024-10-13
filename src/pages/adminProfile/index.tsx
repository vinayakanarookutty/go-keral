import React, { useEffect, useState } from 'react';
import { Tabs, Card, Avatar, Typography, Form, Input, Button, Table, Tag, Modal, message, Select, Checkbox, Row, Col, Layout, Upload } from 'antd';
import { UserOutlined, CarOutlined, SettingOutlined, PlusOutlined, BellOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { Image } from 'antd';

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
              <Image
                width={200}
                src="https://media.licdn.com/dms/image/v2/D4D03AQEC69DCIIkfBQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1700038154034?e=1733961600&v=beta&t=OWhxPsXrtwd8658lrZKp4Nd5b9esgT8H8qorLeuStZw"
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