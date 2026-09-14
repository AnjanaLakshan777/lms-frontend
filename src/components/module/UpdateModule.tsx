import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { updateModule } from "../../services/moduleService";
import { getCourses } from "../../services/courseService";
import type { Course } from "../../types/course";
import type { Module } from "../../types/module";

type UpdateModuleProps = {
  module: Module;
  show: boolean;
  onHide: () => void;
  onUpdated: () => void;
};

function UpdateModule({ module, show, onHide, onUpdated }: UpdateModuleProps) {
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
        setSelectedCourseId(String(module.courseId));
      } catch (err) {
        console.error(err);
        setError("Unable to load courses.");
      }
    };

    if (show) {
      loadCourses();
    }
  }, [show, module.courseId]);

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
      await updateModule({
        moduleId: module.moduleId,
        moduleCode: String(values.get("moduleCode")),
        moduleName: String(values.get("moduleName")),
        description: String(values.get("description")),
        courseId: Number(values.get("courseId")),
        courseCode: module.courseCode,
      });
      onUpdated();
      onHide();
    } catch (err) {
      console.error(err);
      setError("Unable to update module.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Module</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Module Code</Form.Label>
            <Form.Control
              name="moduleCode"
              required
              defaultValue={module.moduleCode}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Module Name</Form.Label>
            <Form.Control
              name="moduleName"
              required
              defaultValue={module.moduleName}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              as="textarea"
              rows={4}
              required
              defaultValue={module.description}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Course</Form.Label>
            <Form.Select
              name="courseId"
              required
              value={selectedCourseId}
              onChange={(event) => setSelectedCourseId(event.target.value)}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseCode} - {course.courseName}
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

export default UpdateModule;
