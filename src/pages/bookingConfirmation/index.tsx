import React, { useEffect, useState } from "react";
import { IndianRupee, TicketMinus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Modal,
  Descriptions,
  Badge
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  RightOutlined,
  CarOutlined,
 LeftOutlined
 ,PhoneOutlined
} from "@ant-design/icons";
import axios from "axios";
import { useUserStore } from "../../store/user";

const { Title, Text } = Typography;

interface BookingDetails {
  origin: string;
  phoneNumber:string;
  passengers:string;
  destination: string;
  distance: number;
  address:string;
  duration: number;
  serviceType?: string;
  luxuryPrice?: number;
  premiumPrice?: number;
  selectedDate?: string;
  selectedTime?: string;
  passengerName?:string;

}

interface PersonalInformation {
  dob?: string;
  address?: string;
  languages?: string[];
  certifications?: string[];
}

interface Driver {
  availability:string;
  _id: string;
  id:string;
  model:string;
  name: string;
  email: string;
  phone: number;
  address:string;
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

interface Vehicle {
  id: string;
  _id: string;
  email:string;
  name:string;
  model: string;
  make: string;
  year: string;
  imageUrl: string;
  phone:string;
  address:string;
  licensePlate: string;
  seatsNo: number;
  vehicleClass: string;
  vehicleImages: Array<{
    path: string;
    originalname: string;
  }>;
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

  const [loading, setLoading] = useState(true);
  const [driverList, setDriverList] = useState<Driver[]>([]);
  const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalDriver, setModalDriver] = useState<Driver[] >([]);
  const [driver, setDriver] = useState<Vehicle[] | Driver[]>([]);
  // const [name, setName] = useState("");
  // const [phone, setPhone] = useState("");
  const user = useUserStore((state: any) => state?.userDetails);
  useEffect(() => {
    fetchDriverDetails();
    fetchVehicleDetails()
  }, []);

  const fetchDriverDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/driverList`);
      setDriverList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      message.error("Failed to fetch drivers");
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/getallvehicles`);
      setVehicleList(Array.isArray(response.data) ? response.data : []);
      console.log(vehicleList)
    } catch (error) {
      console.error("Error fetching drivers:", error);
      message.error("Failed to fetch drivers");
    } finally {
      setLoading(false);
    }
  };

  const handleDriverSelect = (driver: Vehicle) => {
    setSelectedDriver(driver);
    const filterByEmail = (email:any) => {
      return driverList.filter(user => user.email === email);
    };
    
    const result = filterByEmail(driver.email);
    console.log(result)
    setDriver(result )
  };

  const showDriverModal = (driver: Driver, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
  
    const filterByEmail = (email:any) => {
      return driverList.filter(user => user.email === email);
    };
    
    const result = filterByEmail(driver.email);
    setModalDriver(result);
    console.log(result);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setModalDriver([]);
  };

  const confirmBooking = async () => {
    if (!selectedDriver) {
      message.error("Please select a driver");
      return;
    }

    setLoading(true);
    try {
      interface BookingData {
        user: string;
        driverId: string;
        driverName: string;
        vehicleName: string;
        vehicleId: string;
        [key: string]: any; // To allow other dynamic properties from bookingDetails
      }
      
      const bookingDataToSubmit:BookingData = {
        ...bookingDetails,
        user:user.email,
        driverId: driver[0].id,
        driverName: driver[0].name,
       vehicleName:selectedDriver.model,
       vehicleId:selectedDriver._id
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        bookingDataToSubmit
      );

      if (response.status === 201) {
        message.success("Booking confirmed successfully!");
        setTimeout(() => {
          navigate("/userProfile");
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

 

  const renderDriverModal = () => {
    if (!modalDriver) return null;

    return (
      <Modal
        title={<Title level={4}>Driver Details</Title>}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="back" onClick={handleModalClose}>
            Close
          </Button>,
          <Button
            key="select"
            type="primary"
            className="bg-indigo-500 hover:bg-indigo-600"
            onClick={() => {
              handleDriverSelect(modalDriver as unknown as Vehicle);
              handleModalClose();
            }}
          >
            Select Driver 
          </Button>,
        ]}
        width={700}
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar
              size={100}
              icon={<UserOutlined />}
              src={modalDriver[0]?.imageUrl}
              className="bg-gradient-to-r from-indigo-500 to-purple-500"
            />
            <div>
              <Title level={3} className="mb-2">{modalDriver[0]?.name}</Title>
          
              <Badge
                text={ 'Available'} 
                className="ml-4" 
              />
            </div>
          </div>

          <Descriptions bordered column={2}>
        
            <Descriptions.Item label={<><CarOutlined /> Address</>} span={2}>
              {modalDriver[0]?.personalInformation?.address || 'Toyota Innova'} 
              <br />
              Phone: {modalDriver[0]?.phone || 'KL-07-AB-1234'}
            </Descriptions.Item>
            <Descriptions.Item label={<><CarOutlined /> Languages Known</>} span={2}>
              {modalDriver[0]?.personalInformation?.languages?.map((language,index)=>{
                return <><p>{index+1}.{language}</p></>
              })}
            </Descriptions.Item>
            <Descriptions.Item label={<><CarOutlined /> Certifications</>} span={2}>
              {modalDriver[0]?.personalInformation?.certifications?.map((language,index)=>{
                return <><p>{index+1}.{language}</p></>
              })}
            </Descriptions.Item>
          </Descriptions>

          <Card title="Performance Statistics" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text type="secondary">Completed Trips</Text>
                <div className="text-lg font-semibold">{ '250'}+</div>
              </div>
              <div>
                <Text type="secondary">Safety Rating</Text>
                <div className="text-lg font-semibold">
                  <Rate disabled defaultValue={4.8} className="text-green-500" />
                </div>
              </div>
            </div>
          </Card>

          {/* {modalDriver?.preferredRoutes && (
            <div>
              <Text type="secondary">Preferred Routes</Text>
              <div className="flex flex-wrap gap-2 mt-2">
                {(modalDriver?.preferredRoutes || ['Cochin-Munnar', 'Cochin-Wayanad']).map((route, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {route}
                  </span>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </Modal>
    );
  };

  // Rest of the component remains the same until the driver cards section
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // In the driver cards section, modify the Card component to include a "View Details" button:
  const renderDriverCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicleList?.map((vehicle) => {
        // State to track the current image index for each vehicle card
        
  
        // Function to go to the next image
        const nextImage = () => {
          setCurrentImageIndex((prevIndex) =>
            prevIndex === vehicle?.vehicleImages.length - 1 ? 0 : prevIndex + 1
          );
        };
  
        // Function to go to the previous image
        const prevImage = () => {
          setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? vehicle?.vehicleImages.length - 1 : prevIndex - 1
          );
        };
  
        return (
          <Card
            key={vehicle.id}
            hoverable
            className={`transform transition-all duration-300 hover:scale-105 ${
              selectedDriver?.id === vehicle?.id
                ? 'shadow-lg border-purple-700'
                : 'hover:shadow-xl'
            }`}
            onClick={() => handleDriverSelect(vehicle )}
          >
            <div className="text-center">
              <div className="relative inline-block w-full">
                {/* Display the current image based on the currentImageIndex */}
                {vehicle.vehicleImages.length > 0 && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${vehicle?.vehicleImages[currentImageIndex].path.replace(
                      '\\',
                      '/'
                    )}`}
                    alt={vehicle?.vehicleImages[currentImageIndex].originalname}
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                    className="rounded-lg"
                  />
                )}
  
                {/* Arrow Navigation */}
                <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
                  <button onClick={prevImage} className="bg-gray-100 p-2 rounded-full">
                    <LeftOutlined />
                  </button>
                </div>
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                  <button onClick={nextImage} className="bg-gray-100 p-2 rounded-full">
                    <RightOutlined />
                  </button>
                </div>
              </div>
  
              {/* Card Content */}
              <Title level={4} className="mb-2">{vehicle?.model}</Title>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    {vehicle?.make || "Malayalam"}
                  </span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    {"No:" + vehicle?.licensePlate.toUpperCase() || "Malayalam"}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {vehicle?.year + " Model" || "Commercial"}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {"Seats:" + vehicle?.seatsNo || "Commercial"}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {vehicle?.vehicleClass || "Commercial"}
                  </span>
                </div>
                <Button
                  type="link"
                  onClick={(e) => showDriverModal(vehicle as unknown as Driver, e)}
                  className="text-indigo-500 hover:text-indigo-600"
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-xl rounded-2xl border-0">
          <Steps
            current={currentStep}
            onChange={setCurrentStep}
            items={[
             
              { title: "Select Vehicle" },
              { title: "Confirm" },
            ]}
            className="mb-8"
          />

         

          {/* Driver Selection Section */}
          {currentStep === 0 && (
            <div>
              <Title level={2} className="text-center mb-8">Select Your Vehicle</Title>
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search drivers by name"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-8"
                value={searchTerm}
                size="large"
              />
              {loading ? (
                <div className="text-center py-8">
                  <Spin size="large" />
                </div>
              ) : renderDriverCards()}
            </div>
          )}

          {/* Confirmation Section */}
          {currentStep === 1 && (
              <div className="max-w-2xl mx-auto">
              <Title level={2} className="text-center mb-8">Booking Summary</Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8  ">
      
      {/* Box 1: Trip Route */}
      <Card className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg shadow-md">
  <Title level={3} className="text-center text-indigo-700 mb-4">Trip Route</Title>
  <Timeline
    items={[
      {
        dot: <EnvironmentOutlined className="text-indigo-500" />,
        children: (
          <div className="text-center">
            <Text type="secondary" className="block">From</Text>
            <Title level={4}>{bookingDetails.origin}</Title>
          </div>
        ),
      },
      {
        dot: <EnvironmentOutlined className="text-purple-500" />,
        children: (
          <div className="text-center">
            <Text type="secondary" className="block">To</Text>
            <Title level={4}>{bookingDetails.destination}</Title>
          </div>
        ),
      },
      {
        dot: <UserOutlined className="text-indigo-500" />,
        children: (
          <div className="text-center">
            <Text type="secondary" className="block">Passenger Name</Text>
            <Title level={4}>{bookingDetails?.passengerName}</Title>
          </div>
        ),
      },
      {
        dot: <PhoneOutlined className="text-purple-500" />,
        children: (
          <div className="text-center">
            <Text type="secondary" className="block">Phone Number</Text>
            <Title level={4}>{bookingDetails?.phoneNumber}</Title>
          </div>
        ),
      },
    ]}
  />
</Card>

      
      {/* Box 2: Trip Information */}
      <Card className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg  shadow-md">
        <Title level={3} className="text-center text-indigo-700 mb-4">Trip Information</Title>
        <div className="grid grid-cols-2 gap-4">
          
          <div className="flex items-center space-x-3">
            <ClockCircleOutlined className="text-indigo-500 text-xl" />
            <div>
              <Text type="secondary">Duration</Text>
              <Title level={4}>{bookingDetails.duration} mins</Title>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <RightOutlined className="text-indigo-500 text-xl" />
            <div>
              <Text type="secondary">Distance</Text>
              <Title level={4}>{bookingDetails.distance} km</Title>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <IndianRupee className="text-indigo-500 text-xl" />
            <div>
              <Text type="secondary">Service Type</Text>
              <Title level={4}>{bookingDetails.serviceType}</Title>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <TicketMinus className="text-indigo-500 text-xl" />
            <div>
              <Text type="secondary">Date</Text>
              <Title level={4}>
                {bookingDetails.selectedDate ? dayjs(bookingDetails.selectedDate).format("YYYY-MM-DD") : "Not selected"}
              </Title>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <ClockCircleOutlined className="text-indigo-500 text-xl" />
            <div>
              <Text type="secondary">Time</Text>
              <Title level={4}>
                {bookingDetails.selectedTime ? dayjs(bookingDetails.selectedTime).format("HH:mm") : "Not selected"}
              </Title>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <RightOutlined className="text-indigo-500 text-xl" />
            <div>
              <Text type="secondary">Passengers</Text>
              <Title level={4}>{bookingDetails.passengers}</Title>
            </div>
          </div>
          
        </div>
      </Card>
    </div>

              <Card className="mb-2">
                <Title level={4}>Selected Vehicle</Title>
                {selectedDriver ? (
                  <div className="flex items-center space-x-2">
                    <Avatar
                      size={60}
                      icon={<UserOutlined />}
                      src={`${import.meta.env.VITE_API_URL}/${selectedDriver?.vehicleImages[0].path.replace('\\', '/')}`}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                    <div>
                      <Title level={5}>{selectedDriver.model}</Title>
                      {/* <Rate disabled defaultValue={selectedDriver.rating} className="text-indigo-500" /> */}
                      <p>Model: {selectedDriver.make || "Malayalam"}</p>
                      <p>Seats: {selectedDriver.seatsNo || "Malayalam"}</p>
                    </div>
                  </div>
                ) : (
                  <Text type="warning">Please select a driver</Text>
                )}
              </Card>
              <Card className="mb-6">
                <Title level={4}>Selected Driver</Title>
                {driver? (
                  <div className="flex items-center space-x-2">
                    <Avatar
                      size={60}
                      icon={<UserOutlined />}
                      src={driver[0].imageUrl}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                    <div>
                      <Title level={5}>{driver[0].name}</Title>
                      {/* <Rate disabled defaultValue={selectedDriver.rating} className="text-indigo-500" /> */}
                      <p>Phone: {driver[0].phone|| "Malayalam"}</p>
                      <p>Address: {driver[0].address || "Malayalam"}</p>
                    </div>
                    {/* <Card className="mb-6">
              <Title level={4}>Your Details</Title>
              <div className="space-y-4">
                <Input
                  placeholder="Enter your name"
                  name="name"
                  value={name}
                  onChange={(e=>{setName(e.target.value)})}
                  className="rounded-lg"
                />
                <Input
                  placeholder="Enter your phone"
                  name="phone"
                  value={phone}
                  onChange={(e=>{setPhone(e.target.value)})}
                  className="rounded-lg"
                />
               
              </div>
            </Card> */}
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
            {currentStep < 1? (
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

        {/* Driver Details Modal */}
        {renderDriverModal()}
      </div>
    </div>
  );
};

export default BookingConfirmation;