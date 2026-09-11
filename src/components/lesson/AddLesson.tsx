import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/esm/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { getModules } from "../../services/moduleService";
import type { Module as ModuleType } from "../../types/module";

type AddLessonProps = {
  show: boolean;
  onHide: () => void;
};

function AddLesson({ show, onHide }: AddLessonProps) {
  const [validated, setValidated] = useState(false);
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");

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
        <Modal.Title>Add New Lesson</Modal.Title>
      </Modal.Header>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom01">
              <Form.Label>Lesson Code</Form.Label>
              <Form.Control
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
          <Button type="submit">Submit</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddLesson;
