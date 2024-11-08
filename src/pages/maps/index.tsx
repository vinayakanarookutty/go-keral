import React, { useState, useEffect } from "react";
import Map, { Source, Layer, Marker, Popup } from "react-map-gl";
import {
  AutoComplete,
  Radio,
  Typography,
  Button,
  Modal,
  Input,
  message,
  Card,
  Checkbox,
  Select,
  DatePicker,
  TimePicker,
} from "antd";
import { EnvironmentFilled } from "@ant-design/icons";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const { Option } = AutoComplete;
const { Text, Title } = Typography;
interface PlaceOption {
  value: string;
  coordinates: [number, number];
}

interface ViewState {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface Route {
  geometry: {
    coordinates: [number, number][];
  };
  distance: number;
  duration: number;
}

interface Pin {
  _id: string;
  title: string;
  description: string;
  rating: number;
  latitude: number;
  longitude: number;
}

const Maps: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>({
    latitude: 10.8505,
    longitude: 76.2711,
    zoom: 6,
  });
  const navigate = useNavigate();
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [originOptions, setOriginOptions] = useState<PlaceOption[]>([]);
  const [destinationOptions, setDestinationOptions] = useState<PlaceOption[]>(
    []
  );
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(
    null
  );
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(
    null
  );
  const [passengerName, setPassengerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pins, setPins] = useState<Pin[]>([]);
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const ROUTE_COLORS = ["#1d77c0", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6"];

  const [currentPlaceId, setCurrentPlaceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time: any) => {
    setSelectedTime(time);
  };
  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/pins`
        );
        setPins(response.data);
      } catch (error) {
        console.error("Error fetching pins:", error);
      }
    };
    fetchPins();
  }, []);

  const searchPlace = async (
    query: string,
    setOptions: React.Dispatch<React.SetStateAction<PlaceOption[]>>
  ) => {
    if (query.length > 2) {
      const keralaBoundingBox = [74.85, 8.18, 77.65, 12.78];
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxToken}&country=IN&bbox=${keralaBoundingBox.join(
          ","
        )}`
      );
      const suggestions = response.data.features.map((feature: any) => ({
        value: feature.place_name,
        coordinates: feature.center as [number, number],
      }));
      setOptions(suggestions);
    }
  };

  const handleOriginChange = (value: string) => {
    setOrigin(value);
    searchPlace(value, setOriginOptions);
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    searchPlace(value, setDestinationOptions);
  };

  const handleOriginSelect = (value: string, option: PlaceOption) => {
    setOrigin(value);
    setOriginCoords(option.coordinates);
    updateViewport(option.coordinates);
  };

  const handleDestinationSelect = (value: string, option: PlaceOption) => {
    setDestination(value);
    setDestCoords(option.coordinates);
    updateViewport(option.coordinates);
  };

  const updateViewport = (coordinates: [number, number]) => {
    setViewState({
      latitude: coordinates[1],
      longitude: coordinates[0],
      zoom: 12,
    });
  };

  useEffect(() => {
    const fetchRoute = async () => {
      if (origin && destination) {
        const originCoords = originOptions.find(
          (opt) => opt.value === origin
        )?.coordinates;
        const destCoords = destinationOptions.find(
          (opt) => opt.value === destination
        )?.coordinates;

        if (originCoords && destCoords) {
          const response = await axios.get(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords[0]},${originCoords[1]};${destCoords[0]},${destCoords[1]}?geometries=geojson&alternatives=true&access_token=${mapboxToken}`
          );
          setRoutes(response.data.routes);
          setSelectedRouteIndex(0);
        }
      }
    };

    fetchRoute();
  }, [origin, destination, originOptions, destinationOptions]);

  const handleRouteSelect = (index: number) => {
    setSelectedRouteIndex(index);
  };

  const PRICING = {
    premium: {
      baseFare: 200, // Base fare for first 5 km
      baseDistance: 5, // Distance covered in base fare (km)
      ratePerKm: 20, // Rate per km after base distance
    },
    luxury: {
      baseFare: 300, // Base fare for first 5 km
      baseDistance: 5, // Distance covered in base fare (km)
      ratePerKm: 30, // Rate per km after base distance
    },
  };

  // Calculate prices based on selected route
  const calculatePrice = (distance: number, category: "premium" | "luxury") => {
    const pricing = PRICING[category];

    // If distance is less than or equal to base distance, return base fare
    if (distance <= pricing.baseDistance) {
      return pricing.baseFare;
    }

    // Calculate additional distance beyond base distance
    const additionalDistance = distance - pricing.baseDistance;

    // Calculate total fare: base fare + (additional distance × rate per km)
    return pricing.baseFare + additionalDistance * pricing.ratePerKm;
  };

  const [isPassengerModalVisible, setIsPassengerModalVisible] = useState(false);
  const [passengers, setPassengers] = useState(1);

  const showPassengerModal = () => {
    if (selectedRouteIndex === null) {
      message.warning("Please select a route first");
      return;
    }
    setIsPassengerModalVisible(true);
  };
  const [serviceType, setServiceType] = useState(null);
  const handleServiceTypeChange = (e: any) => {
    setServiceType(e.target.checked ? e.target.value : null);
  };
  const handleModalOk = () => {
    const selectedRoute = routes[selectedRouteIndex!];
    const distance = selectedRoute.distance / 1000;
    const premiumPrice = calculatePrice(distance, "premium");
    const luxuryPrice = calculatePrice(distance, "luxury");

    const bookingDetails = {
      origin,
      destination,
      distance: distance.toFixed(2),
      duration: (selectedRoute.duration / 60).toFixed(2),
      routeIndex: selectedRouteIndex,
      originCoords,
      destCoords,
      premiumPrice,
      luxuryPrice,
      passengers,
      serviceType,
      selectedDate,
      selectedTime,
      phoneNumber,
      passengerName,
    };
    console.log(bookingDetails);

    navigate("/bookingconfirmation", { state: bookingDetails });

    // else{
    //   navigate('/quatation',{ state: bookingDetails })
    // }
  };

  const handleBookRoute = () => {
    if (selectedRouteIndex !== null) {
      showPassengerModal();
      // const bookingDetails = {
      //   origin,
      //   destination,
      //   distance: distance.toFixed(2),
      //   duration: (selectedRoute.duration / 60).toFixed(2),
      //   routeIndex: selectedRouteIndex,
      //   originCoords,
      //   destCoords,
      //   premiumPrice,
      //   luxuryPrice
      // };
      // console.log(bookingDetails);

      // navigate('/bookingconfirmation', { state: bookingDetails });
    } else {
      message.warning("Please select a route before booking.");
    }
  };

  return (
    <div className="flex flex-col w-screen bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
      <div className="h-[100px] lg:h-[60px] p-3 flex flex-col gap-3 box-border lg:flex-row items-center">
        <AutoComplete
          className="w-full"
          onSearch={handleOriginChange}
          onSelect={handleOriginSelect}
          placeholder="Origin"
          style={{ backgroundColor: "#f0f9ff" }}
        >
          {originOptions.map((option) => (
            <Option
              key={option.value}
              value={option.value}
              coordinates={option.coordinates}
            >
              {option.value}
            </Option>
          ))}
        </AutoComplete>
        <AutoComplete
          className="w-full"
          onSearch={handleDestinationChange}
          onSelect={handleDestinationSelect}
          placeholder="Destination"
          style={{ backgroundColor: "#f0fdf4" }}
        >
          {destinationOptions.map((option) => (
            <Option
              key={option.value}
              value={option.value}
              coordinates={option.coordinates}
            >
              {option.value}
            </Option>
          ))}
        </AutoComplete>
      </div>

      <div className="h-[calc(100vh-100px)] grid grid-rows-2 relative lg:grid-cols-[2fr_1fr] lg:grid-rows-1 lg:h-[calc(100vh-60px)]">
        <div className="overflow-hidden ">
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapboxAccessToken={mapboxToken}
            mapStyle="mapbox://styles/vinayak1937/cm0rtfeki00mr01pbgjerd69p"
          >
            {pins.map((pin) => (
              <Marker
                key={pin._id}
                longitude={pin.longitude}
                latitude={pin.latitude}
              >
                <EnvironmentFilled
                  className="text-2xl text-red-500 cursor-pointer hover:text-red-600 transition-colors"
                  onClick={() => setCurrentPlaceId(pin._id)}
                />
              </Marker>
            ))}
            {currentPlaceId && (
              <Popup
                longitude={
                  pins.find((p) => p._id === currentPlaceId)?.longitude || 0
                }
                latitude={
                  pins.find((p) => p._id === currentPlaceId)?.latitude || 0
                }
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                className="w-64"
              >
                {(() => {
                  const pin = pins.find((p) => p._id === currentPlaceId);
                  if (!pin) return null;
                  return (
                    <div className="p-2">
                      <h3 className="text-lg font-semibold mb-2">
                        {pin.title}
                      </h3>
                      <p className="text-sm mb-2">{pin.description}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xl ${
                              i < pin.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </Popup>
            )}
            {routes.map((route, index) => (
              <Source
                key={index}
                type="geojson"
                data={{
                  type: "Feature",
                  properties: {},
                  geometry: route.geometry,
                }}
              >
                <Layer
                  id={`route-${index}`}
                  type="line"
                  layout={{
                    "line-join": "round",
                    "line-cap": "round",
                  }}
                  paint={{
                    "line-color": ROUTE_COLORS[index % ROUTE_COLORS.length],
                    "line-width": selectedRouteIndex === index ? 5 : 3,
                    "line-opacity": selectedRouteIndex === index ? 1 : 0.5,
                  }}
                />
              </Source>
            ))}
            {originCoords && (
              <Marker longitude={originCoords[0]} latitude={originCoords[1]}>
                <EnvironmentFilled className="text-3xl text-blue-500" />
              </Marker>
            )}
            {destCoords && (
              <Marker longitude={destCoords[0]} latitude={destCoords[1]}>
                <EnvironmentFilled className="text-3xl text-green-500" />
              </Marker>
            )}
          </Map>
        </div>

        {/* Route Information */}

        <div className="grid grid-rows-[1fr_60px] h-full overflow-auto">
          <div className="p-3 flex flex-col gap-3">
            <Text className="text-2xl font-semibold block text-gray-800">
              Route Information
            </Text>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Text className="font-medium text-blue-700">
                Total Distance:{" "}
              </Text>
              <Text className="text-blue-600 font-bold">
                {selectedRouteIndex !== null
                  ? `${(routes[selectedRouteIndex].distance / 1000).toFixed(
                      2
                    )} km`
                  : "N/A"}
              </Text>
            </div>
            {selectedRouteIndex !== null && (
              <div className="space-y-4">
                <Text className="text-lg font-medium block text-gray-700">
                  Estimated Prices:
                </Text>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <div className="text-center">
                      <Text className="text-lg font-semibold text-blue-700 block">
                        Premium
                      </Text>
                      <Text className="text-2xl font-bold text-blue-900 block">
                        ₹
                        {calculatePrice(
                          routes[selectedRouteIndex].distance / 1000,
                          "premium"
                        ).toFixed(2)}
                      </Text>
                      <div className="text-sm text-blue-600 mt-2">
                        <div>
                          First {PRICING.premium.baseDistance}km: ₹
                          {PRICING.premium.baseFare}
                        </div>
                        <div>
                          After {PRICING.premium.baseDistance}km: ₹
                          {PRICING.premium.ratePerKm}/km
                        </div>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200">
                    <div className="text-center">
                      <Text className="text-lg font-semibold text-purple-700 block">
                        Luxury
                      </Text>
                      <Text className="text-2xl font-bold text-purple-900 block">
                        ₹
                        {calculatePrice(
                          routes[selectedRouteIndex].distance / 1000,
                          "luxury"
                        ).toFixed(2)}
                      </Text>
                      <div className="text-sm text-purple-600 mt-2">
                        <div>
                          First {PRICING.luxury.baseDistance}km: ₹
                          {PRICING.luxury.baseFare}
                        </div>
                        <div>
                          After {PRICING.luxury.baseDistance}km: ₹
                          {PRICING.luxury.ratePerKm}/km
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
            <Text className="text-lg font-medium block text-gray-700">
              Available Routes:
            </Text>
            <Radio.Group
              onChange={(e) => handleRouteSelect(e.target.value)}
              value={selectedRouteIndex}
              className="space-y-4 w-full"
            >
              {routes.map((route, index) => (
                <Radio key={index} value={index} className="block w-full">
                  <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                    <Text
                      className="font-medium"
                      style={{
                        color: ROUTE_COLORS[index % ROUTE_COLORS.length],
                      }}
                    >
                      Route {index + 1}
                    </Text>
                    <div className="mt-1 space-y-1">
                      <Text className="block text-sm text-gray-600">
                        Distance: {(route.distance / 1000).toFixed(2)} km
                      </Text>
                      <Text className="block text-sm text-gray-600">
                        Duration: {(route.duration / 60).toFixed(2)} minutes
                      </Text>
                    </div>
                  </div>
                </Radio>
              ))}
            </Radio.Group>
          </div>
          <div className="px-3 flex flex-col justify-center">
            <Button
              type="primary"
              onClick={handleBookRoute}
              disabled={selectedRouteIndex === null}
              className=" w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Book Selected Route
            </Button>
          </div>
        </div>
      </div>
      <Modal
        title={
          <div className="text-center">
            <Title level={4}>Select Number of Passengers</Title>
          </div>
        }
        open={isPassengerModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsPassengerModalVisible(false)}
        width={600}
        className="animated-modal"
      >
        <div className="flex justify-center mb-4">
          <Checkbox
            value="Luxury"
            checked={serviceType === "Luxury"}
            onChange={handleServiceTypeChange}
          >
            Luxury
          </Checkbox>
          <Checkbox
            value="Premium"
            checked={serviceType === "Premium"}
            onChange={handleServiceTypeChange}
          >
            Premium
          </Checkbox>
        </div>
        <div className="flex justify-center mb-4">
          <Select
            placeholder="Select number of passengers"
            onChange={setPassengers}
            style={{ width: 200 }}
            value={passengers}
          >
            {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
              <Option key={num} value={num}>
                {num}
              </Option>
            ))}
          </Select>
        </div>
        <div className="flex justify-center mb-4">
          <DatePicker
            placeholder="Select date"
            onChange={handleDateChange}
            style={{ width: 200 }}
            value={selectedDate}
          />
        </div>
        <div className="flex justify-center mb-4">
          <TimePicker
            placeholder="Select time"
            onChange={handleTimeChange}
            style={{ width: 200 }}
            value={selectedTime}
            format="HH:mm"
          />
        </div>
        <div className="flex justify-center mb-4">
          <Input
            placeholder="Enter passenger name"
            onChange={(e) => setPassengerName(e.target.value)}
            style={{ width: 200 }}
            value={passengerName}
          />
        </div>
        <div className="flex justify-center mb-4">
          <Input
            placeholder="Enter phone number"
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ width: 200 }}
            value={phoneNumber}
            type="tel"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Maps;
