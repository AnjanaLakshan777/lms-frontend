import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/esm/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { getLessons } from "../../services/lessonService";
import type { Lesson as LessonType } from "../../types/lesson";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { saveContent } from "../../services/contentService";

type AddContentProps = {
  show: boolean;
  onHide: () => void;
  onSaved: () => void;
};

function AddContent({ show, onHide, onSaved }: AddContentProps) {
  const [validated, setValidated] = useState(false);
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const formData = new FormData(form);
      const fileData = formData.get("fileData");

      if (!(fileData instanceof File) || fileData.size === 0) {
        setError("Please select a file.");
        setValidated(true);
        return;
      }

      setSaving(true);
      setError("");

      try {
        await saveContent({
          contentCode: String(formData.get("contentCode")),
          title: String(formData.get("title")),
          type: String(formData.get("type")),
          lessonId: Number(formData.get("lessonId")),
          fileData,
        });
        onSaved();
        onHide();
      } catch (err) {
        console.error(err);
        setError("Unable to save content.");
      } finally {
        setSaving(false);
      }
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
          {error && <Alert variant="danger">{error}</Alert>}
          <Row className="mb-3">
            <Form.Group as={Col} md="12">
              <Form.Label>Content Code</Form.Label>
              <Form.Control
                name="contentCode"
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
            <Form.Group as={Col} md="12">
              <Form.Label>Content Title</Form.Label>
              <Form.Control
                name="title"
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
            <Form.Group as={Col} md="4">
              <Form.Label>Type</Form.Label>
              <Form.Control
                name="type"
                type="text"
                placeholder="JPG"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a content type.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="8">
              <Form.Label>File</Form.Label>
              <Form.Control name="fileData" type="file" required />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="12">
              <Form.Label>Lesson</Form.Label>
              <Form.Select
                name="lessonId"
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

export default AddContent;
