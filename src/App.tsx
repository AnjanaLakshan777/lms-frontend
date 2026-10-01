import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/Navbar/NavBar";
import Home from "./components/Home";
import { SignIn } from "./components/auth/SignIn";
import { SignUp } from "./components/auth/SignUp";
import { Student } from "./components/student/Student";
import { Instructor } from "./components/instructor/Instructor";
import { Course } from "./components/course/Course";
import { Module } from "./components/module/Module";
import { Lesson } from "./components/lesson/Lesson";
import { Content } from "./components/content/Content";
import { AssignedCourse } from "./components/instructor/AssignedCourses";
import { AssignedCourseModules } from "./components/instructor/AssignedCourseModules";
import { AssignedLessonContents } from "./components/instructor/AssignedLessonContents";
import { EnrolledCourses } from "./components/student/EnrolledCourses";
import { EnrolledCourseModule } from "./components/student/EnrolledCourseModule";
import { EnrolledLessonContents } from "./components/student/EnrolledLessonContents";

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
          <Route path="/assignedCourses" element={<AssignedCourse />} />
          <Route
            path="/assignedCourses/:courseId/modules"
            element={<AssignedCourseModules />}
          />
          <Route
            path="/assignedCourses/lessons/:lessonId/contents"
            element={<AssignedLessonContents />}
          />
          <Route path="/enrolledCourses" element={<EnrolledCourses />} />
          <Route
            path="/enrolledCourses/:courseId/modules"
            element={<EnrolledCourseModule />}
          />
          <Route
            path="/enrolledCourses/lessons/:lessonId/contents"
            element={<EnrolledLessonContents />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
