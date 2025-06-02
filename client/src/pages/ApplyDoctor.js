
import { Form, Row, Col, TimePicker, message } from "antd";
import { Layout } from "../component/Layout";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";

const ApplyDoctor = () => {
  const {user} = useSelector(state=>state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleFinish = async (values) => {
    console.log("Form submitted with values:", values);
     try{
      dispatch(showLoading)
      const res = await axios.post('/api/v1/user/apply-doctor', {...values}, {userId:user._id}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`
      }})
      dispatch(hideLoading)
      if(res.data.success){
        message.success(res.data.success)
        navigate('/')
      }
      else message.error(res.data.success)
     }catch(error){
      dispatch(showLoading)
      console.log(error)
      message.error("something went wrong")
     }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
        <h1 className="text-center text-3xl font-bold text-blue-700 mb-8 tracking-wide">Apply as a Doctor</h1>
        <Form layout="vertical" onFinish={handleFinish}>
          <h4 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Personal Details</h4>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label={<span className="font-medium text-gray-600">First Name</span>}
                name="firstName"
                rules={[{ required: true, message: "Please enter your first name" }]}
              >
                <input type="text" placeholder="Enter your first name" className="form-input w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label={<span className="font-medium text-gray-600">Last Name</span>}
                name="lastName"
                rules={[{ required: true, message: "Please enter your last name" }]}
              >
                <input type="text" placeholder="Enter your last name" className="form-input w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label={<span className="font-medium text-gray-600">Phone</span>}
                name="phone"
                rules={[{ required: true, message: "Please enter your phone number" }]}
              >
                <input type="text" placeholder="Enter your phone number" className="form-input w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label={<span className="font-medium text-gray-600">Email</span>}
                name="email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <input type="email" placeholder="Enter your email" className="form-input w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item label={<span className="font-medium text-gray-600">Website</span>} name="website">
                <input type="text" placeholder="Enter your website" className="form-input w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label={<span className="font-medium text-gray-600">Address</span>}
                name="address"
                rules={[{ required: true, message: "Please enter your address" }]}
              >
                <input type="text" placeholder="Enter your address" className="form-input w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </Form.Item>
            </Col>
          </Row>
          <h4 className="text-xl font-semibold text-gray-700 mt-8 mb-4 border-b pb-2">Professional Details</h4>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label={<span className="font-medium text-gray-600">Specialization</span>}
                name="specialization"
                rules={[{ required: true, message: "Please enter your specialization" }]}
              >
                <input type="text" placeholder="Enter your specialization" className="form-input w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label={<span className="font-medium text-gray-600">Experience (in years)</span>}
                name="experience"
                rules={[{ required: true, message: "Please enter your experience" }]}
              >
                <input type="text" placeholder="Enter your experience" className="form-input w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label={<span className="font-medium text-gray-600">Fees Per Consultation</span>}
                name="feesPerConsultation"
                rules={[{ required: true, message: "Please enter your fees" }]}
              >
                <input type="number" placeholder="Enter your fees" className="form-input w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label={<span className="font-medium text-gray-600">Timings</span>}
                name="timings"
                rules={[{ required: true, message: "Please enter your timings" }]}
              >
                <TimePicker.RangePicker format="HH:mm" className="w-full" />
              </Form.Item>
            </Col>
          </Row>
          <div className="flex justify-end mt-8">
            <button className="bg-blue-600 text-lg px-8 py-3 rounded-lg font-semibold text-white shadow-md hover:bg-blue-700 transition-all duration-200" type="submit">
              Submit
            </button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default ApplyDoctor;