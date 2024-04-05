import React from "react";
import { useNavigate } from "react-router-dom";

function Doctor({ doctor }) {
  const navigate = useNavigate();
  return (
    <div
      className="card p-2 my-2 cursor-pointer"
      onClick={() => navigate(`/book-appointment/${doctor._id}`)}
      style={{ position: 'relative' }}
    >
      <div className="imageBox" style={{ position: 'absolute', left: 10, top: 10 }}>
        {doctor.profileimg && <img src={doctor.profileimg} alt="doctor image" width="100%"
          height="400" />}
      </div>
      <div style={{ marginLeft: 120 }}>
        <h1 className="card-title">
          {doctor.firstName} {doctor.lastName}
        </h1>
        <p>
          <b>Specialization : </b>
          {doctor.specialization}
        </p>
        <hr />
        <p>
          <b>Phone Number : </b>
          {doctor.phoneNumber}
        </p>
        <p>
          <b>Address : </b>
          {doctor.address}
        </p>
        <p>
          <b>Fee per Visit : </b>
          {doctor.feePerCunsultation}
        </p>
        <p>
          <b>Timings : </b>
          {doctor.timings[0]} - {doctor.timings[1]}
        </p>
      </div>
    </div>
  );
}

export default Doctor;
