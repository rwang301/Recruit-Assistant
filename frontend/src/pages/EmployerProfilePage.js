import React from 'react';
import styled from "styled-components";
import PostJobModal from '../components/PostJobModal';
import edit from '../assets/edit.svg'
import add from '../assets/add.svg'
import AboutRow from '../components/AboutRow';
import { ListedJobRow } from '../components/Rows';
import { StoreContext } from '../utils/store';
import EmployerDetailModal from '../components/EmployerDetailModal';
import { ProfilePic } from '../components/Form';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 2vh;
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const NameText = styled.p`
  font-size: 2.5vw;
`;

const SideButton = styled.img`
  position: absolute;
  cursor: pointer;
  height: 2vw;
  width: 2vw;
  margin-left: 17.5vw;
`;

const EditButton = styled(SideButton)`
  margin-top: 1.4vw;
`;

const AddButton = styled(SideButton)`
  margin-top: 21.75vw;
`;

const AboutContainer = styled.div`
  border: 3px solid white;
  border-radius: 1vw;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubtitleText = styled.p`
  font-size: 1.5vw;
  font-weight: bold;
  width: 100%;
  text-align: center;
  padding-bottom: 1.75vw;
  border-bottom: 0.1vw white solid;
`;

const AboutRowContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function EmployerProfilePage() {
  const { api, setAlert } = React.useContext(StoreContext);
  const [postJobModal, setPostJobModal] = React.useState(false);
  const [updateDetailsModal, setUpdateDetailsModal] = React.useState(false);
  const [jobsToRender, setJobsToRender] = React.useState([]);
  const [name, setName] = React.useState();
  const [password, setPassword] = React.useState();
  const [email, setEmail] = React.useState();
  const [company, setCompany] = React.useState();
  const [location, setLocation] = React.useState();
  const [profile, setProfile] = React.useState();
  const [response, setResponse] = React.useState();

  const initial = (response) => {
    const {email, name, password, location, profile, company, jobs} = response;
    setEmail(email);
    setName(name);
    setPassword(password);
    setLocation(location);
    setProfile(profile);
    setCompany(company);
    setJobsToRender(jobs);
    setResponse(response);
  };

  React.useEffect(() => {
    const getJobs = async () => {
      const response = await api.fetch('employer/profile');
      if (response) {
        initial(response);
      }
    };
    getJobs();
  }, []);
  
  const postJob = async (jobTitle, location, description, skillOne, skillTwo, skillThree, closingDate, employmentType) => {
    const data = {
      job_title: jobTitle,
      location: location,
      description: description,
      skills: [skillOne, skillTwo, skillThree],
      employment_type: employmentType,
      closing_date: closingDate
    };
    const response = await api.fetch('job', 'post', data);
    if (response) {
      setUpdateDetailsModal(false);
      setJobsToRender([...jobsToRender, { ...data, id: response.id }]);
      setPostJobModal(false);
    }
  };

  const updateProfile = async () => {
    if (name && !/^([A-Z][a-z]{1,} ){1,}[A-Z][a-z]{1,}$/.test(name)) {
      setAlert({ open: true, severity: 'warning', message: 'Please enter a valid name' });
    } else {
      setUpdateDetailsModal(false);
      setName(name || response.name);
      setPassword(password || response.password);
      setLocation(location || response.location);
      setCompany(company || response.company);
      api.fetch('employer/profile', 'put', {
        name: name || response.name,
        password: password || response.password,
        location: location || response.location,
        company: company || response.company,
        profile,
      });
    }
  };

  const cancel = () => {
    setUpdateDetailsModal(false);
    initial(response);
  };

  return (
    <ProfileContainer >
      <AvatarContainer>
        <ProfilePic src={profile || '/broken-image.jpg'} />
        <NameText>{name}</NameText>
      </AvatarContainer>
      <AboutContainer>
        <EditButton src={edit} onClick={() => setUpdateDetailsModal(true)} />
        <SubtitleText>
          About
        </SubtitleText>
        <AboutRowContainer>
          <AboutRow iconType={'email'} text={email || 'Click edit to update Your Email'}/>
          <AboutRow iconType={'company'} text={company || 'Click edit to update Your Company'}/>
          <AboutRow iconType={'location'} text={location || 'Click edit to update Your Location' }/>
        </AboutRowContainer>
        <SubtitleText>
          Listed Jobs
        </SubtitleText>
        {jobsToRender.map((job) => <ListedJobRow key={job.id} job={job} />)}
        <AddButton src={add} onClick={() => setPostJobModal(true)}/>
      </AboutContainer>
      {updateDetailsModal &&
        <EmployerDetailModal
          name={name}
          setName={setName}
          password={password}
          setPassword={setPassword}
          location={location}
          setLocation={setLocation}
          profile={profile}
          setProfile={setProfile}
          company={company}
          setCompany={setCompany}
          cancel={cancel}
          updateProfile={updateProfile}
        />
      }
      {postJobModal && <PostJobModal closeModal={() => setPostJobModal(false)} postJob={postJob}/>}
    </ProfileContainer>
  )
}