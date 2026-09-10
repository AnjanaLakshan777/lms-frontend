import { useState } from "react";
import { Alert, Container, Spinner } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useEffect } from "react";
import { getInstructors } from "../../services/instructorService";
import type { User as UserType } from "../../types/user";
import AddInstructor from "./AddInstructor";

export const Instructor = () => {
  const [instructors, setInstructors] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddInstructorForm, setShowAddInstructorForm] = useState(false);

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const response = await getInstructors();
        setInstructors(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load instructors.");
      } finally {
        setLoading(false);
      }
    };

    loadInstructors();
  }, []);

  return (
    <Container fluid className="mt-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">All Instructors</h2>
        <Button variant="primary" onClick={() => setShowAddInstructorForm(true)}>
          Add New Instructor
        </Button>
      </div>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "9%" }}>Instructor ID</th>
              <th style={{ width: "15%" }}>Instructor Name</th>
              <th style={{ width: "20%" }}>Email</th>
              <th style={{ width: "10%" }}>Phone</th>
              <th style={{ width: "30%" }}>Address</th>
              <th style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No instructors found.
                </td>
              </tr>
            ) : (
              instructors.map((instructor: UserType) => (
                <tr key={instructor.id}>
                  <td>{instructor.id}</td>
                  <td>{`${instructor.firstName} ${instructor.lastName}`}</td>
                  <td>{instructor.email}</td>
                  <td>{instructor.phoneNumber}</td>
                  <td>{`${instructor.addressLine1}, ${instructor.addressLine2}, ${instructor.addressLine3}, ${instructor.city}`}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button size="sm" variant="outline-primary">
                        <PencilSquare className="me-1" />
                        Edit
                      </Button>

                      <Button size="sm" variant="outline-danger">
                        <Trash className="me-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
      <AddInstructor
        show={showAddInstructorForm}
        onHide={() => setShowAddInstructorForm(false)}
      />
    </Container>
  );
};
