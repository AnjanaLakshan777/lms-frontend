import { useEffect, useState } from "react";
import { Alert, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../../services/courseService";
import { getStudents } from "../../services/studentService";
import type { Course } from "../../types/course";
import type { Enrollment } from "../../types/enrollment";
import type { User } from "../../types/user";
import { getEnrollment } from "../../services/enrollmentService";

export const EnrolledCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEnrolledCourses = async () => {
      const email = localStorage.getItem("email");

      if (!email) {
        setError("Please sign in again to view your enrolled courses.");
        setLoading(false);
        return;
      }

      try {
        const [studentsResponse, enrollmentResponse, coursesResponse] =
          await Promise.all([getStudents(), getEnrollment(), getCourses()]);
        const student = studentsResponse.data.find(
          (user: User) => user.email.toLowerCase() === email.toLowerCase(),
        );

        if (!student) {
          setError("Could not find the signed-in student.");
          return;
        }

        const enrolledCourseIds = new Set(
          enrollmentResponse.data
            .filter(
              (enrollment: Enrollment) =>
                Number(enrollment.studentId) === Number(student.id),
            )
            .map((enrollment: Enrollment) => Number(enrollment.courseId)),
        );
        setCourses(
          coursesResponse.data.filter((course: Course) =>
            enrolledCourseIds.has(Number(course.courseId)),
          ),
        );
      } catch (loadError) {
        console.error(loadError);
        setError("Unable to load your enrolled courses.");
      } finally {
        setLoading(false);
      }
    };

    loadEnrolledCourses();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Enrolled Courses</h2>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && courses.length === 0 && (
        <p className="text-center text-muted">
          No courses are enrolled for you yet.
        </p>
      )}

      {!loading && !error && courses.length > 0 && (
        <Row className="g-4">
          {courses.map((course) => (
            <Col key={course.courseId} xs={12} sm={6} md={4} lg={3}>
              <Card
                className="enrolled-course-card h-100"
                role="button"
                tabIndex={0}
                onClick={() =>
                  navigate(`/enrolledCourses/${course.courseId}/modules`)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/enrolledCourses/${course.courseId}/modules`);
                  }
                }}
              >
                <div className="enrolled-course-art">
                  <span className="enrolled-course-code">
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
