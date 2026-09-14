import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { updateLesson } from "../../services/lessonService";
import { getModules } from "../../services/moduleService";
import type { Module } from "../../types/module";
import type { Lesson } from "../../types/lesson";

type UpdateLessonProps = {
  lesson: Lesson;
  show: boolean;
  onHide: () => void;
  onUpdated: () => void;
};

function UpdateLesson({ lesson, show, onHide, onUpdated }: UpdateLessonProps) {
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");

  useEffect(() => {
    const loadModules = async () => {
      try {
        const response = await getModules();
        setModules(response.data);
        setSelectedModuleId(String(lesson.moduleId));
      } catch (err) {
        console.error(err);
        setError("Unable to load modules.");
      }
    };

    if (show) {
      loadModules();
    }
  }, [show, lesson.moduleId]);

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
      await updateLesson({
        lessonId: lesson.lessonId,
        lessonCode: String(values.get("lessonCode")),
        lessonName: String(values.get("lessonName")),
        moduleId: Number(values.get("moduleId")),
        moduleCode: lesson.moduleCode,
      });
      onUpdated();
      onHide();
    } catch (err) {
      console.error(err);
      setError("Unable to update lesson.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Lesson</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Lesson Code</Form.Label>
            <Form.Control
              name="lessonCode"
              required
              defaultValue={lesson.lessonCode}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lesson Name</Form.Label>
            <Form.Control
              name="lessonName"
              required
              defaultValue={lesson.lessonName}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Module</Form.Label>
            <Form.Select
              name="moduleId"
              required
              value={selectedModuleId}
              onChange={(event) => setSelectedModuleId(event.target.value)}
            >
              <option value="">Select a module</option>
              {modules.map((module) => (
                <option key={module.moduleId} value={module.moduleId}>
                  {module.moduleCode} - {module.moduleName}
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

export default UpdateLesson;
