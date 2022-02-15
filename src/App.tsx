import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Button, Divider, Header, Container } from "semantic-ui-react";

import { apiBaseUrl } from "./constants";
import { setPatientList, useStateValue } from "./state";
import { Patient } from "./types";

import PatientListPage from "./PatientListPage";
import SinglePatientDetails from "./PatientDetailPage";


const App = () => {
  const [, dispatch] = useStateValue();

  React.useEffect(() => {
   void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
        dispatch(setPatientList(patientListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchPatientList();
  }, [dispatch]);
  
  

  return (
    <div className="App">
      <Router>
        <Container>
          <Header as="h1">Patientor</Header>
          <Button as={Link} to="/" primary>
            Home
          </Button>
          <Divider hidden />
          <Switch>
            <Route path="/" exact component={PatientListPage} />
            <Route
              path="/patients/:id" 
              component = {SinglePatientDetails} /> 
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;
