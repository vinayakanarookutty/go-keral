import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../public/gokeral.png";
import background_img from "../../../public/background.jpg";
import { useUserStore } from "../../store/user";
import { useState } from "react";


const [isHovering, setisHovering] = useState(false);

export function DriverRegistrationPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const login = useUserStore((state: any) => state?.loginUser);
  
  const onFinish = (values: any) => {
    console.log("Success:", values);
    message.success("Registration successful!");
    fetch(`${import.meta.env.VITE_API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message == "User Created Succesfully") {
          navigate("/");
          login({ email: data.user.email, name: data.user.name });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Registration failed. Please try again.");
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    message.error("Registration failed. Please check your inputs.");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background_img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="h-dvh flex items-center justify-center sm:px-6 lg:px-8"
    >
      <style>
        {` @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;500;600&display=swap');`}
      </style>

      <div className="w-full h-full bg-black/50 p-6 box-border flex flex-col justify-between gap-2">
        {/* Icon and Heading */}
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} alt="" className="w-20 sm:w-24 lg:w-28 aspect-square mb-4" />
          <span
            className="text-[#D4AF37] uppercase font-bold text-lg sm:text-xl"
            style={{ fontFamily: "Montserrat" }}
          >
            Registration
          </span>
        </div>

        {/* Form */}
        <Form
          form={form}
          name="user_registration"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Please input your full name!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon text-[#D4AF37]" />}
              placeholder="Full Name"
              className="bg-transparent border-0 border-b-2 border-[#D4AF37] focus:border-[#D4AF37] focus:outline-none rounded-none p-2 text-[#D4AF37] "
              style={{ backgroundColor: "transparent", boxShadow: "none" }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon text-[#D4AF37]" />}
              placeholder="Email Address"
              className="bg-transparent border-0 border-b-2 border-[#D4AF37] focus:border-[#D4AF37] focus:outline-none rounded-none p-2 text-[#D4AF37] "
              style={{ backgroundColor: "transparent", boxShadow: "none" }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="site-form-item-icon text-[#D4AF37]" />}
              placeholder="Phone Number"
              className="bg-transparent border-0 border-b-2 border-[#D4AF37] focus:border-[#D4AF37] focus:outline-none rounded-none p-2 text-[#D4AF37] "
              style={{ backgroundColor: "transparent", boxShadow: "none" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters long!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon text-[#D4AF37]" />}
              placeholder="Password"
              className="bg-transparent border-0 border-b-2 border-[#D4AF37] focus:border-[#D4AF37] focus:outline-none rounded-none p-2 text-[#D4AF37] "
              style={{ backgroundColor: "transparent", boxShadow: "none" }}
            />
          </Form.Item>

          <Form.Item
            name="confirmpassword"
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon text-[#D4AF37]" />}
              placeholder="Confirm Password"
              className="bg-transparent border-0 border-b-2 border-[#D4AF37] focus:border-[#D4AF37] focus:outline-none rounded-none text-[#D4AF37] "
              style={{ backgroundColor: "transparent", boxShadow: "none" }}
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject("Please accept the agreement"),
              },
            ]}
          >
            <Checkbox className="text-white">
              I agree to the{" "}
              <Link to="/terms" className="text-[#D4AF37] hover:text-blue-800">
                Terms and Conditions
              </Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "transparent", borderColor: "#D4AF37" }}
              className="w-full border text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white h-12 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Join Our Team
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center">
          <Text className="text-sm text-white">
            Already have an account?{" "}
            <Link to="/userlogin" className="font-medium text-[#D4AF37] ">
              Sign in
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
}

export default DriverRegistrationPage;