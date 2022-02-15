import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { apiBaseUrl } from '../constants';
import { Diagnosis } from '../types';



const Diagnose :React.FC<{code: string | null}> =({code})=>{
    const [diagnose, setDiagnose] = useState<Diagnosis | null >(null);
    useEffect(()=>{
        if(code){
            const getData =async()=>{
                const response = await axios.get(`${apiBaseUrl}/diagnoses/${code}`);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                setDiagnose(response.data);
            };
            void getData();
        }
    }, [code]);

    if(!diagnose) return null;

    return(
        <div>
            <li>{diagnose.code} {diagnose.name}</li>
        </div>
    );
};




const DiagnosisDetails: React.FC<{ diagnosis: Array<Diagnosis['code']> | null | undefined }> = ({diagnosis}) => {
  if (!diagnosis) return null;
  return(
      <>
        {diagnosis.map((d,i)=> <Diagnose key = {i} code= {d} />)}
      </>
  );
};

export default DiagnosisDetails;
