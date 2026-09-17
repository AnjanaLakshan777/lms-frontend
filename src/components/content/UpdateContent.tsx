import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { updateContent } from "../../services/contentService";
import { getLessons } from "../../services/lessonService";
import type { Lesson } from "../../types/lesson";
import type { Content } from "../../types/content";

type UpdateContentProps = {
  content: Content;
  show: boolean;
  onHide: () => void;
  onUpdated: () => void;
};

function UpdateContent({
  content,
  show,
  onHide,
  onUpdated,
}: UpdateContentProps) {
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState("");

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const response = await getLessons();
        setLessons(response.data);
        setSelectedLessonId(String(content.lessonId));
      } catch (err) {
        console.error(err);
        setError("Unable to load lessons.");
      }
    };

    if (show) {
      loadLessons();
    }
  }, [show, content.lessonId]);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (!form.checkValidity()) {
      event.stopPropagation();
      return;
    }
    const values = new FormData(form);
    const fileData = values.get("fileData");
    if (!(fileData instanceof File) || fileData.size === 0) {
      setError("Please select a new file.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await updateContent(
        {
          contentCode: String(values.get("contentCode")),
          title: String(values.get("title")),
          type: String(values.get("type")),
          lessonId: Number(values.get("lessonId")),
          contentId: content.contentId,
          fileData: content.fileData,
          uploadAt: content.uploadAt,
          lessonCode: content.lessonCode,
        },
        fileData,
      );
      onUpdated();
      onHide();
    } catch (err) {
      console.error(err);
      setError("Unable to update content.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Content</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Content Code</Form.Label>
            <Form.Control
              name="contentCode"
              required
              defaultValue={content.contentCode}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content Title</Form.Label>
            <Form.Control name="title" required defaultValue={content.title} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Control name="type" required defaultValue={content.type} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New File</Form.Label>
            <Form.Control name="fileData" type="file" required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Lesson</Form.Label>
            <Form.Select
              name="lessonId"
              required
              value={selectedLessonId}
              onChange={(event) => setSelectedLessonId(event.target.value)}
            >
              <option value="">Select a lesson</option>
              {lessons.map((lesson) => (
                <option key={lesson.lessonId} value={lesson.lessonId}>
                  {lesson.lessonCode} - {lesson.lessonName}
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

export default UpdateContent;
