import React, { useState, useEffect } from 'react';
import Map, { Source, Layer, Marker ,Popup} from 'react-map-gl';
import { AutoComplete, List, Card, Radio, Space, Typography, Button, Modal, Form, Input, message } from 'antd';
import { EnvironmentTwoTone } from '@ant-design/icons';
import axios from 'axios';
import { useUserStore } from '../../store/user';
import { EnvironmentFilled } from '@ant-design/icons';
import {  Rate } from 'antd';
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
      setIsBookingModalVisible(true);
    } else {
      message.warning('Please select a route before booking.');
    }
  };

  const handleBookingSubmit = async (values: any) => {
    try {
      // Here you would typically send a request to your backend to process the booking
      // For this example, we'll just simulate a successful booking
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Booking successful!');
      setIsBookingModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Booking failed. Please try again.');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', display: 'flex', gap: "1rem" }}>
        <AutoComplete
          style={{ width: 200 }}
          onSearch={handleOriginChange}
          onSelect={handleOriginSelect}
          placeholder="Origin"
        >
          {originOptions.map(option => (
            <Option key={option.value} value={option.value} coordinates={option.coordinates}>
              {option.value}
            </Option>
          ))}
        </AutoComplete>
        <AutoComplete
          style={{ width: 200 }}
          onSearch={handleDestinationChange}
          onSelect={handleDestinationSelect}
          placeholder="Destination"
        >
          {destinationOptions.map(option => (
            <Option key={option.value} value={option.value} coordinates={option.coordinates}>
              {option.value}
            </Option>
          ))}
        </AutoComplete>
      </div>
      <div style={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapboxAccessToken={mapboxToken}
          style={{ flex: 2 }}
          mapStyle="mapbox://styles/vinayak1937/cm0rtfeki00mr01pbgjerd69p"
        >
           {pins.map((pin) => (
          <React.Fragment key={pin.id}>
            <Marker longitude={pin.longitude} latitude={pin.latitude}>
              <EnvironmentFilled
                style={{ fontSize: '24px', color: 'red', cursor: 'pointer' }}
                onClick={() => setCurrentPlaceId(pin.id)}
              />
            </Marker>
            {currentPlaceId === pin.id && (
              <Popup
                longitude={pin.longitude}
                latitude={pin.latitude}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <Card title={pin.title} style={{ width: 200 }}>
                  <p>{pin.description}</p>
                  <Rate disabled defaultValue={pin.rating} />
                </Card>
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
              <EnvironmentTwoTone style={{ fontSize: '26px', color: '#08c' }} />
            </Marker>
          )}
          
          {destCoords && (
            <Marker longitude={destCoords[0]} latitude={destCoords[1]} color="blue">
              <EnvironmentTwoTone style={{ fontSize: '26px', color: '#08c' }} />
            </Marker>
          )}
        </Map>
        <Card style={{ flex: 1, overflow: 'auto' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Total Distance: </Text>
            <Text>{selectedRouteIndex !== null ? `${(routes[selectedRouteIndex].distance / 1000).toFixed(2)} km` : 'N/A'}</Text>
            <Text strong>Available Routes:</Text>
            <Radio.Group onChange={(e) => handleRouteSelect(e.target.value)} value={selectedRouteIndex}>
              {routes.map((route, index) => (
                <Radio key={index} value={index} style={{ display: 'block', marginBottom: '10px' }}>
                  <Space direction="vertical">
                    <Text style={{ color: ROUTE_COLORS[index % ROUTE_COLORS.length] }}>Route {index + 1}</Text>
                    <Text>Distance: {(route.distance / 1000).toFixed(2)} km</Text>
                    <Text>Duration: {(route.duration / 60).toFixed(2)} minutes</Text>
                  </Space>
                </Radio>
              ))}
            </Radio.Group>
            <Button type="primary" onClick={handleBookRoute} disabled={selectedRouteIndex === null}>
              Book Selected Route
            </Button>
          </Space>
        </Card>
      </div>

      <Modal
        title="Book Route"
        visible={isBookingModalVisible}
        onCancel={() => setIsBookingModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleBookingSubmit} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Travel Date" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Confirm Booking
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Maps;