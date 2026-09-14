import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { updateInstructor } from "../../services/instructorService";
import type { User } from "../../types/user";

type UpdateInstructorProps = {
  instructor: User;
  show: boolean;
  onHide: () => void;
  onUpdated: () => void;
};

function UpdateInstructor({
  instructor,
  show,
  onHide,
  onUpdated,
}: UpdateInstructorProps) {
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
    const formData = new FormData(form);
    try {
      await updateInstructor({
        ...instructor,
        firstName: String(formData.get("firstName")),
        lastName: String(formData.get("lastName")),
        addressLine1: String(formData.get("addressLine1")),
        addressLine2: String(formData.get("addressLine2")),
        addressLine3: String(formData.get("addressLine3")),
        city: String(formData.get("city")),
        email: String(formData.get("email")),
        phoneNumber: String(formData.get("phoneNumber")),
        password: String(formData.get("password")),
      });
      onUpdated();
      onHide();
    } catch (err) {
      console.error(err);
      setError("Unable to update instructor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Instructor</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>First name</Form.Label>
              <Form.Control
                name="firstName"
                required
                defaultValue={instructor.firstName}
              />
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                name="lastName"
                required
                defaultValue={instructor.lastName}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control
                name="addressLine1"
                required
                defaultValue={instructor.addressLine1}
              />
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control
                name="addressLine2"
                required
                defaultValue={instructor.addressLine2}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Address Line 3</Form.Label>
              <Form.Control
                name="addressLine3"
                defaultValue={instructor.addressLine3}
              />
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>City</Form.Label>
              <Form.Control
                name="city"
                required
                defaultValue={instructor.city}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                name="email"
                type="email"
                required
                defaultValue={instructor.email}
              />
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                name="phoneNumber"
                required
                defaultValue={instructor.phoneNumber}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Password"
                minLength={6}
                required
                defaultValue={instructor.password}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a password with at least 6 characters.
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

export default UpdateInstructor;
