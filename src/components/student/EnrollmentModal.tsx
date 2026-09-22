import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import {
  deleteEnrollment,
  getEnrollment,
  saveEnrollment,
} from "../../services/enrollmentService";
import type { Course } from "../../types/course";
import type { Enrollment } from "../../types/enrollment";
import type { User } from "../../types/user";

type EnrollmentModalProps = {
  show: boolean;
  student: User | null;
  courses: Course[];
  onHide: () => void;
};

const EnrollmentModal = ({
  show,
  student,
  courses,
  onHide,
}: EnrollmentModalProps) => {
  const [enrolledCourses, setEnrolledCourses] = useState<Enrollment[]>([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEnrolledCourses = async () => {
      if (!show || !student) {
        return;
      }

      try {
        setEnrollmentLoading(true);
        setError("");
        const response = await getEnrollment();
        setEnrolledCourses(
          response.data.filter(
            (enrollment: Enrollment) => enrollment.studentId === student.id,
          ),
        );
      } catch (err) {
        console.error(err);
        setError("Unable to load enrolled courses.");
      } finally {
        setEnrollmentLoading(false);
      }
    };

    loadEnrolledCourses();
  }, [show, student]);

  const handleEnroll = async () => {
    if (!student || !selectedCourseId) {
      setError("Please select a course.");
      return;
    }

    const selectedCourse = courses.find(
      (course) => String(course.courseId) === selectedCourseId,
    );

    if (!selectedCourse) {
      setError("Selected course was not found.");
      return;
    }

    try {
      setError("");
      const savedEnrollment = await saveEnrollment({
        studentId: student.id,
        courseId: selectedCourse.courseId,
      });
      setEnrolledCourses((currentEnrollments) => [
        ...currentEnrollments,
        {
          studentId: student.id,
          courseId: selectedCourse.courseId,
          courseName: selectedCourse.courseName,
          enrollId: savedEnrollment.enrollId,
          enrolledAt: new Date().toISOString(),
        },
      ]);
      setSelectedCourseId("");
      onHide();
    } catch (err) {
      console.error(err);
      if (isAxiosError(err) && err.response?.status === 409) {
        setError("This student is already enrolled in the selected course.");
      } else {
        setError("Unable to enroll student.");
      }
    }
  };

  const handleUnenroll = async (enrollment: Enrollment) => {
    try {
      setError("");
      await deleteEnrollment(enrollment);
      setEnrolledCourses((currentEnrollments) =>
        currentEnrollments.filter(
          (currentEnrollment) =>
            currentEnrollment.enrollId !== enrollment.enrollId,
        ),
      );
    } catch (err) {
      console.error(err);
      setError("Unable to unenroll student from the course.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Select a course - {student?.firstName} {student?.lastName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group as={Col} md="12">
          <Form.Label>Course</Form.Label>
          <Form.Select
            name="courseId"
            value={selectedCourseId}
            onChange={(event) => setSelectedCourseId(event.target.value)}
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseCode} - {course.courseName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Label className="mt-3">Already enrolled courses</Form.Label>
        {enrollmentLoading ? (
          <div className="text-center">
            <Spinner animation="border" size="sm" />
          </div>
        ) : enrolledCourses.length === 0 ? (
          <p className="text-muted mb-0">No enrolled courses.</p>
        ) : (
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.map((enrollment) => {
                const course = courses.find(
                  (item) => item.courseId === enrollment.courseId,
                );

                return (
                  <tr key={enrollment.enrollId}>
                    <td>{course?.courseCode ?? "-"}</td>
                    <td>{enrollment.courseName}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleUnenroll(enrollment)}
                      >
                        Unenroll
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleEnroll}>
          Enroll
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EnrollmentModal;
