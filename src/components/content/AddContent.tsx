import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/esm/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { getLessons } from "../../services/lessonService";
import type { Lesson as LessonType } from "../../types/lesson";

type AddContentProps = {
  show: boolean;
  onHide: () => void;
};

function AddContent({ show, onHide }: AddContentProps) {
  const [validated, setValidated] = useState(false);
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState("");

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const response = await getLessons();
        setLessons(response.data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    if (show) {
      loadLessons();
    }
  }, [show]);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      onHide();
    }

    setValidated(true);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Content</Modal.Title>
      </Modal.Header>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom01">
              <Form.Label>Content Code</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="CNT001"
                maxLength={6}
                minLength={6}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a content code.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom02">
              <Form.Label>Content Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Class and Object image"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a content title.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustom03">
              <Form.Label>Type</Form.Label>
              <Form.Control type="text" placeholder="JPG" />
              <Form.Control.Feedback type="invalid">
                Please provide a content type.
              </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="8" controlId="validationCustom04">
              <Form.Label>File</Form.Label>
              <Form.Control type="file" />
              </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom04">
              <Form.Label>Lesson</Form.Label>
              <Form.Select
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
                required
              >
                <option value="">Select a lesson</option>
                {lessons.map((lesson) => (
                  <option key={lesson.lessonId} value={lesson.lessonId}>
                    {lesson.lessonCode} - {lesson.lessonName}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a lesson.
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

export default AddContent;
