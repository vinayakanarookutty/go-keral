import { Form, Input, Button, Typography, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

export default function UserLogin() {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log("Success:", values);
        navigate("/user-registration");
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <>
            <div
                style={{
                    backgroundImage: "url('../../../public/background.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-r "
            >
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl relative overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                        <img
                            src="/api/placeholder/1000/800"
                            alt="Background"
                            className="object-cover w-full h-full opacity-5"
                        />
                    </div>
                    {/* <div className="absolute top-0 right-0 w-40 h-40 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40  rounded-full transform -translate-x-1/3 translate-y-1/3"></div> */}

                    {/* Content */}
                    <div className="relative">
                        {/* <img
                            className="mx-auto h-24 w-auto"
                            src="../../../public/gokeral.png"
                            alt="Company Logo"
                        /> */}
                        <Title
                            level={2}
                            className=" text-center text-3xl font-extrabold text-grey-600 "
                            style={{ letterSpacing: "3px", color: "#1677ff" }}
                        >
                            User Login
                        </Title>
                        {/* <Text className=" text-center text-lg text-gray-600 block">
                            Welcome Back
                        </Text> */}
                    </div>

                    <Form
                        form={form}
                        name="driver_registration"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        layout="vertical"
                        className="mt-8 space-y-6 relative z-10"
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Email !",
                                },
                            ]}
                        >
                            <Input
                                prefix={
                                    <MailOutlined className="site-form-item-icon text-blue-500" />
                                }
                                placeholder="Email"
                                className="rounded-md"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password!",
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={
                                    <LockOutlined className="site-form-item-icon text-blue-500" />
                                }
                                placeholder="Password"
                                className="rounded-md"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-md h-12 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                            >
                                Welcome Back
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="mt-0 text-center relative z-10">
                        <Text className="text-sm text-gray-600">
                            New to <span>Go Keral </span>
                            <Link
                                to="/user-registration"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Sign Up
                            </Link>
                        </Text>
                    </div>
                </div>
            </div>{" "}
        </>
    );
}
