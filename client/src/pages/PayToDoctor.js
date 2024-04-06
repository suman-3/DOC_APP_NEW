import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Table } from "antd";

import { useParams } from "react-router-dom";

function PayToDoctor() {
  const [appointments, setAppointments] = useState([]);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false); // State to track payment status
  const dispatch = useDispatch();
  const [paymentStatus, setPaymentStatus] = useState(false);
  const params = useParams();

  const getPaymentDetails = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/payment/get-payment-details-by-user-id",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      dispatch(hideLoading());
      toast.error("Error fetching appointments");
    }
  };

  const columns = [
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => <span>{record.doctorInfo.phoneNumber}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => <span>{record.doctorInfo.email}</span>,
    },
    {
      title: "Fees",
      dataIndex: "fees",
      render: (text, record) => (
        <span>{record.doctorInfo.feePerCunsultation}</span>
      ),
    },
    {
      title: "Status",
      render: (text, record) => (
        <span>
          {record.paymentStatus ? (
            <div className="d-flex">
              <a
                className="anchor px-2"
                href="https://mail.google.com/mail/u/0/#inbox"
                target="_blank"
              >
                View Receipt
              </a>
            </div>
          ) : (
            <div className="d-flex">
              {record.status !== "approved" ? (
                <h1 className="anchor px-2">Waiting For Approval</h1>
              ) : (
                <h1
                  className="anchor px-2"
                  onClick={() => handlePayNow(record)}
                >
                  Pay Now
                </h1>
              )}
            </div>
          )}
        </span>
      ),
    },
  ];

  const PaymentSuccessFullMail = async (
    record,
    order_id,
    razorpay_payment_id,
    method,
    email
  ) => {
    const serviceId = "service_cageyes";
    const templateId = "template_0qhdtmq";
    const publicKey = "XulQqyukcx5FEh9-P";

    const doctor_full_name =
      record.doctorInfo.firstName + " " + record.doctorInfo.lastName;
    const doctor_email = record.doctorInfo.email;

    const doctor_name = doctor_full_name;
    const patient_name = record.userInfo.name;
    const patient_email = record.userInfo.email;
    const message = `Payment of  ₹ ${record.doctorInfo.feePerCunsultation} Sucessfully Recieved`;

    const data = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        doctor_email: doctor_email,
        doctor_name: doctor_name,
        patient_name: patient_name,
        patient_email: patient_email,
        message: message,
        razorpay_payment_id: razorpay_payment_id,
        order_id: order_id,
        method: method,
        email: email,
      },
    };

    try {
      const res = await axios.post(
        "https://api.emailjs.com/api/v1.0/email/send",
        data
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const PaymentMailToDoctor = async (record) => {
    const serviceId = "service_cageyes";
    const templateId = "template_2mu1wyw";
    const publicKey = "XulQqyukcx5FEh9-P";

    const doctor_full_name =
      record.doctorInfo.firstName + " " + record.doctorInfo.lastName;
    const doctor_email = record.doctorInfo.email;

    const doctor_name = doctor_full_name;
    const patient_name = record.userInfo.name;
    const patient_email = record.userInfo.email;
    const patient_id = record.userInfo._id;
    const message = `${patient_name} paid  ₹ ${record.doctorInfo.feePerCunsultation} , for Appoinment`;

    const data = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        doctor_email: doctor_email,
        doctor_name: doctor_name,
        patient_name: patient_name,
        patient_email: patient_email,
        message: message,
        patient_id: patient_id,
      },
    };

    try {
      const res = await axios.post(
        "https://api.emailjs.com/api/v1.0/email/send",
        data
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadScript = async (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async (record) => {
    try {
      const orderId = record.userInfo._id;
      const amount = record.doctorInfo.feePerCunsultation;
      const name = record.doctorInfo.name;

      const scriptLoaded = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      const paymentRes = {
        order_id: orderId,
        amount: amount,
        currency: "INR",
        payment_capture: 1,
        name: name,
      };

      const result = await axios.post("/api/payment/create-order", paymentRes);
      const responseData = result.data;

      if (!responseData.success) {
        throw new Error("Server Error");
      }

      const options = {
        key: process.env.RAZORPAY_ID_KEY, // Replace with your actual key
        currency: responseData.data.currency,
        amount: responseData.data.amount * 100,
        order_id: responseData.data.id,
        name: record.doctorInfo.firstName + " " + record.doctorInfo.lastName,
        description: "Book Your Slot",
        image: record.doctorInfo.profileimg,
        handler: async function (response) {
          const result_1 = await axios.post("/api/payment/card-details", {
            razor_payment_id: response.razorpay_payment_id,
          });

          setPaymentSuccessful(true);
          setPaymentStatus(true);
          PaymentSuccessFullMail(
            record,
            responseData.data.id,
            response.razorpay_payment_id,
            result_1.data.data.method,
            result_1.data.data.email
          );
          PaymentMailToDoctor(record);

          try {
            dispatch(showLoading());
            const resposne = await axios.post(
              "/api/doctor/change-appointment-payment-status",
              { appointmentId: record._id, paymentStatus: true },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (resposne.data.success) {
              toast.success("Payment Successfull");
              // window.location.reload();
            }
            dispatch(hideLoading());
          } catch (error) {
            toast.error("Error changing doctor account status");
            dispatch(hideLoading());
          }
        },
        prefill: {
          email: record.doctorInfo.email,
          contact: record.doctorInfo.phoneNumber,
        },
        notes: {
          address: record.doctorInfo.address,
        },
        theme: {
          color: "#2563eb",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error handling payment:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getPaymentDetails();
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Pay To Doctor</h1>
      <hr />
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
}

export default PayToDoctor;
