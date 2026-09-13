import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/esm/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { getModules } from "../../services/moduleService";
import type { Module as ModuleType } from "../../types/module";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { saveLesson } from "../../services/lessonService";

type AddLessonProps = {
  show: boolean;
  onHide: () => void;
  onSaved: () => void;
};

function AddLesson({ show, onHide, onSaved }: AddLessonProps) {
  const [validated, setValidated] = useState(false);
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadModules = async () => {
      try {
        const response = await getModules();
        setModules(response.data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    if (show) {
      loadModules();
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
        await saveLesson({
          lessonCode: String(formData.get("lessonCode")),
          lessonName: String(formData.get("lessonName")),
          moduleId: Number(formData.get("moduleId")),
        });
        onSaved();
        onHide();
      } catch (err) {
        console.error(err);
        setError("Unable to save lesson.");
      } finally {
        setSaving(false);
      }
    }

    setValidated(true);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Lesson</Modal.Title>
      </Modal.Header>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom01">
              <Form.Label>Lesson Code</Form.Label>
              <Form.Control
                name="lessonCode"
                required
                type="text"
                placeholder="LES0001"
                maxLength={6}
                minLength={6}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a lesson code.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom02">
              <Form.Label>Lesson Name</Form.Label>
              <Form.Control
                name="lessonName"
                type="text"
                placeholder="Variables and Data Types"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a lesson name.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom03">
              <Form.Label>Module</Form.Label>
              <Form.Select
                name="moduleId"
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                required
              >
                <option value="">Select a module</option>
                {modules.map((module) => (
                  <option key={module.moduleId} value={module.moduleId}>
                    {module.moduleCode} - {module.moduleName}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a module.
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

export default AddLesson;
