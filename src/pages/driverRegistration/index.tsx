import React from 'react';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';

const { Title, Text } = Typography;

export function DriverRegistrationPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Success:', values);
    message.success('Registration successful!');
    fetch('http://localhost:3000/driversignup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      if(data == "Driver Created Succesfully"){
        navigate('/driverProfile')
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      message.error('Registration failed. Please try again.');
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Registration failed. Please check your inputs.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-400 to-indigo-600">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <img src="/api/placeholder/1000/800" alt="Background" className="object-cover w-full h-full opacity-5" />
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-300 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-300 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>

        {/* Content */}
        <div className="relative z-10">
          <img className="mx-auto h-24 w-auto" src="../../../public/gokeral.png" alt="Company Logo" />
          <Title level={2} className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Driver Registration
          </Title>
          <Text className="mt-2 text-center text-sm text-gray-600 block">
            Join our elite team of professional drivers
          </Text>
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
            name="name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon text-blue-500" />} placeholder="Full Name" className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input prefix={<MailOutlined className="site-form-item-icon text-blue-500" />} placeholder="Email Address" className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input prefix={<PhoneOutlined className="site-form-item-icon text-blue-500" />} placeholder="Phone Number" className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="drivinglicenseNo"
            rules={[{ required: true, message: 'Please input your driving license number!' }]}
          >
            <Input prefix={<Car className="site-form-item-icon text-blue-500" />} placeholder="Driving License No" className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters long!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined className="site-form-item-icon text-blue-500" />} placeholder="Password" className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="confirmpassword"
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined className="site-form-item-icon text-blue-500" />} placeholder="Confirm Password" className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { validator: (_, value) => value ? Promise.resolve() : Promise.reject('Please accept the agreement') },
            ]}
          >
            <Checkbox>
              I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-800">Terms and Conditions</Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-md h-12 text-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Join Our Team
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6 text-center relative z-10">
          <Text className="text-sm text-gray-600">
            Already have an account? <Link to="/driverlogin" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
          </Text>
        </div>
      </div>
    </div>
  );
}

export default DriverRegistrationPage;