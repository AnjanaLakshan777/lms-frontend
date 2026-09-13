import { useEffect, useState } from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { getCourses } from "../../services/courseService";
import type { Course as CourseType } from "../../types/course";
import AddCourse from "./AddCourse";

export const Course = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load courses.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const reloadCourses = async () => {
    const response = await getCourses();
    setCourses(response.data);
  };

  return (
    <Container fluid className="mt-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">All Courses</h2>

        <Button variant="primary" onClick={() => setShowAddCourseForm(true)}>
          Add New Course
        </Button>
      </div>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Course Code</th>
              <th style={{ width: "25%" }}>Course Name</th>
              <th style={{ width: "40%" }}>Description</th>
              <th style={{ width: "10%" }}>Instructor ID</th>
              <th style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No courses found.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.courseId}>
                  <td>{course.courseCode}</td>
                  <td>{course.courseName}</td>
                  <td>{course.description}</td>
                  <td>{course.instructorId}</td>

                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button size="sm" variant="outline-primary">
                        <PencilSquare className="me-1" />
                        Edit
                      </Button>

                      <Button size="sm" variant="outline-danger">
                        <Trash className="me-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <AddCourse
        show={showAddCourseForm}
        onHide={() => setShowAddCourseForm(false)}
        onSaved={reloadCourses}
      />
    </Container>
  );
};
