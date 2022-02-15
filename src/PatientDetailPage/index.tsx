/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Divider, Icon } from "semantic-ui-react";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import { apiBaseUrl } from "../constants";
import { setPatient, useStateValue } from "../state";
import { Patient } from "../types";
import { Entry } from "../types";
import DiagnosisDetails from "./Diagnosis";



const SinglePatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patient }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();
  const [entries, setEntries] = React.useState<Entry[]>([]);
  
  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
     
      const response = await axios.post(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      if(response!= undefined){
         setEntries(entries.concat(response.data));
         //console.log('---entries', entries);
         closeModal();
      }
     } catch (error) {
      console.log(error);
      setError(error.data.console.error);
    }
  };

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
    if (patient && patient.id === id) return;
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
  if (!patient) return null;
  return (
    <>
      <h2>
        {patient?.name}
        {genderIcon(patient?.gender)}
      </h2>
      <p>ssn : {patient?.ssn}</p>
      <p>occupation: {patient?.occupation}</p>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
      <Divider hidden />
      <h4>Entries</h4>
      <Entries entries={patient?.entries} />
    </>
  );
};

const Entries: React.FC<{ entries: Entry[] }> = ({ entries }) => {
  return (
    <>
      {entries.map((e, i) => (
        <EntryDetail key={i} entry={e} />
      ))}
    </>
  );
};

const getColor = (rating: number) => {
  switch (rating) {
    case 0:
      return "green";
    case 1:
      return "yellow";
    case 2:
      return "pink";
    case 3:
      return "red";
  }
};

const assertNever = (value: never): never => {
  throw new Error(
    `unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetail: React.FC<{ entry: Entry | null }> = ({ entry }) => {
  if (!entry) {
    return null;
  }
  switch (entry.type) {
    case "Hospital":
      return (
        <Card>
          <Card.Content>
            <Card.Header>
              {entry.date}
              <Icon name="hospital" size="large" />
            </Card.Header>
          </Card.Content>
          <Card.Content description={entry.description} />
          <Card.Content>
            <DiagnosisDetails diagnosis={entry.diagnosisCodes} />
          </Card.Content>
          <Card.Content>
            <h6>Discharge:{entry.discharge?.date}</h6>
          </Card.Content>
          <Card.Meta>{entry.discharge?.criteria}</Card.Meta>
        </Card>
      );

    case "HealthCheck":
      return (
        <Card>
          <Card.Content>
            <Card.Header>
              {entry.date}
              <Icon name="hospital" size="large" />
            </Card.Header>
          </Card.Content>
          <Card.Content description={entry.description} />
          <Card.Content>
            <DiagnosisDetails diagnosis={entry.diagnosisCodes} />
          </Card.Content>
          <Card.Content>
            <Icon name="heart" color={getColor(entry.healthCheckRating)} />
          </Card.Content>
        </Card>
      );

    case "OccupationalHealthcare":
      return (
        <Card>
          <Card.Content>
            <Card.Header>
              {entry.date}
              <Icon name="stethoscope" size="large" />
              {entry.employerName}
            </Card.Header>
          </Card.Content>
          <Card.Content description={entry.description} />
          <Card.Content>
            <DiagnosisDetails diagnosis={entry.diagnosisCodes} />
          </Card.Content>
          {entry.sickLeave && (
            <Card.Content>
              <h6>Sick Leave</h6>
              startDate: {entry.sickLeave.startDate}
              <br></br>
              endDate: {entry.sickLeave.endDate}
            </Card.Content>
          )}
        </Card>
      );

    default:
      return assertNever(entry);
  }
};

export default SinglePatientDetails;
