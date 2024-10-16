import React, { useState, useEffect } from 'react';
import Map, { Source, Layer, Marker, Popup } from 'react-map-gl';
import { AutoComplete, List, Radio, Typography, Button, Modal, Form, Input, message } from 'antd';
import { EnvironmentFilled, EnvironmentTwoTone } from '@ant-design/icons';
import axios from 'axios';
import { useUserStore } from '../../store/user';
import { useNavigate } from 'react-router-dom';

const { Option } = AutoComplete;
const { Text } = Typography;

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
  id: string;
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
    zoom: 6
  });
  const navigate = useNavigate();
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [originOptions, setOriginOptions] = useState<PlaceOption[]>([]);
  const [destinationOptions, setDestinationOptions] = useState<PlaceOption[]>([]);
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [pins, setPins] = useState<Pin[]>([
    {
      id: '1',
      title: 'dsgdsg',
      description: 'sdgsdg',
      rating: 3,
      latitude: 10.033406690669423,
      longitude: 76.20967112130376
    },
    {
      id: '2',
      title: 'newPlace',
      description: 'there is a well',
      rating: 4,
      latitude: 8.964131095871679,
      longitude: 76.53432145222524
    }
  ]);
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const ROUTE_COLORS = ['#1d77c0', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
  const userDetails = useUserStore((state: any) => state?.userDetails);
  const [currentPlaceId, setCurrentPlaceId] = useState<string | null>(null);
  const searchPlace = async (
    query: string,
    setOptions: React.Dispatch<React.SetStateAction<PlaceOption[]>>
  ) => {
    if (query.length > 2) {
      const keralaBoundingBox = [74.85, 8.18, 77.65, 12.78]; 
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxToken}&country=IN&bbox=${keralaBoundingBox.join(',')}`
      );
      const suggestions = response.data.features.map((feature: any) => ({
        value: feature.place_name,
        coordinates: feature.center as [number, number]
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
      zoom: 12
    });
  };

  useEffect(() => {
    const fetchData= async()=>{
      const values = await axios.get(`http://localhost:3000/pins`)
     setPins(values.data)
    }
  fetchData()
    const fetchRoute = async () => {
      if (origin && destination) {
        const originCoords = originOptions.find(opt => opt.value === origin)?.coordinates;
        const destCoords = destinationOptions.find(opt => opt.value === destination)?.coordinates;
        
        if (originCoords && destCoords) {
          const response = await axios.get(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords[0]},${originCoords[1]};${destCoords[0]},${destCoords[1]}?geometries=geojson&alternatives=true&access_token=${mapboxToken}`
          );
          setRoutes(response.data.routes);
          setSelectedRouteIndex(0); // Select the first route by default
        }
      }
    };

    fetchRoute();
  }, [origin, destination, originOptions, destinationOptions]);

  const handleRouteSelect = (index: number) => {
    setSelectedRouteIndex(index);
  };

  const handleBookRoute = () => {
    if (selectedRouteIndex !== null) {
      const selectedRoute = routes[selectedRouteIndex];
      const bookingDetails = {
        origin,
        destination,
        distance: (selectedRoute.distance / 1000).toFixed(2),
        duration: (selectedRoute.duration / 60).toFixed(2),
        routeIndex: selectedRouteIndex,
        // Add any other relevant details you want to pass
        originCoords,
        destCoords,
      };
      console.log(bookingDetails)

      navigate('/bookingconfirmation', { state: bookingDetails });
    } else {
      message.warning('Please select a route before booking.');
    }
  };


  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
    <div className="p-4 bg-white shadow-md z-10">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <AutoComplete
          className="w-full"
          onSearch={handleOriginChange}
          onSelect={handleOriginSelect}
          placeholder="Origin"
          style={{ backgroundColor: '#f0f9ff' }}
        >
          {originOptions.map(option => (
            <Option key={option.value} value={option.value} coordinates={option.coordinates}>
              {option.value}
            </Option>
          ))}
        </AutoComplete>
        <AutoComplete
          className="w-full"
          onSearch={handleDestinationChange}
          onSelect={handleDestinationSelect}
          placeholder="Destination"
          style={{ backgroundColor: '#f0fdf4' }}
        >
          {destinationOptions.map(option => (
            <Option key={option.value} value={option.value} coordinates={option.coordinates}>
              {option.value}
            </Option>
          ))}
        </AutoComplete>
      </div>
    </div>
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
      <div className="w-full lg:w-2/3 h-1/2 lg:h-full relative">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapboxAccessToken={mapboxToken}
          mapStyle="mapbox://styles/vinayak1937/cm0rtfeki00mr01pbgjerd69p"
          className="w-full h-full"
        >
          {pins.map((pin) => (
            <React.Fragment key={pin.id}>
              <Marker longitude={pin.longitude} latitude={pin.latitude}>
                <EnvironmentFilled
                  className="text-2xl text-red-500 cursor-pointer hover:text-red-600 transition-colors"
                  onClick={() => setCurrentPlaceId(pin.id)}
                />
              </Marker>
              {currentPlaceId === pin.id && (
                <Popup
                  longitude={pin.longitude}
                  latitude={pin.latitude}
                  closeOnClick={false}
                  onClose={() => setCurrentPlaceId(null)}
                  className="w-64"
                >
                  <div className="p-2">
                    <h3 className="text-lg font-semibold mb-2">{pin.title}</h3>
                    <p className="text-sm mb-2">{pin.description}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${
                            i < pin.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </Popup>
              )}
            </React.Fragment>
          ))}
          {routes.map((route, index) => (
            <Source
              key={index}
              type="geojson"
              data={{
                type: 'Feature',
                properties: {},
                geometry: route.geometry
              }}
            >
              <Layer
                id={`route-${index}`}
                type="line"
                layout={{
                  "line-join": "round",
                  "line-cap": "round"
                }}
                paint={{
                  "line-color": ROUTE_COLORS[index % ROUTE_COLORS.length],
                  "line-width": selectedRouteIndex === index ? 5 : 3,
                  "line-opacity": selectedRouteIndex === index ? 1 : 0.5
                }}
              />
            </Source>
          ))}
          {originCoords && (
            <Marker longitude={originCoords[0]} latitude={originCoords[1]} color="red">
              <EnvironmentFilled className="text-3xl text-blue-500" />
            </Marker>
          )}
          {destCoords && (
            <Marker longitude={destCoords[0]} latitude={destCoords[1]} color="blue">
              <EnvironmentFilled className="text-3xl text-green-500" />
            </Marker>
          )}
        </Map>
      </div>
      <div className="w-full lg:w-1/3 bg-white shadow-lg overflow-auto p-4 lg:p-6">
        <Text className="text-2xl font-semibold mb-4 block text-gray-800">Route Information</Text>
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <Text className="font-medium text-blue-700">Total Distance: </Text>
          <Text className="text-blue-600 font-bold">
            {selectedRouteIndex !== null
              ? `${(routes[selectedRouteIndex].distance / 1000).toFixed(2)} km`
              : 'N/A'}
          </Text>
        </div>
        <Text className="text-lg font-medium mb-2 block text-gray-700">Available Routes:</Text>
        <Radio.Group
          onChange={(e) => handleRouteSelect(e.target.value)}
          value={selectedRouteIndex}
          className="space-y-4 w-full"
        >
          {routes.map((route, index) => (
            <Radio key={index} value={index} className="block w-full">
              <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                <Text className="font-medium" style={{ color: ROUTE_COLORS[index % ROUTE_COLORS.length] }}>
                  Route {index + 1}
                </Text>
                <div className="mt-1 space-y-1">
                  <Text className="block text-sm text-gray-600">Distance: {(route.distance / 1000).toFixed(2)} km</Text>
                  <Text className="block text-sm text-gray-600">Duration: {(route.duration / 60).toFixed(2)} minutes</Text>
                </div>
              </div>
            </Radio>
          ))}
        </Radio.Group>
        <Button
          type="primary"
          onClick={handleBookRoute}
          disabled={selectedRouteIndex === null}
          className="mt-6 w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Book Selected Route
        </Button>
      </div>
    </div>
  </div>
  );
};

export default Maps;