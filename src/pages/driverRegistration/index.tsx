import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import { useUserStore } from '../../store/user';
import Logo from "../../../public/gokeral.png";
import background_img from "../../../public/background.jpg";

const { Title, Text } = Typography;

export function DriverRegistrationPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const login = useUserStore((state:any) => state?.loginUser);

  const onFinish = (values:any) => {
    console.log('Success:', values);
    message.success('Registration successful!');
    fetch(`${import.meta.env.VITE_API_URL}/driversignup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
    .then(response => response.json())
    .then(data => {
      if(data.message == "Driver Created Succesfully"){
        navigate('/driverProfile')
        login({email:data.user.email,name:data.user.name})
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      message.error('Registration failed. Please try again.');
    });
  };

  const onFinishFailed = (errorInfo:any) => {
    console.log('Failed:', errorInfo);
    message.error('Registration failed. Please check your inputs.');
  };

  return (
    <div 
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background_img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm p-10 rounded-xl shadow-2xl relative">
        {/* Glassmorphism effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl backdrop-blur-sm -z-10" />
        
        {/* Logo and Title */}
        <div className="relative z-10 text-center">
          <img 
            className="mx-auto h-24 w-auto transform transition-transform duration-500 hover:scale-105" 
            src={Logo} 
            alt="Gokeral Logo" 
          />
          <Title level={2} className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Partner with Us
          </Title>
          <Text className="mt-2 text-center text-sm text-gray-600 block font-medium">
            Join our professional driver network
          </Text>
        </div>
        
        {/* Registration Form */}
        <Form
          form={form}
          name="driver_registration"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          className="mt-8 space-y-5 relative z-10"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input 
              prefix={<UserOutlined className="text-blue-500" />} 
              placeholder="Full Name" 
              className="h-11 rounded-lg border-gray-200 hover:border-blue-500 transition-colors" 
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-blue-500" />} 
              placeholder="Email Address" 
              className="h-11 rounded-lg border-gray-200 hover:border-blue-500 transition-colors" 
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input 
              prefix={<PhoneOutlined className="text-blue-500" />} 
              placeholder="Phone Number" 
              className="h-11 rounded-lg border-gray-200 hover:border-blue-500 transition-colors" 
            />
          </Form.Item>

          <Form.Item
            name="drivinglicenseNo"
            rules={[{ required: true, message: 'Please input your driving license number!' }]}
          >
            <Input 
              prefix={<Car className="text-blue-500" size={16} />} 
              placeholder="Driving License No" 
              className="h-11 rounded-lg border-gray-200 hover:border-blue-500 transition-colors" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters long!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-blue-500" />} 
              placeholder="Password" 
              className="h-11 rounded-lg border-gray-200 hover:border-blue-500 transition-colors" 
            />
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
            <Input.Password 
              prefix={<LockOutlined className="text-blue-500" />} 
              placeholder="Confirm Password" 
              className="h-11 rounded-lg border-gray-200 hover:border-blue-500 transition-colors" 
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { validator: (_, value) => value ? Promise.resolve() : Promise.reject('Please accept the agreement') },
            ]}
          >
            <Checkbox className="text-gray-600">
              I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-800 font-medium">Terms and Conditions</Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg h-12 text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] border-0 shadow-lg hover:shadow-xl"
            >
              Join Our Team
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6 text-center relative z-10">
          <Text className="text-gray-600">
            Already have an account?{' '}
            <Link to="/driverlogin" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
              Sign in
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
}

export default DriverRegistrationPage;