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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/seeker" element={<Seeker />} />
        <Route path="/employer" element={<Employer />} />
        <Route path="/employerlogin" element={<EmployerLogin />} />
        <Route path="/seekerlogin" element={<SeekerLogin />} />
        <Route path="/employerhome" element={<EmployerHome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/eprofile" element={<Eprofile />} />
        <Route path="/postjob" element={<Postjob />} />
      </Routes>
    </>
  );
}

export default App;
