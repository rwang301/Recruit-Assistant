import React from 'react'
import styled from "styled-components";
import { GoogleLogin } from 'react-google-login';
import GoogleRegisterModal from './GoogleRegisterModal';
import { isEmailValid } from '../components/Form';
import { API_URL } from '../utils/api';
import { StoreContext } from '../utils/store';

const CLIENT_ID = '836356102465-7majqspmjajgqhpoevi5mlmu8mdkmbsh.apps.googleusercontent.com';

const GoogleButton = styled(GoogleLogin)`
  max-width: 20vmin;
  width: 20vmin;
  height: 8vmin;
`;

export default function GoogleSignBtn(props) {
  const [openRegisterModal, setOpenRegisterModal] = React.useState(false);
  const [name, setName] = React.useState();
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState('test');
  const { setAlert, employer, setEmployer } = React.useContext(StoreContext);

  async function register() {
    if (!/^([A-Z][a-z]{1,} ){1,}[A-Z][a-z]{1,}$/.test(name)) {
      setAlert({ open: true, severity: 'warning', message: 'Please enter a valid name' });
    } else if (!isEmailValid(email)) {
      setAlert({ open: true, severity: 'warning', message: 'Please enter a valid email' });
    } else {
      const data = {name: name, email: email, password: password, employer: employer};
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }
      try {
        const response = await fetch(`${API_URL}/auth/register`, options);
        if (response.status === 200) {
          const json = await response.json();
          props.login(json.token);
          return employer ? 'employer' : 'jobseeker';
        } else if (response.status === 409) {
          setAlert({ open: true, severity: 'info', message: 'Email already exists' });
        } else {
          setAlert({ open: true, severity: 'error', message: 'Oops something went wrong' });
        }
      } catch (error) {
        setAlert({ open: true, severity: 'warning', message: error.message });
      }
    }
    return '';
	}

  const login = async (res) => {
    setOpenRegisterModal(true);
    setEmail(res.tt.$t);
    setName(res.tt.Ad);
    //needs to login if user already exists
    //check if email is registered
  }

  const handleLoginFailure = (res) => {
    console.log(res)
  }

  return (
    <>
      <GoogleButton
          clientId={CLIENT_ID}
          buttonText='Login with Google'
          onSuccess={(res) => login(res)}
          onFailure={(res) => handleLoginFailure(res)}
          cookiePolicy={'single_host_origin'}
          responseType='code,token'
      />
      {openRegisterModal && 
        <GoogleRegisterModal 
          closeModal={() => setOpenRegisterModal(false)} 
          email={email} setEmail={(e) => setEmail(e.target.value)} 
          name={name} setName={(e) => setName(e.target.value)} 
          employer={employer} updateEmployer={() => setEmployer(!employer)} 
          register={register} 
        />
      }
    </>
  )
}

