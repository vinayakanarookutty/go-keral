import {
    Tabs,
    Card,
    Avatar,
    Typography,
    Form,
    Button,
    Select,
    Checkbox,
    Row,
    Col,
    Layout,
} from "antd";
import { UserOutlined, SettingOutlined, BellOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { Image } from "antd";
const { Title, Text } = Typography;
const { Header, Content } = Layout;
import "@react-pdf-viewer/core/lib/styles/index.css";

export default function DriverProfile() {
    const location = useLocation();
    const { email } = location.state || {};

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
                    <Title level={4} className="!mb-0">
                        {" "}
                        Go Keral{" "}
                    </Title>
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
                            <>
                                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 relative">
                                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                            </>
                        }
                    >
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <Image
                                width={200}
                                src="https://i.pinimg.com/236x/85/59/09/855909df65727e5c7ba5e11a8c45849a.jpg"
                            />
                            <div className="text-center sm:text-left -mt-8 sm:mt-0">
                                <Title level={2} className="!mb-0">
                                    {"Amal Sam Jacob"}
                                </Title>
                                <Text className="text-gray-500">
                                    {email || "Professional Driver"}
                                </Text>
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
                                    key: "1",
                                    label: (
                                        <span className="flex items-center px-2">
                                            <UserOutlined className="mr-2" />
                                            <span className="hidden sm:inline">
                                                Bookings
                                            </span>
                                        </span>
                                    ),
                                    children: (
                                        <>
                                            <div>Booking</div>
                                        </>
                                    ),
                                },
                                {
                                    key: "2",
                                    label: (
                                        <span className="flex items-center px-2">
                                            <SettingOutlined className="mr-2" />
                                            <span className="hidden sm:inline">
                                                Settings
                                            </span>
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
                                                                <Checkbox value="email">
                                                                    Email
                                                                    Notifications
                                                                </Checkbox>
                                                                <Checkbox value="sms">
                                                                    SMS
                                                                    Notifications
                                                                </Checkbox>
                                                                <Checkbox value="push">
                                                                    Push
                                                                    Notifications
                                                                </Checkbox>
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
                                                                    {
                                                                        value: "english",
                                                                        label: "English",
                                                                    },
                                                                    {
                                                                        value: "spanish",
                                                                        label: "Spanish",
                                                                    },
                                                                    {
                                                                        value: "french",
                                                                        label: "French",
                                                                    },
                                                                ]}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label="Time Zone">
                                                            <Select
                                                                size="large"
                                                                defaultValue="utc"
                                                                options={[
                                                                    {
                                                                        value: "utc",
                                                                        label: "UTC (GMT+0)",
                                                                    },
                                                                    {
                                                                        value: "est",
                                                                        label: "EST (GMT-5)",
                                                                    },
                                                                    {
                                                                        value: "pst",
                                                                        label: "PST (GMT-8)",
                                                                    },
                                                                ]}
                                                            />
                                                        </Form.Item>
                                                    </Card>
                                                </Col>
                                                <Col xs={24}>
                                                    <Button
                                                        type="primary"
                                                        size="large"
                                                    >
                                                        Save Settings
                                                    </Button>
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

            {/* Custom styles */}
            {/* <style jsx global>{`
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

                .ant-input,
                .ant-input-textarea,
                .ant-select-selector,
                .ant-btn {
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
            `}</style> */}
        </Layout>
    );
}
