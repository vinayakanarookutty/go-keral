import { useEffect, useState } from 'react';
import { Tabs, Card, Typography, Form, Button, Table, message, Select, Checkbox, Row, Col, Layout, Upload, Image } from 'antd';
import { UserOutlined, SettingOutlined, PlusOutlined, BellOutlined, LogoutOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from "../../../public/gokeral.png"

const { Title, Text } = Typography;
const { Header, Content } = Layout;

import '@react-pdf-viewer/core/lib/styles/index.css';

import { useUserStore } from '../../store/user';
import { NotFound } from '../../components/notFound';
import UserPersonalModal from '../../modal/UserPersonalModal';

interface UserDetails {
  email?: string;
  personalInformation?: any;
  imageUrl?: string;
}

interface Booking {
  user:any,
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  driverName: string;
  vehicleName: string;
  _id: string;
}

export default function UserProfile() {
  const [userDetails, setUserDetails] = useState<UserDetails>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const navigate = useNavigate();
  const user = useUserStore((state: any) => state?.userDetails);
  const logoutUser = useUserStore((state: any) => state?.logoutUser);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/bookings`);
      const filteredBookings = user?.email
        ? response.data.filter((booking: Booking) => booking?.user === user?.email)
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
    fetch(`${import.meta.env.VITE_API_URL}/userDetails?id=${user?.email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setUserDetails(data);
        setImageUrl(data.imageUrl);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

 

  const columns2 = [
    { title: 'Origin', dataIndex: 'origin', key: 'origin' },
    { title: 'Destination', dataIndex: 'destination', key: 'destination' },
    { title: 'Distance', dataIndex: 'distance', key: 'distance' },
    { title: 'Duration', dataIndex: 'duration', key: 'duration' },
    { title: 'Driver Name', dataIndex: 'driverName', key: 'driverName' },
    { title: 'Vehicle Name', dataIndex: 'vehicleName', key: 'vehicleName' },
  ];

  const getBase64 = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(file);
  };

  const beforeUpload = (file: File) => {
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

  const handleChange = (info:any) => {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as File, (url) => {
        setLoading(false);
        setImageUrl(url);
        const value = {
          imageUrl: url,
          mail: user?.email,
        };
        try {
          fetch(`${import.meta.env.VITE_API_URL}/updateUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value),
          });
        } catch (error) {
          console.error('Error submitting form: ', error);
        }
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    user?.name ? (
      <Layout className="min-h-screen">
        <Header className="flex items-center justify-between px-8 bg-white border-b">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="Logo" className="h-8 w-auto" />
            <Title level={4} className="!mb-0">Go Keral</Title>
          </div>
          <div className="flex items-center gap-4">
            <Button type="text" icon={<BellOutlined />} />
            <Button onClick={() => { logoutUser(); navigate('/userLogin'); }}><LogoutOutlined /></Button>
          </div>
        </Header>
        <Content className="p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Card className="mb-8 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? <Image src={imageUrl} alt="Profile Picture" width={200} height={100} /> : uploadButton}
                </Upload>
                <div className="text-center sm:text-left -mt-8 sm:mt-0">
                  <Title level={2} className="!mb-0">{user.name}</Title>
                  <Text className="text-gray-500">{userDetails?.email || 'Professional Driver'}</Text>
                </div>
              </div>
            </Card>
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
                        <span className="hidden sm:inline">Personal Information</span>
                      </span>
                    ),
                    children: <UserPersonalModal personalInfo={userDetails?.personalInformation} email={user?.email} />,
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
                      <Table
                        columns={columns2}
                        dataSource={bookings}
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
                            <Card title="Notification Settings" className="h-full shadow-sm">
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
                            <Card title="Account Settings" className="h-full shadow-sm">
                              <Form.Item label="Language">
                                <Select
                                  size="large"
                                  defaultValue="english"
                                  options={[
                                    { value: 'english', label: 'English' },
                                    { value: 'hindi', label: 'Hindi' },
                                    { value: 'malayalam', label: 'Malayalam' },
                                  ]}
                                />
                              </Form.Item>
                            </Card>
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
      </Layout>
    ) : <NotFound />
  );
}
