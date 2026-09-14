import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { updateCourse } from "../../services/courseService";
import { getInstructors } from "../../services/instructorService";
import type { Course } from "../../types/course";
import type { User } from "../../types/user";

type UpdateCourseProps = {
  course: Course;
  show: boolean;
  onHide: () => void;
  onUpdated: () => void;
};

function UpdateCourse({ course, show, onHide, onUpdated }: UpdateCourseProps) {
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [instructors, setInstructors] = useState<User[]>([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const response = await getInstructors();
        setInstructors(response.data);
        setSelectedInstructorId(String(course.instructorId));
      } catch (err) {
        console.error(err);
        setError("Unable to load instructors.");
      }
    };

    if (show) {
      loadInstructors();
    }
  }, [show, course.instructorId]);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (!form.checkValidity()) {
      event.stopPropagation();
      return;
    }
    setSaving(true);
    setError("");
    const values = new FormData(form);
    try {
      await updateCourse({
        courseId: course.courseId,
        courseCode: String(values.get("courseCode")),
        courseName: String(values.get("courseName")),
        description: String(values.get("description")),
        instructorId: Number(values.get("instructorId")),
      });
      onUpdated();
      onHide();
    } catch (err) {
      console.error(err);
      setError("Unable to update course.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Course</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Course Code</Form.Label>
            <Form.Control
              name="courseCode"
              required
              defaultValue={course.courseCode}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Course Name</Form.Label>
            <Form.Control
              name="courseName"
              required
              defaultValue={course.courseName}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              as="textarea"
              rows={4}
              required
              defaultValue={course.description}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Instructor</Form.Label>
            <Form.Select
              name="instructorId"
              required
              value={selectedInstructorId}
              onChange={(event) => setSelectedInstructorId(event.target.value)}
            >
              <option value="">Select an instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.firstName} {instructor.lastName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Spinner size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateCourse;
