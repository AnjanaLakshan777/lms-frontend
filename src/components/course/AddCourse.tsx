import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/esm/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { saveCourse } from "../../services/courseService";
import { getInstructors } from "../../services/instructorService";
import type { User } from "../../types/user";

type AddCourseProps = {
  show: boolean;
  onHide: () => void;
  onSaved: () => void;
};

function AddCourse({ show, onHide, onSaved }: AddCourseProps) {
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [instructors, setInstructors] = useState<User[]>([]);

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const response = await getInstructors();
        setInstructors(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load instructors.");
      }
    };

    if (show) {
      loadInstructors();
    }
  }, [show]);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setSaving(true);
      setError("");

      const formData = new FormData(form);

      try {
        await saveCourse({
          courseCode: String(formData.get("courseCode")),
          courseName: String(formData.get("courseName")),
          description: String(formData.get("description")),
          instructorId: Number(formData.get("instructorId")),
        });

        onSaved();
        onHide();
      } catch (err) {
        console.error(err);
        setError("Unable to save course.");
      } finally {
        setSaving(false);
      }
    }
    setValidated(true);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Course</Modal.Title>
      </Modal.Header>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Course Code</Form.Label>
              <Form.Control
                name="courseCode"
                required
                type="text"
                placeholder="IN2601"
                maxLength={6}
                minLength={6}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a course code
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="12">
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                name="courseName"
                type="text"
                placeholder="Python Programming"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a course name.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="12">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                as="textarea"
                rows={4}
                placeholder="Learn the fundamentals of Python programming, including syntax, data types, functions and object-oriented programming."
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a description.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="12">
              <Form.Label>Instructor</Form.Label>
              <Form.Select name="instructorId" required>
                <option value="">Select an instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.firstName} {instructor.lastName}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select an instructor.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddCourse;
