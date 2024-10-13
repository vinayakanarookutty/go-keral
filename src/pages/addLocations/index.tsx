import React, { useEffect, useState } from 'react';
import { Map, Marker, Popup } from 'react-map-gl';
import { EnvironmentFilled } from '@ant-design/icons';
import { Card, Form, Input, Button, Rate } from 'antd';
import axios from 'axios';
interface Pin {
  id: string;
  title: string;
  description: string;
  rating: number;
  latitude: number;
  longitude: number;
}

interface NewPlace {
  latitude: number;
  longitude: number;
}

interface ViewState {
  latitude: number;
  longitude: number;
  zoom: number;
}

const DestinationMap: React.FC = () => {
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
  const [newPlace, setNewPlace] = useState<NewPlace | null>(null);
  const [currentPlaceId, setCurrentPlaceId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 9.5,
    longitude: 76.4,
    zoom: 7
  });

  useEffect(()=>{
    const fetchData= async()=>{
      const values = await axios.get(`http://localhost:3000/pins`)
     setPins(values.data)
    }
  fetchData()
   
  },[])

  const handleAddClick = (event: mapboxgl.MapLayerMouseEvent) => {
    const { lng, lat } = event.lngLat;
    setNewPlace({ longitude: lng, latitude: lat });
  };

  const handleSubmit = (values: any) => {
    if (!newPlace) return;

    const newPin: Pin = {
      id: String(Date.now()), // Simple way to generate a unique id
      title: values.title,
      description: values.description,
      rating: values.rating,
      latitude: newPlace.latitude,
      longitude: newPlace.longitude,
    };
    axios.post<Pin>('http://localhost:3000/pins', newPin);
    setPins(prevPins => [...prevPins, newPin]);
    setNewPlace(null);
    alert("Succesfully updated")
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onDblClick={handleAddClick}
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
        {newPlace && (
          <Popup
            longitude={newPlace.longitude}
            latitude={newPlace.latitude}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <Card title="Add New Place" style={{ width: 300 }}>
              <Form onFinish={handleSubmit} layout="vertical">
                <Form.Item
                  name="title"
                  label="Title"
                  rules={[{ required: true, message: 'Please input the title!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: 'Please input the description!' }]}
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  name="rating"
                  label="Rating"
                  rules={[{ required: true, message: 'Please input the rating!' }]}
                >
                  <Rate />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Add Pin
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default DestinationMap;