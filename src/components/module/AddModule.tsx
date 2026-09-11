import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/esm/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { getCourses } from "../../services/courseService";
import type { Course as CourseType } from "../../types/course";

type AddModuleProps = {
  show: boolean;
  onHide: () => void;
};

function AddModule({ show, onHide }: AddModuleProps) {
  const [validated, setValidated] = useState(false);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    if (show) {
      loadCourses();
    }
  }, [show]);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      // Handle form submission logic here
      onHide(); // Close the form after successful submission
    }
    setValidated(true);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Module</Modal.Title>
      </Modal.Header>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom01">
              <Form.Label>Module Code</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="MD0001"
                maxLength={6}
                minLength={6}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a module code
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom02">
              <Form.Label>Module Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Function and OOP"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a module name.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom03">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="This module covers the fundamentals of functions and object-oriented programming."
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a description.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom04">
              <Form.Label>Course</Form.Label>
              <Form.Select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a course.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddModule;
