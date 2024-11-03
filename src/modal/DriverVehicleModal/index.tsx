import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Modal, Select, Row, Col, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, PictureOutlined, DeleteOutlined } from '@ant-design/icons';
const { Dragger } = Upload;
import axios from 'axios';
import { useUserStore } from '../../store/user';

function DriverAddVehicleModal() {
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList1, setFileList1] = useState([]);
  const [fileList2, setFileList2] = useState([]);
  const [fileList3, setFileList3] = useState([]);
  const [fileList4, setFileList4] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [vehicleImages, setVehicleImages] = useState([]);
  const [form] = Form.useForm();
  const [editingVehicle, setEditingVehicle] = useState(null);

  const vehicleTypes = [
    { label: 'Cars', value: 'cars' },
    { label: 'Buses', value: 'buses' },
    { label: 'Sedan', value: 'sedan' },
    { label: 'SUV', value: 'suv' },
    { label: 'Hatchback', value: 'hatchback' },
  ];

  useEffect(() => {
    fetchVehicles();
  }, []);
  const user = useUserStore((state: any) => state?.userDetails);
  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/getvehicles?id=${user?.email}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setVehicles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    
      setLoading(false);
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async (info, setFileList) => {
    const { fileList } = info;
    const newFileList = await Promise.all(
      fileList.map(async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        return file;
      })
    );
    setFileList(newFileList);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    setPreviewVisible(true);
  };

  const showModal = (vehicle = null) => {
    setEditingVehicle(vehicle);
    if (vehicle) {
      form.setFieldsValue({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
        vehicleType: vehicle.vehicleType,
        seatsNo: vehicle.seatsNo,
        vehicleClass: vehicle.vehicleClass,
        email:user.email
      });

      // Handle existing documents
      if (vehicle.documents) {
        if (vehicle.documents.Driving_Licence) {
          setFileList1([{
            uid: '-1',
            name: vehicle.documents.Driving_Licence.originalname,
            status: 'done',
            url: `http://localhost:3000/${vehicle.documents.Driving_Licence.path}`,
            response: { path: vehicle.documents.Driving_Licence.path }
          }]);
        }
        if (vehicle.documents.Vehicle_Insurance_Proof) {
          setFileList2([{
            uid: '-1',
            name: vehicle.documents.Vehicle_Insurance_Proof.originalname,
            status: 'done',
            url: `http://localhost:3000/${vehicle.documents.Vehicle_Insurance_Proof.path}`,
            response: { path: vehicle.documents.Vehicle_Insurance_Proof.path }
          }]);
        }
        if (vehicle.documents.Proof_Of_Address) {
          setFileList3([{
            uid: '-1',
            name: vehicle.documents.Proof_Of_Address.originalname,
            status: 'done',
            url: `http://localhost:3000/${vehicle.documents.Proof_Of_Address.path}`,
            response: { path: vehicle.documents.Proof_Of_Address.path }
          }]);
        }
        if (vehicle.documents.Police_Clearance_Certificate) {
          setFileList4([{
            uid: '-1',
            name: vehicle.documents.Police_Clearance_Certificate.originalname,
            status: 'done',
            url: `http://localhost:3000/${vehicle.documents.Police_Clearance_Certificate.path}`,
            response: { path: vehicle.documents.Police_Clearance_Certificate.path }
          }]);
        }
      }

      // Handle existing vehicle images
      if (vehicle.vehicleImages && vehicle.vehicleImages.length > 0) {
        const existingImages = vehicle.vehicleImages.map((img, index) => ({
          uid: `-${index}`,
          name: img.originalname,
          status: 'done',
          url: `http://localhost:3000/${img.path}`,
          response: { path: img.path }
        }));
        setVehicleImages(existingImages);
      }
    } else {
      form.resetFields();
      setFileList1([]);
      setFileList2([]);
      setFileList3([]);
      setFileList4([]);
      setVehicleImages([]);
    }
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
        
      // Append form values
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });

      // Handle documents
      const appendDocument = (fileList, fieldName) => {
        if (fileList.length > 0) {
          if (fileList[0].originFileObj) {
            // New file uploaded
            formData.append(fieldName, fileList[0].originFileObj);
          } else if (fileList[0].response?.path) {
            // Existing file retained
            formData.append(`existing_${fieldName}`, fileList[0].response.path);
          }
        }
      };

      appendDocument(fileList1, 'Driving_Licence');
      appendDocument(fileList2, 'Vehicle_Insurance_Proof');
      appendDocument(fileList3, 'Proof_Of_Address');
      appendDocument(fileList4, 'Police_Clearance_Certificate');

      // Handle vehicle images
      const existingImages = vehicleImages
        .filter(file => file.response?.path)
        .map(file => file.response.path);
      
      formData.append('existing_vehicleImages', JSON.stringify(existingImages));
      formData.append('email',user?.email)
      vehicleImages
        .filter(file => file.originFileObj)
        .forEach(file => {
          formData.append('vehicleImages', file.originFileObj);
        });

      const url = editingVehicle 
        ? `http://localhost:3000/updatevehicle/${editingVehicle._id}`
        : 'http://localhost:3000/addvehicles';

      const response = await fetch(url, {
        method: editingVehicle ? 'PUT' : 'POST',
        body: formData,
      });

      if (response.ok) {
        message.success(`Vehicle ${editingVehicle ? 'updated' : 'added'} successfully!`);
        setIsModalVisible(false);
        setEditingVehicle(null);
        form.resetFields();
        fetchVehicles();
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error(`Failed to ${editingVehicle ? 'update' : 'add'} vehicle.`);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingVehicle(null);
    form.resetFields();
    setFileList1([]);
    setFileList2([]);
    setFileList3([]);
    setFileList4([]);
    setVehicleImages([]);
  };

  const handleImageUpload = ({ fileList }) => {
    setVehicleImages(fileList);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 2017 + 1 }, (_, i) => ({
    label: `${2017 + i}`,
    value: 2017 + i,
  }));


  const deleteVehicle = async (vehicleId) => {
    console.log(vehicleId)
    if (!window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) return;

    try {
      await axios.delete(`http://localhost:3000/deletevehicle/${vehicleId}`);
      
      // Remove the vehicle from the UI after successful deletion
      setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle._id !== vehicleId));
      alert('Vehicle deleted successfully.');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete the vehicle. Please try again.');
    }
  };

  const columns = [
    { title: 'Make', dataIndex: 'make', key: 'make' },
    { title: 'Model', dataIndex: 'model', key: 'model' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'License Plate', dataIndex: 'licensePlate', key: 'licensePlate' },
    { title: 'Type', dataIndex: 'vehicleType', key: 'vehicleType' },
    { title: 'Seats', dataIndex: 'seatsNo', key: 'seatsNo' },
    { title: 'Class', dataIndex: 'vehicleClass', key: 'vehicleClass' },
    {
      title: 'Documents',
      key: 'documents',
      render: (_, record) => (
        <Row gutter={[8, 8]}>
          {record.documents?.Driving_Licence && (
            <Col>
              <Button size="small" onClick={() => window.open(`http://localhost:3000/${record.documents.Driving_Licence.path}`, '_blank')}>
                License
              </Button>
            </Col>
          )}
          {record.documents?.Vehicle_Insurance_Proof && (
            <Col>
              <Button size="small" onClick={() => window.open(`http://localhost:3000/${record.documents.Vehicle_Insurance_Proof.path}`, '_blank')}>
                Insurance
              </Button>
            </Col>
          )}
          {record.documents?.Proof_Of_Address && (
            <Col>
              <Button size="small" onClick={() => window.open(`http://localhost:3000/${record.documents.Proof_Of_Address.path}`, '_blank')}>
                Address
              </Button>
            </Col>
          )}
          {record.documents?.Police_Clearance_Certificate && (
            <Col>
              <Button size="small" onClick={() => window.open(`http://localhost:3000/${record.documents.Police_Clearance_Certificate.path}`, '_blank')}>
                Police Cert
              </Button>
            </Col>
          )}
        </Row>
      ),
    },
    {
      title: 'Images',
      key: 'images',
      render: (_, record) => (
        <Row gutter={[8, 8]}>
          {record.vehicleImages?.map((image, index) => (
            <Col key={index}>
              <Button size="small" onClick={() => window.open(`http://localhost:3000/${image.path}`, '_blank')}>
                Image {index + 1}
              </Button>
            </Col>
          ))}
        </Row>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
        <Button
          icon={<EditOutlined />}
          onClick={() => showModal(record)}
          type="link"
        >
          Edit
        </Button>
        <Button
          icon={<DeleteOutlined />}
          onClick={() => deleteVehicle(record._id)}
          type="link"
        >
         Delete
        </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          size="large"
        >
          Add Vehicle
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={vehicles}
        scroll={{ x: true }}
        className="custom-table"
        pagination={{
          responsive: true,
          defaultPageSize: 5,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        loading={loading}
        rowKey="_id"
      />

      <Modal
        title={editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="make"
                label="Make"
                rules={[{ required: true, message: 'Please input vehicle make!' }]}
              >
                <Input size="large" placeholder="Enter vehicle make" />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                name="model"
                label="Model"
                rules={[{ required: true, message: 'Please input vehicle model!' }]}
              >
                <Input size="large" placeholder="Enter vehicle model" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="vehicleType"
                label="Vehicle Type"
                rules={[{ required: true, message: 'Please select a vehicle type!' }]}
              >
                <Select
                  size="large"
                  placeholder="Select vehicle type"
                  options={vehicleTypes}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="year"
                label="Year"
                rules={[{ required: true, message: 'Please select the vehicle year!' }]}
              >
                <Select
                  size="large"
                  placeholder="Select vehicle year"
                  options={yearOptions}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="seatsNo"
                label="No of Seats"
                rules={[{ required: true, message: 'Please input number of seats!' }]}
              >
                <Input size="large" type="number" placeholder="Enter number of seats" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="licensePlate"
                label="License Plate"
                rules={[{ required: true, message: 'Please input license plate!' }]}
              >
                <Input size="large" placeholder="Enter license plate" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="vehicleClass"
                label="Vehicle Class"
                rules={[{ required: true, message: 'Please select vehicle class!' }]}
              >
                <Select
                  size="large"
                  placeholder="Select vehicle class"
                  options={[
                    { value: 'Premium', label: 'Premium' },
                    { value: 'Luxury', label: 'Luxury' },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item 
                label="Driving Licence" 
                required={!editingVehicle}
                tooltip={editingVehicle ? "Upload new file to replace existing" : ""}
              >
                <Dragger
                  fileList={fileList1}
                  beforeUpload={() => false}
                  onChange={(info) => handleUpload(info, setFileList1)}
                  onPreview={handlePreview}
                >
                  <Button icon={<UploadOutlined />}>
                    {fileList1.length > 0 ? 'Replace Driving Licence' : 'Upload Driving Licence'}
                  </Button>
                </Dragger>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item 
                label="Vehicle Insurance Proof" 
                required={!editingVehicle}
                tooltip={editingVehicle ? "Upload new file to replace existing" : ""}
              >
                <Dragger
                  fileList={fileList2}
                  beforeUpload={() => false}
                  onChange={(info) => handleUpload(info, setFileList2)}
                  onPreview={handlePreview}
                >
                  <Button icon={<UploadOutlined />}>
                    {fileList2.length > 0 ? 'Replace Insurance Proof' : 'Upload Insurance Proof'}
                  </Button>
                </Dragger>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item 
                label="Proof Of Address" 
                required={!editingVehicle}
                tooltip={editingVehicle ? "Upload new file to replace existing" : ""}
              >
                <Dragger
                  fileList={fileList3}
                  beforeUpload={() => false}
                  onChange={(info) => handleUpload(info, setFileList3)}
                  onPreview={handlePreview}
                >
                  <Button icon={<UploadOutlined />}>
                    {fileList3.length > 0 ? 'Replace Address Proof' : 'Upload Address Proof'}
                  </Button>
                </Dragger>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item 
                label="Police Clearance Certificate" 
                required={!editingVehicle}
                tooltip={editingVehicle ? "Upload new file to replace existing" : ""}
              >
                <Dragger
                  fileList={fileList4}
                  beforeUpload={() => false}
                  onChange={(info) => handleUpload(info, setFileList4)}
                  onPreview={handlePreview}
                >
                  <Button icon={<UploadOutlined />}>
                    {fileList4.length > 0 ? 'Replace Police Certificate' : 'Upload Police Certificate'}
                  </Button>
                </Dragger>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Vehicle Images"
                tooltip="Upload multiple images of your vehicle"
              >
                <Upload
                  listType="picture-card"
                  fileList={vehicleImages}
                  onChange={handleImageUpload}
                  onPreview={handlePreview}
                  beforeUpload={() => false}
                  multiple
                >
                  <div>
                    <PictureOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
}

export default DriverAddVehicleModal;