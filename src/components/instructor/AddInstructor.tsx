import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/esm/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { saveInstructor } from "../../services/instructorService";

type AddInstructorProps = {
  show: boolean;
  onHide: () => void;
  onSaved: () => void;
};

function AddInstructor({ show, onHide, onSaved }: AddInstructorProps) {
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        await saveInstructor({
          firstName: String(formData.get("firstName")),
          lastName: String(formData.get("lastName")),
          addressLine1: String(formData.get("addressLine1")),
          addressLine2: String(formData.get("addressLine2")),
          addressLine3: String(formData.get("addressLine3")),
          city: String(formData.get("city")),
          email: String(formData.get("email")),
          phoneNumber: String(formData.get("phoneNumber")),
          password: String(formData.get("password")),
          role: "INSTRUCTOR",
        });

        onSaved();
        onHide();
      } catch (err) {
        console.error(err);
        setError("Unable to save instructor.");
      } finally {
        setSaving(false);
      }
    }
    setValidated(true);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Instructor</Modal.Title>
      </Modal.Header>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom01">
              <Form.Label>First name</Form.Label>
              <Form.Control
                name="firstName"
                required
                type="text"
                placeholder="Amal"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom02">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                name="lastName"
                required
                type="text"
                placeholder="Perera"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom03">
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control
                name="addressLine1"
                type="text"
                placeholder="No.23"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid address.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom04">
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control
                name="addressLine2"
                type="text"
                placeholder="Degasaw Lane"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid address.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom05">
              <Form.Label>Address Line 3</Form.Label>
              <Form.Control
                name="addressLine3"
                type="text"
                placeholder="Molpe"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid address.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom06">
              <Form.Label>City</Form.Label>
              <Form.Control
                name="city"
                type="text"
                placeholder="Moratuwa"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid city.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom07">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="amal.perera@example.com"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid e-mail address.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom08">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                name="phoneNumber"
                type="text"
                placeholder="0771234567"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid phone number.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom09">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Password"
                minLength={6}
                required
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

export default AddInstructor;
