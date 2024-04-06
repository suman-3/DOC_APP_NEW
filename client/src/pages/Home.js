import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Card, Col, Row } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";

const tabList = [
  {
    key: "All",
    tab: "All",
  },
  {
    key: "Neurologist",
    tab: "Neurologist",
  },
  {
    key: "Dermatologist",
    tab: "Dermatologist",
  },
  {
    key: "EyeSpecialist",
    tab: "EyeSpecialist",
  },
  {
    key: "Orthopaedics",
    tab: "Orthopaedics",
  },
];

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [activeTabKey1, setActiveTabKey1] = useState("All");
  const dispatch = useDispatch();
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
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };

  const contentList = {
    All: (
      <Row gutter={20}>
        {doctors.map((doctor) => (
          <Col span={8} xs={24} sm={24} lg={8} key={doctor.id}>
            <Doctor doctor={doctor} />
          </Col>
        ))}
        {doctors.length === 0 && (
          <Col span={24}>
            <p>No Result Found</p>
          </Col>
        )}
      </Row>
    ),
    Neurologist: (
      <Row gutter={20}>
        {doctors.map(
          (doctor) =>
            doctor.specialization === "Neurologist" && (
              <Col span={8} xs={24} sm={24} lg={8}>
                <Doctor doctor={doctor} />
              </Col>
            )
        )}
        {doctors.filter((doctor) => doctor.specialization === "Neurologist").length === 0 && (
          <Col span={24}>
            <p>No Result Found</p>
          </Col>
        )}
      </Row>
    ),
    Dermatologist: (
      <Row gutter={20}>
        {doctors.map(
          (doctor) =>
            doctor.specialization === "Dermatologist" && (
              <Col span={8} xs={24} sm={24} lg={8}>
                <Doctor doctor={doctor} />
              </Col>
            )
        )}
        {doctors.filter((doctor) => doctor.specialization === "Dermatologist").length === 0 && (
          <Col span={24}>
            <p>No Result Found</p>
          </Col>
        )}
      </Row>
    ),
    EyeSpecialist: (
      <Row gutter={20}>
        {doctors.map(
          (doctor) =>
            doctor.specialization === "EyeSpecialist" && (
              <Col span={8} xs={24} sm={24} lg={8}>
                <Doctor doctor={doctor} />
              </Col>
            )
        )}
        {doctors.filter((doctor) => doctor.specialization === "EyeSpecialist").length === 0 && (
          <Col span={24}>
            <p>No Result Found</p>
          </Col>
        )}
      </Row>
    ),
    Orthopaedics: (
      <Row gutter={20}>
        {doctors.map(
          (doctor) =>
            doctor.specialization === "Orthopaedics" && (
              <Col span={8} xs={24} sm={24} lg={8}>
                <Doctor doctor={doctor} />
              </Col>
            )
        )}
        {doctors.filter((doctor) => doctor.specialization === "Orthopaedics").length === 0 && (
          <Col span={24}>
            <p>No Result Found</p>
          </Col>
        )}
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
          tabList={tabList}
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
