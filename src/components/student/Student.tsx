import { useState } from "react";
import { Alert, Container, Spinner } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useEffect } from "react";
import { getStudents } from "../../services/studentService";
import type { User as UserType } from "../../types/user";
import AddStudent from "./AddStudent";

export const Student = () => {
  const [students, setStudents] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await getStudents();
        setStudents(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load students.");
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const reloadStudents = async () => {
    const response = await getStudents();
    setStudents(response.data);
  };

  return (
    <Container fluid className="mt-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">All Students</h2>
        <Button variant="primary" onClick={() => setShowAddStudentForm(true)}>
          Add New Student
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
              <th style={{ width: "9%" }}>Student ID</th>
              <th style={{ width: "15%" }}>Student Name</th>
              <th style={{ width: "20%" }}>Email</th>
              <th style={{ width: "10%" }}>Phone</th>
              <th style={{ width: "30%" }}>Address</th>
              <th style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((student: UserType) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{`${student.firstName} ${student.lastName}`}</td>
                  <td>{student.email}</td>
                  <td>{student.phoneNumber}</td>
                  <td>{`${student.addressLine1}, ${student.addressLine2}, ${student.addressLine3}, ${student.city}`}</td>
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
      <AddStudent
        show={showAddStudentForm}
        onHide={() => setShowAddStudentForm(false)}
        onSaved={reloadStudents}
      />
    </Container>
  );
};
