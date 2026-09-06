import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/Navbar/NavBar";
import { Student } from "./components/Student";
import { Instructor } from "./components/Instructor";
import { Course } from "./components/course/Course";
import { Module } from "./components/Module";
import { Lesson } from "./components/Lesson";
import { Content } from "./components/Content";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
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
