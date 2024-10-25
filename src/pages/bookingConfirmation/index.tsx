import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Typography,
    Avatar,
    Spin,
    Rate,
    message,
    Input,
    Card,
    Form,
    DatePicker,
    InputNumber,
    Button,
    Steps,
    Tag,
    Timeline,
} from "antd";
import {
    UserOutlined,
    SearchOutlined,
    CarOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    RightOutlined,
} from "@ant-design/icons";
import axios from "axios";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Interfaces
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

interface Vehicle {
    id: number;
    make: string;
    model: string;
    year: number;
    imageUrl?: string;
}

interface BookingFormData {
    dateRange: [dayjs.Dayjs, dayjs.Dayjs];
    price: number;
    remarks?: string;
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
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
        null
    );
    const [currentStep, setCurrentStep] = useState(0);
    const [bookingForm] = Form.useForm();
    const [bookingData, setBookingData] = useState<BookingFormData | null>(
        null
    );

    useEffect(() => {
        fetchDriverDetails();
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/getvehicles"
            );
            const data = Array.isArray(response.data) ? response.data : [];
            setVehicles(data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            message.error("Failed to fetch vehicles");
        }
    };

    const fetchDriverDetails = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/driverList"
            );
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

    const handleVehicleSelect = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
    };

    const confirmBooking = async () => {
        if (!selectedDriver || !selectedVehicle || !bookingData) {
            message.error("Please complete all booking details");
            return;
        }

        setLoading(true);
        try {
            const bookingDataToSubmit = {
                ...bookingDetails,
                driverId: selectedDriver.id,
                driverName: selectedDriver.name,
                driverRating: selectedDriver.rating,
                vehicleId: selectedVehicle.id,
                vehicleMake: selectedVehicle.make,
                vehicleModel: selectedVehicle.model,
                dateFrom: bookingData.dateRange[0].format("YYYY-MM-DD"),
                dateTo: bookingData.dateRange[1].format("YYYY-MM-DD"),
                price: bookingData.price,
                remarks: bookingData.remarks,
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
            message.error(
                "An error occurred while confirming the booking. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredDrivers = driverList.filter((driver) =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredVehicles = vehicles.filter((vehicle) =>
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Date range validation
    const disabledDate: RangePickerProps["disabledDate"] = (current) => {
        return current && current < dayjs().startOf("day");
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-4 md:p-8"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div className="max-w-6xl mx-auto" style={{ width: "100%" }}>
                <Card className="shadow-xl rounded-2xl border-0">
                    <Steps
                        current={currentStep}
                        onChange={setCurrentStep}
                        items={[
                            { title: "Trip Details" },
                            { title: "Select Driver" },
                            { title: "Select Vehicle" },
                            { title: "Schedule & Price" },
                            { title: "Confirm" },
                        ]}
                        className="mb-8"
                    />

                    {/* Trip Details */}
                    {currentStep === 0 && (
                        <Card className="rounded-xl shadow-sm bg-white">
                            <Title level={2} className="text-center mb-8">
                                Trip Details
                            </Title>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Timeline
                                    items={[
                                        {
                                            dot: (
                                                <EnvironmentOutlined className="text-blue-500" />
                                            ),
                                            children: (
                                                <div>
                                                    <Text type="secondary">
                                                        From
                                                    </Text>
                                                    <Title level={3}>
                                                        {bookingDetails.origin}
                                                    </Title>
                                                </div>
                                            ),
                                        },
                                        {
                                            dot: (
                                                <EnvironmentOutlined className="text-red-500" />
                                            ),
                                            children: (
                                                <div>
                                                    <Text type="secondary">
                                                        To
                                                    </Text>
                                                    <Title level={3}>
                                                        {
                                                            bookingDetails.destination
                                                        }
                                                    </Title>
                                                </div>
                                            ),
                                        },
                                    ]}
                                />
                                <Card className="bg-gray-50">
                                    <div className="space-y-6">
                                        <div>
                                            <ClockCircleOutlined className="text-blue-500 text-xl mb-2" />
                                            <Text
                                                type="secondary"
                                                className="block"
                                            >
                                                Duration
                                            </Text>
                                            <Title level={3}>
                                                {bookingDetails.duration}{" "}
                                                minutes
                                            </Title>
                                        </div>
                                        <div>
                                            <RightOutlined className="text-blue-500 text-xl mb-2" />
                                            <Text
                                                type="secondary"
                                                className="block"
                                            >
                                                Distance
                                            </Text>
                                            <Title level={3}>
                                                {bookingDetails.distance} km
                                            </Title>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Card>
                    )}

                    {/* Driver Selection */}
                    {currentStep === 1 && (
                        <div>
                            <Title level={2} className="text-center mb-8">
                                Select Your Driver
                            </Title>
                            <Input
                                prefix={
                                    <SearchOutlined className="text-gray-400" />
                                }
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
                                            className={`border-2 ${
                                                selectedDriver?.id === driver.id
                                                    ? "border-green-500"
                                                    : "border-blue-500"
                                            }`}
                                            style={{ width: 300 }}
                                            onClick={() =>
                                                handleDriverSelect(driver)
                                            }
                                        >
                                            <div className="text-center">
                                                <Avatar
                                                    size={80}
                                                    icon={<UserOutlined />}
                                                    src={driver.imageUrl}
                                                    className="mb-4"
                                                />
                                                <Title level={4}>
                                                    {driver.name}
                                                </Title>
                                                <Rate
                                                    disabled
                                                    defaultValue={driver.rating}
                                                    className="mb-2"
                                                />
                                                <p>
                                                    Language :{" "}
                                                    {driver.languages ||
                                                        "Malayalam"}
                                                </p>
                                                <p>
                                                    License Type :{" "}
                                                    {driver.licenseType ||
                                                        "Commercial"}
                                                </p>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Vehicle Selection */}
                    {currentStep === 2 && (
                        <div>
                            <Title level={2} className="text-center mb-8">
                                Select Your Vehicle
                            </Title>
                            <Input
                                prefix={
                                    <SearchOutlined className="text-gray-400" />
                                }
                                placeholder="Search vehicles by make"
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
                                    {filteredVehicles.map((vehicle) => (
                                        <Card
                                            key={vehicle.id}
                                            style={{ width: 300 }}
                                            hoverable
                                            className={`border-2 ${
                                                selectedVehicle?.id ===
                                                vehicle.id
                                                    ? "border-green-500"
                                                    : "border-blue-500"
                                            }`}
                                            onClick={() =>
                                                handleVehicleSelect(vehicle)
                                            }
                                        >
                                            <div className="text-center">
                                                <Avatar
                                                    size={80}
                                                    icon={<CarOutlined />}
                                                    src={vehicle.imageUrl}
                                                    className="mb-4"
                                                />
                                                <Title level={4}>
                                                    {vehicle.make}{" "}
                                                    {vehicle.model}
                                                </Title>
                                                <Tag color="green">
                                                    {vehicle.year}
                                                </Tag>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Schedule & Price */}
                    {currentStep === 3 && (
                        <div className="max-w-2xl mx-auto">
                            <Title level={2} className="text-center mb-8">
                                Schedule & Price
                            </Title>
                            <Form
                                form={bookingForm}
                                layout="vertical"
                                onFinish={(values) => {
                                    setBookingData(values);
                                    setCurrentStep(4);
                                }}
                            >
                                <Form.Item
                                    name="dateRange"
                                    label="Trip Dates"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please select your trip dates",
                                        },
                                    ]}
                                >
                                    <RangePicker
                                        style={{ width: "100%" }}
                                        size="large"
                                        disabledDate={disabledDate}
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="price"
                                    label="Price (in INR)"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter the price",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        placeholder="Enter price"
                                        min={0}
                                        formatter={(value) => `₹ ${value}`}
                                        size="large"
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="remarks"
                                    label="Additional Remarks"
                                >
                                    <Input.TextArea
                                        placeholder="Any special requirements or notes..."
                                        rows={4}
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <div className="flex justify-between mt-8">
                                        <Button
                                            onClick={() =>
                                                setCurrentStep(currentStep - 1)
                                            }
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    )}

                    {/* Confirmation */}
                    {currentStep === 4 && (
                        <div className="max-w-2xl mx-auto">
                            <Title level={2} className="text-center mb-8">
                                Booking Summary
                            </Title>

                            <Card className="mb-6 bg-gray-50">
                                <Title level={4}>Trip Details</Title>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Text type="secondary">From</Text>
                                        <div className="font-semibold">
                                            {bookingDetails.origin}
                                        </div>
                                    </div>
                                    <div>
                                        <Text type="secondary">To</Text>
                                        <div className="font-semibold">
                                            {bookingDetails.destination}
                                        </div>
                                    </div>
                                    <div>
                                        <Text type="secondary">Distance</Text>
                                        <div className="font-semibold">
                                            {bookingDetails.distance} km
                                        </div>
                                    </div>
                                    <div>
                                        <Text type="secondary">Duration</Text>
                                        <div className="font-semibold">
                                            {bookingDetails.duration} minutes
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="mb-6">
                                <Card className="mt-3">
                                    <Title level={4}>Selected Driver</Title>
                                    {selectedDriver ? (
                                        <div className="flex items-center space-x-4 ">
                                            <Avatar
                                                size={60}
                                                icon={<CarOutlined />}
                                                src={selectedDriver.imageUrl}
                                            />
                                            <div>
                                                <Title level={5}>
                                                    {selectedDriver.name}
                                                </Title>

                                                <p>
                                                    Language :{" "}
                                                    {selectedDriver.languages ||
                                                        "Malayalam"}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <Text type="warning">
                                            Please select a vehicle
                                        </Text>
                                    )}
                                </Card>

                                <Card className="mt-3">
                                    <Title level={4}>Selected Vehicle</Title>
                                    {selectedVehicle ? (
                                        <div className="flex items-center space-x-4">
                                            <Avatar
                                                size={60}
                                                icon={<CarOutlined />}
                                                src={selectedVehicle.imageUrl}
                                            />
                                            <div>
                                                <Title level={5}>
                                                    {selectedVehicle.make}{" "}
                                                    {selectedVehicle.model}
                                                </Title>
                                                <Tag color="green">
                                                    {selectedVehicle.year}
                                                </Tag>
                                            </div>
                                        </div>
                                    ) : (
                                        <Text type="warning">
                                            Please select a vehicle
                                        </Text>
                                    )}
                                </Card>
                            </Card>

                            <Card className="mb-6 bg-gray-50">
                                <Title level={4}>Booking Details</Title>
                                {bookingData && (
                                    <div className="space-y-4">
                                        <div>
                                            <Text type="secondary">
                                                Trip Dates
                                            </Text>
                                            <div className="font-semibold">
                                                {bookingData.dateRange[0].format(
                                                    "MMM DD, YYYY"
                                                )}{" "}
                                                -{" "}
                                                {bookingData.dateRange[1].format(
                                                    "MMM DD, YYYY"
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <Text type="secondary">Price</Text>
                                            <div className="font-semibold">
                                                ₹{" "}
                                                {bookingData.price.toLocaleString()}
                                            </div>
                                        </div>
                                        {bookingData.remarks && (
                                            <div>
                                                <Text type="secondary">
                                                    Additional Remarks
                                                </Text>
                                                <div className="font-semibold">
                                                    {bookingData.remarks}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Card>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        {currentStep == 0 || currentStep == 3 ? (
                            <span> </span>
                        ) : (
                            <Button
                                onClick={() => setCurrentStep(currentStep - 1)}
                            >
                                Previous
                            </Button>
                        )}

                        {currentStep == 4 ? (
                            <Button
                                type="primary"
                                onClick={confirmBooking}
                                disabled={
                                    !selectedDriver ||
                                    !selectedVehicle ||
                                    loading
                                }
                            >
                                {loading ? "Processing..." : "Confirm Booking"}
                            </Button>
                        ) : currentStep == 3 ? (
                            <span></span>
                        ) : (
                            <Button
                                type="primary"
                                onClick={() => setCurrentStep(currentStep + 1)}
                                disabled={
                                    (currentStep === 1 && !selectedDriver) ||
                                    (currentStep === 2 && !selectedVehicle)
                                }
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </Card>

                {/* Loading Overlay */}
                {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-xl shadow-xl text-center">
                            <Spin size="large" />
                            <Title level={4} className="mt-4 mb-0">
                                Processing your request...
                            </Title>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingConfirmation;
