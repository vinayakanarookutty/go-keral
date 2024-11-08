import { useEffect, useState } from 'react';
import { Tabs, Card,  Typography, Form,  Button, Table,  message, Select, Checkbox, Row, Col, Layout, Upload } from 'antd';
import { UserOutlined, CarOutlined, SettingOutlined, PlusOutlined, BellOutlined,LogoutOutlined } from '@ant-design/icons';
import {  useNavigate } from 'react-router-dom';
import { Image } from 'antd';
import Logo from "../../../public/gokeral.png"

import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

import '@react-pdf-viewer/core/lib/styles/index.css';

import { useUserStore } from '../../store/user';
import { NotFound } from '../../components/notFound';
import DriverPersonalModal from '../../modal/DriverPersonalModal';
import DriverAddVehicleModal from '../../modal/DriverVehicleModal';


export default function DriverProfile() {
  interface PersonalInformation {
    dob: string;
    address: string;
  }
  
  interface UserDetails {
    _id: string;
    name: string;
    email: string;
    phone: number;
    password: string;
    agreement: boolean;
    drivinglicenseNo: string;
    __v: number;
    imageUrl: string;
    personalInformation: PersonalInformation;
    languages: string[];
    area: string;
    certifications: string[];
    emergencyContact: string;
    mail: string;
  }
  
  
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/bookings`);
      const filteredBookings = user.email
        ? response.data.filter((booking:any) => booking.driverName === user.name)
        : response.data;
  
      setBookings(filteredBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      message.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };
  
 
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/driverDetails?id=${user?.email}`, {
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

 



  // const onFinish = (values:any) => {
  //   console.log('Success:', values);
  //   // Append files

  //   message.success('Profile updated successfully!');
  // };

 
  
  const [loading, setLoading] = useState(true);




  
  const columns2 = [
    { title: 'Origin', dataIndex: 'origin', key: 'origin' },
    { title: 'Destination', dataIndex: 'destination', key: 'destination' },
    { title: 'Distance', dataIndex: 'distance', key: 'distance' },
    { title: 'Duration', dataIndex: 'duration', key: 'duration' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Passanger Name', dataIndex: 'passengerName', key: 'passengerName' },
    { title: 'Passanger Phone No', dataIndex: 'phoneNumber', key: 'phoneNumber' },
  ];

  


  type FileType = File;
  
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
      message.error('Image must be smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  
    const handleChange= (info:any) => {
     
        // Get this url from response in real world.
        getBase64(info.file.originFileObj as FileType, (url) => {
          setLoading(false);
          setImageUrl(url);
          const value={
            imageUrl:imageUrl,
            mail:user?.email}
          try {
            fetch(`${import.meta.env.VITE_API_URL}/updateDriver`, {
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
            src={Logo}
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