import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import ContactUs from "./components/Contact/ContactUs";
import Seeker from "./components/Register/Seeker";
import Employer from "./components/Register/Employer";

import EmployerLogin from "./components/Login/EmployerLogin";
import SeekerLogin from "./components/Login/SeekerLogin";
import EmployerHome from "./components/Home/EmployerHome";
import Profile from "./components/Seeker/Profile";
import Eprofile from "./components/Employer/Eprofile";
import Postjob from "./components/Employer/Postjob";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import SeekerHome from "./components/Home/SeekerHome";
import Recommended from "./components/Recommendation/Recommended";
import JobDetails from "./components/Seeker/JobDetails";
import AppliedJobs from "./components/Seeker/AppliedJobs";
import ApplyingJobs from "./components/Seeker/ApplyingJobs";
import Erecommend from "./components/Employer/Erecommend";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seeker" element={<Seeker />} />
        <Route path="/employer" element={<Employer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employerlogin" element={<EmployerLogin />} />
        <Route path="/seekerlogin" element={<SeekerLogin />} />
        <Route path="/employerhome" element={<EmployerHome />} />
        <Route path="/seekerhome" element={<SeekerHome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/eprofile" element={<Eprofile />} />
        <Route path="/postjob" element={<Postjob />} />
        <Route path="/recommended" element={<Recommended />} />
        <Route path="/erecommend" element={<Erecommend />} />
        <Route path="/jobdetails/:id" element={<JobDetails />} />
        <Route path="/appliedjobs" element={<AppliedJobs />} />
        <Route path="/applyingjobs" element={<ApplyingJobs />} />
      </Routes>
    </>
  );
}

export default App;
