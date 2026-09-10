import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/Navbar/NavBar";
import {Home} from "./components/Home";
import {SignIn} from "./components/auth/SignIn";
import {SignUp} from "./components/auth/SignUp";
import { Student } from "./components/student/Student";
import { Instructor } from "./components/instructor/Instructor";
import { Course } from "./components/course/Course";
import { Module } from "./components/module/Module";
import { Lesson } from "./components/lesson/Lesson";
import { Content } from "./components/content/Content";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/students" element={<Student />} />
          <Route path="/instructors" element={<Instructor />} />
          <Route path="/courses" element={<Course />} />
          <Route path="/modules" element={<Module />} />
          <Route path="/lessons" element={<Lesson />} />
          <Route path="/contents" element={<Content />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
