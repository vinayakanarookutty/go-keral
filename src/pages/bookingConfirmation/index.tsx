import { IndianRupee, TicketMinus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import dayjs from "dayjs";
import {
  Typography,
  Avatar,
  Spin,
  Rate,
  message,
  Input,
  Card,
  Button,
  Steps,
  Timeline,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

interface BookingDetails {
  origin: string;
  destination: string;
  distance: number;
  duration: number;
}

interface Driver {
  id: number;
  name: string;
  rating: number;
  experience: number;
  imageUrl?: string;
  languages?: string;
  licenseType?: string;
}

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails: BookingDetails = location.state || {
    origin: "Cochin",
    destination: "Munnar",
    distance: 120,
    duration: 180,
  };
console.log(bookingDetails.selectedDate)
  const [loading, setLoading] = useState(true);
  const [driverList, setDriverList] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    fetchDriverDetails();
  }, []);

  const fetchDriverDetails = async () => {
    try {
      const response = await axios.get("http://localhost:3000/driverList");
      setDriverList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      message.error("Failed to fetch drivers");
    } finally {
      setLoading(false);
    }
  };

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
  };

  const confirmBooking = async () => {
    if (!selectedDriver) {
      message.error("Please select a driver");
      return;
    }

    setLoading(true);
    try {
      const bookingDataToSubmit = {
        ...bookingDetails,
        driverId: selectedDriver.id,
        driverName: selectedDriver.name,
        driverRating: selectedDriver.rating,
      };

      const response = await axios.post(
        "http://localhost:3000/bookings",
        bookingDataToSubmit
      );

      if (response.status === 201) {
        message.success("Booking confirmed successfully!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        throw new Error("Booking failed");
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      message.error("An error occurred while confirming the booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = driverList.filter((driver) =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-xl rounded-2xl border-0">
          <Steps
            current={currentStep}
            onChange={setCurrentStep}
            items={[
              { title: "Trip Details" },
              { title: "Select Driver" },
              { title: "Confirm" },
            ]}
            className="mb-8"
          />

          {/* Trip Details */}
          {currentStep === 0 && (
            <Card className="rounded-xl shadow-sm bg-white">
              <Title level={2} className="text-center mb-8">Trip Details</Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Timeline
                  items={[
                    {
                      dot: <EnvironmentOutlined className="text-indigo-500" />,
                      children: (
                        <div>
                          <Text type="secondary">From</Text>
                          <Title level={3}>{bookingDetails.origin}</Title>
                        </div>
                      ),
                    },
                    {
                      dot: <EnvironmentOutlined className="text-purple-500" />,
                      children: (
                        <div>
                          <Text type="secondary">To</Text>
                          <Title level={3}>{bookingDetails.destination}</Title>
                        </div>
                      ),
                    },
                  ]}
                />
                
                <Card className="bg-gray-50">
                  <div className="space-y-6">
                    <div>
                      <ClockCircleOutlined className="text-indigo-500 text-xl mb-2" />
                      <Text type="secondary" className="block">Duration</Text>
                      <Title level={3}>{bookingDetails.duration} minutes</Title>
                    </div>
                    <div>
                      <RightOutlined className="text-indigo-500 text-xl mb-2" />
                      <Text type="secondary" className="block">Distance</Text>
                      <Title level={3}>{bookingDetails.distance} km</Title>
                    </div>
                  </div>
                </Card>
                
              </div>
              <div style={{display:"flex"}}>
              <div style={{display:"flex"}}>
                                                        <IndianRupee className="text-blue-500 text-xl mb-2 " />
                                                        <Text
                                                            type="secondary"
                                                            className="block"
                                                        >
                                                         Service :{bookingDetails.serviceType}
                                                        </Text>
                                                        <Title level={3}>
                                                          Rs  {
                                                          bookingDetails.serviceType == "Luxury" ?bookingDetails.luxuryPrice : bookingDetails.premiumPrice

                                                        } 
                                                        </Title>
              </div>
              <div style={{display:"flex"}}>
                                                        <TicketMinus className="text-blue-500 text-xl mb-2  ml-10" />
                                                        <Text
                                                            type="secondary"
                                                            className="block"
                                                        >
                                                         Date :{bookingDetails.selectedDate ? dayjs(bookingDetails.selectedDate).format("YYYY-MM-DD") : "Not selected"}
                                                        </Text>
                                                        <Title level={3}>
                                                          Time {
                                                          bookingDetails.selectedTime ? dayjs(bookingDetails.selectedTime).format("HH:mm") : "Not selected"

                                                        } 
                                                        </Title>
              </div>
              </div>
             
            </Card>
          )}

          {/* Driver Selection */}
          {currentStep === 1 && (
            <div>
              <Title level={2} className="text-center mb-8">Select Your Driver</Title>
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search drivers by name"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-8"
                size="large"
              />
              {loading ? (
                <div className="text-center py-8">
                  <Spin size="large" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDrivers.map((driver) => (
                    <Card
                      key={driver.id}
                      hoverable
                      className={`transform transition-all duration-300 hover:scale-105 ${
                        selectedDriver?.id === driver.id
                          ? "ring-2 ring-indigo-500 shadow-lg"
                          : "hover:shadow-xl"
                      }`}
                      onClick={() => handleDriverSelect(driver)}
                    >
                      <div className="text-center">
                        <div className="relative inline-block">
                          <Avatar
                            size={80}
                            icon={<UserOutlined />}
                            src={driver.imageUrl}
                            className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500"
                          />
                          {selectedDriver?.id === driver.id && (
                            <div className="absolute -top-2 -right-2 w-6 h-6  rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">✓</span>
                            </div>
                          )}
                        </div>
                        <Title level={4} className="mb-2">{driver.name}</Title>
                        <Rate
                          disabled
                          defaultValue={driver.rating}
                          className="mb-4 text-indigo-500"
                        />
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-2">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                              {driver.languages || "Malayalam"}
                            </span>
                          </div>
                          <div className="flex items-center justify-center space-x-2">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                              {driver.licenseType || "Commercial"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Confirmation */}
          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto">
              <Title level={2} className="text-center mb-8">Booking Summary</Title>
              <Card className="mb-6 bg-gray-50">
                <Title level={4}>Trip Details</Title>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text type="secondary">From</Text>
                    <div className="font-semibold">{bookingDetails.origin}</div>
                  </div>
                  <div>
                    <Text type="secondary">To</Text>
                    <div className="font-semibold">{bookingDetails.destination}</div>
                  </div>
                  <div>
                    <Text type="secondary">Distance</Text>
                    <div className="font-semibold">{bookingDetails.distance} km</div>
                  </div>
                  <div>
                    <Text type="secondary">Duration</Text>
                    <div className="font-semibold">{bookingDetails.duration} minutes</div>
                  </div>
                </div>
              </Card>

              <Card className="mb-6">
                <Title level={4}>Selected Driver</Title>
                {selectedDriver ? (
                  <div className="flex items-center space-x-4">
                    <Avatar
                      size={60}
                      icon={<UserOutlined />}
                      src={selectedDriver.imageUrl}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                    <div>
                      <Title level={5}>{selectedDriver.name}</Title>
                      <Rate disabled defaultValue={selectedDriver.rating} className="text-indigo-500" />
                      <p>Language: {selectedDriver.languages || "Malayalam"}</p>
                    </div>
                  </div>
                ) : (
                  <Text type="warning">Please select a driver</Text>
                )}
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="border-indigo-500 text-indigo-500 hover:bg-indigo-50"
              >
                Previous
              </Button>
            )}
            {currentStep < 2 ? (
              <Button
                type="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 1 && !selectedDriver}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={confirmBooking}
                disabled={!selectedDriver || loading}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </Button>
            )}
          </div>
        </Card>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl text-center">
              <Spin size="large" />
              <Title level={4} className="mt-4 mb-0">Processing your request...</Title>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default BookingConfirmation;