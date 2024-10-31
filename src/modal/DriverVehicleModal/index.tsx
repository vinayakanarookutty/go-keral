import React,{useState,useEffect} from 'react'
import { Form, Input, Button, Table,  Modal, Select,  Row, Col,Upload,message } from 'antd';
import { PlusOutlined,UploadOutlined } from '@ant-design/icons';
const { Dragger } = Upload;
import axios from 'axios';
function DriverAddVehicleModal() {
    
  const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileList1, setFileList1] = useState([]);
    const [fileList2, setFileList2] = useState([]);
    const [fileList3, setFileList3] = useState([]);
    const [fileList4, setFileList4] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [form] = Form.useForm();
    const [pdfFile, setPdfFile] = useState(null);
    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
      };
      useEffect(() => {
        fetchVehicles();
      }, []);
      
      const fetchVehicles = async () => {
        try {
          const response = await axios.get('http://localhost:3000/getvehicles');
          console.log('Fetched Vehicles:', response.data); // Check the structure
          const data = Array.isArray(response.data) ? response.data : [];
          setVehicles(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
          message.error('Failed to fetch vehicles');
          setLoading(false);
        }
      };
    const handleFileClick = async (filePath) => {
        console.log("haiiii")
        setPdfFile(`http://localhost:3000/${filePath}`);
        const response = await fetch(`http://localhost:3000/${filePath}`);
      
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          
          // Open the PDF in a new window or tab
          window.open(url, '_blank');
        }
      };
  const columns = [
    { title: 'Make', dataIndex: 'make', key: 'make' },
    { title: 'Model', dataIndex: 'model', key: 'model' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'License Plate', dataIndex: 'licensePlate', key: 'licensePlate' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    {
      title: 'Driving Licence',
      dataIndex: 'Driving_Licence',
      key: 'Driving_Licence',
      render: (text, record) => (
        <Button onClick={() => handleFileClick(record.Driving_Licence)}>
          View Driving Licence
        </Button>
      ),
    },
    {
      title: 'Vehicle Insurance Proof',
      dataIndex: 'Vehicle_Insurance_Proof',
      key: 'Vehicle_Insurance_Proof',
      render: (text, record) => (
        <Button onClick={() => handleFileClick(record.Vehicle_Insurance_Proof)}>
          View Insurance
        </Button>
      ),
    },
    {
      title: 'Proof Of Address',
      dataIndex: 'Proof_Of_Address',
      key: 'Proof_Of_Address',
      render: (text, record) => (
        <Button onClick={() => handleFileClick(record.Proof_Of_Address)}>
          View Address Proof
        </Button>
      ),
    },
    {
      title: 'Police Clearance Certificate',
      dataIndex: 'Police_Clearance_Certificate',
      key: 'Police_Clearance_Certificate',
      render: (text, record) => (
        <Button onClick={() => handleFileClick(record.Police_Clearance_Certificate)}>
          View Police Certificate
        </Button>
      ),
    },
  ];

  const handleOk = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();

      // Append form fields
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      // Append files
      if (fileList1[0]) formData.append('Driving_Licence', fileList1[0].originFileObj);
      if (fileList2[0]) formData.append('Vehicle_Insurance_Proof', fileList2[0].originFileObj);
      if (fileList3[0]) formData.append('Proof_Of_Address', fileList3[0].originFileObj);
      if (fileList4[0]) formData.append('Police_Clearance_Certificate', fileList4[0].originFileObj);

      // Send the FormData to your backend
      fetch('http://localhost:3000/addvehicles', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          message.success('Vehicle added successfully!');
          setIsModalVisible(false);
          form.resetFields();
        })
        .catch((error) => {
          console.error('Error:', error);
          message.error('Failed to add vehicle.');
        });
    });
  };
  return (
    <div>
    <div className="mb-6">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showModal}
        size="large"
      >
        Add Vehicle
      </Button>
    </div>
    <Table
columns={columns}
dataSource={vehicles || []} // Default to empty array
scroll={{ x: true }}
className="custom-table"
pagination={{
responsive: true,
defaultPageSize: 5,
showSizeChanger: true,
showTotal: (total, range) =>
`${range[0]}-${range[1]} of ${total} items`,
}}
loading={loading}
rowKey="_id"
/>
{pdfFile && (
<div style={{ marginTop: 20 }}>
<h3>PDF Preview</h3>
<div style={{ height: '750px' }}>
{/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
<Viewer fileUrl={pdfFile} />
</Worker> */}
<PdfComp pdfFile={pdfFile}/>

</div>
</div>
)}
  <Modal
        title="Add New Vehicle"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
      >
        <Form form={form} layout="vertical"  >
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
                name="year"
                label="Year"
                rules={[{ required: true, message: 'Please input vehicle year!' }]}
              >
                <Input size="large" type="number" placeholder="Enter vehicle year" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
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
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Please select vehicle type!' }]}
              >
                <Select
                  size="large"
                  placeholder="Select vehicle type"
                  options={[
                    { value: 'Premium', label: 'Premium' },
                    { value: 'Luxury', label: 'Luxury' },
                  ]}
                />
              </Form.Item>
            </Col>
            {/* Upload Fields */}
            <Col xs={24} sm={12}>
              <Form.Item label="Driving Licence" required>
                <Dragger
                  fileList={fileList1}
                  beforeUpload={() => false}
                  onChange={(info) => handleUpload(info, setFileList1)}
                >
                  <Button icon={<UploadOutlined />}>Driving Licence</Button>
                </Dragger>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Vehicle Insurance Proof" required>
                <Dragger
                  fileList={fileList2}
                  beforeUpload={() => false}
                  onChange={(info) => handleUpload(info, setFileList2)}
                >
                  <Button icon={<UploadOutlined />}>Vehicle Insurance Proof</Button>
                </Dragger>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Proof Of Address" required>
                <Dragger
                  fileList={fileList3}
                  beforeUpload={() => false}
                  onChange={(info) => handleUpload(info, setFileList3)}
                >
                  <Button icon={<UploadOutlined />}>Proof Of Address</Button>
                </Dragger>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Police Clearance Certificate" required>
                <Dragger
                  fileList={fileList4}
                  beforeUpload={() => false}
                  onChange={(info) => handleUpload(info, setFileList4)}
                >
                  <Button icon={<UploadOutlined />}>Police Clearance Certificate</Button>
                </Dragger>
              </Form.Item>
            </Col>

          </Row>

        </Form>
      </Modal>
  </div>
  
  )
}

export default DriverAddVehicleModal