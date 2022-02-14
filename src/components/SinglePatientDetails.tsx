/* eslint-disable @typescript-eslint/restrict-template-expressions */
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import { apiBaseUrl } from "../constants";
import { setPatient, useStateValue } from "../state";
import { Patient } from "../types";

const SinglePatientDetails = () => {
  const {id} = useParams<{ id: string }>();
  const [{ patient }, dispatch] = useStateValue();

  const genderIcon = (gender: string | undefined) => {
    const icon =
      gender === "male" ? (
        <Icon male name="mars" size="large" />
      ) : (
        <Icon male name="mars" size="large" />
      );
    return icon;
  };

  React.useEffect(() => {
    if(patient && patient.id === id) return;
    const getSinglePatient = async () => {
      try {
        const response = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(setPatient(response.data));
      } catch (error) {
        console.log(error);
      }
    };
     // eslint-disable-next-line @typescript-eslint/no-floating-promises
     getSinglePatient();
  });

  return (
    <>
      <h2>
        {patient?.name}
        {genderIcon(patient?.gender)}
      </h2>
      <p>ssn : {patient?.ssn}</p>
      <p>occupation: {patient?.occupation}</p>
    </>
  );
};

export default SinglePatientDetails;
