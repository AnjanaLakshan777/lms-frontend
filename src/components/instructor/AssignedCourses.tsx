import { useEffect, useState } from "react";
import { Alert, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../../services/courseService";
import { getInstructors } from "../../services/instructorService";
import type { Course } from "../../types/course";
import type { User } from "../../types/user";

export const AssignedCourse = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAssignedCourses = async () => {
      const email = localStorage.getItem("email");

      if (!email) {
        setError("Please sign in again to view your assigned courses.");
        setLoading(false);
        return;
      }

      try {
        const [instructorsResponse, coursesResponse] = await Promise.all([
          getInstructors(),
          getCourses(),
        ]);
        const instructor = instructorsResponse.data.find(
          (user: User) => user.email.toLowerCase() === email.toLowerCase(),
        );

        if (!instructor) {
          setError("Could not find the signed-in instructor.");
          return;
        }

        setCourses(
          coursesResponse.data.filter(
            (course: Course) =>
              Number(course.instructorId) === Number(instructor.id),
          ),
        );
      } catch (loadError) {
        console.error(loadError);
        setError("Unable to load your assigned courses.");
      } finally {
        setLoading(false);
      }
    };

    loadAssignedCourses();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Assigned Courses</h2>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && courses.length === 0 && (
        <p className="text-center text-muted">
          No courses are assigned to you yet.
        </p>
      )}

      {!loading && !error && courses.length > 0 && (
        <Row className="g-4">
          {courses.map((course) => (
            <Col key={course.courseId} xs={12} sm={6} md={4} lg={3}>
              <Card
                className="assigned-course-card h-100"
                role="button"
                tabIndex={0}
                onClick={() =>
                  navigate(`/assignedCourses/${course.courseId}/modules`)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/assignedCourses/${course.courseId}/modules`);
                  }
                }}
              >
                <div className="assigned-course-art">
                  <span className="assigned-course-code">
                    {course.courseCode}
                  </span>
                </div>
                <Card.Body>
                  <Card.Title className="fs-6 mb-2">
                    {course.courseName}
                  </Card.Title>
                  {course.description && (
                    <Card.Text className="text-muted small mb-0">
                      {course.description}
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};
