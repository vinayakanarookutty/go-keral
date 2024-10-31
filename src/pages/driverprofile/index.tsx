import React, { useEffect, useState } from 'react';
import { Tabs, Card, Avatar, Typography, Form, Input, Button, Table, Tag, Modal, message, Select, Checkbox, Row, Col, Layout, Upload } from 'antd';
import { UserOutlined, CarOutlined, SettingOutlined, PlusOutlined, BellOutlined,LogoutOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Image } from 'antd';

import { UploadOutlined,LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Header, Content } = Layout;
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import PdfComp from '../../components/pdf';
import { useUserStore } from '../../store/user';
import { NotFound } from '../../components/notFound';
import DriverPersonalModal from '../../modal/DriverPersonalModal';
import DriverAddVehicleModal from '../../modal/DriverVehicleModal';


export default function DriverProfile() {

 
  const [userDetails, setUserDetails] = useState({});
 
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const user = useUserStore((state: any) => state?.userDetails);
  const logoutUser = useUserStore((state: any) => state?.logoutUser);
console.log(userDetails)
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
 
  useEffect(() => {
    fetch(`http://localhost:3000/driverDetails?id=${user?.email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

    })
      .then(response => response.json())
      .then(data => {
        setUserDetails(data);
        console.log(data)
        setImageUrl(data.imageUrl)
      })
      .catch((error) => {
        console.error('Error:', error);
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

 



  const onFinish = (values) => {
    console.log('Success:', values);
    // Append files

    message.success('Profile updated successfully!');
  };

 
  
  const [loading, setLoading] = useState(true);




  
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
  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

    const [imageUrl, setImageUrl] = useState<string>();
  
    const handleChange: UploadProps['onChange'] = (info) => {
     
        // Get this url from response in real world.
        getBase64(info.file.originFileObj as FileType, (url) => {
          setLoading(false);
          setImageUrl(url);
          const value={
            imageUrl:imageUrl,
            mail:user?.email}
          try {
            fetch("http://localhost:3000/updateDriver", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(value),
            })
          } catch (error) {
            console.error('Error submitting form: ', error);
          }
        });
      
    };
  
    const uploadButton = (
      <button style={{ border: 0, background: 'none' }} type="button">
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </button>
    );
  
  return (
      user.name ?  <Layout className="min-h-screen">
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
        <Button onClick={() => { logoutUser();  navigate('/driverLogin') }}><LogoutOutlined /></Button> 
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
            <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <Image
      src={imageUrl}
      alt="Profile Picture"
      width={200} // Specify the width here
      height={100} // Specify the height here
     /> : uploadButton}
      </Upload>
              <div className="text-center sm:text-left -mt-8 sm:mt-0">
                <Title level={2} className="!mb-0">{user.name}</Title>
                <Text className="text-gray-500">{userDetails?.email|| 'Professional Driver'}</Text>
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
                      <span className="hidden sm:inline">Personal Informations</span>
                    </span>
                  ),
                  children: (
                   <DriverPersonalModal personalInfo={userDetails?.personalInformation} email={user?.email}/>
                  ),
                },
                {
                  key: '2',
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
                  key: '3',
                  label: (
                    <span className="flex items-center px-2">
                      <CarOutlined className="mr-2" />
                      <span className="hidden sm:inline">Vehicles</span>
                    </span>
                  ),
                  children: (
                  <DriverAddVehicleModal/>
                  ),
                },
                {
                  key: '4',
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
    

    
    </Layout> :<NotFound/>
  );
}