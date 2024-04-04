import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Card, Col, Row } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [activeTabKey1, setActiveTabKey1] = useState(null); // Initialize to null until data is fetched
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("/api/user/get-all-approved-doctors", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        dispatch(hideLoading());
        if (response.data.success) {
          setDoctors(response.data.data);
          // Set the active tab to the first specialization
          setActiveTabKey1(response.data.data.length > 0 ? response.data.data[0].specialization : null);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, [dispatch]);

  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };

  const contentList = {
    Nurologist: (
      <Row gutter={20}>
        {doctors
          .filter((doctor) => doctor.specialization === "Nurologist")
          .map((doctor) => (
            <Col span={8} xs={24} sm={24} lg={8} key={doctor.id}>
              <Doctor doctor={doctor} />
            </Col>
          ))}
      </Row>
    ),
    Dermatologist: (
      <Row gutter={20}>
        {doctors
          .filter((doctor) => doctor.specialization === "Dermatologist")
          .map((doctor) => (
            <Col span={8} xs={24} sm={24} lg={8} key={doctor.id}>
              <Doctor doctor={doctor} />
            </Col>
          ))}
      </Row>
    ),
    EyeSpecialist: (
      <Row gutter={20}>
        {doctors
          .filter((doctor) => doctor.specialization === "EyeSpecialist")
          .map((doctor) => (
            <Col span={8} xs={24} sm={24} lg={8} key={doctor.id}>
              <Doctor doctor={doctor} />
            </Col>
          ))}
      </Row>
    ),
  };

  return (
    <Layout>
      <Row gutter={20}>
        <Card
          style={{
            width: "100%",
          }}
          tabList={doctors.length > 0 ? doctors.map((doctor) => ({ key: doctor.specialization, tab: doctor.specialization })) : []}
          activeTabKey={activeTabKey1}
          onTabChange={onTab1Change}
        >
          {contentList[activeTabKey1]}
        </Card>
      </Row>
    </Layout>
  );
}

export default Home;
