import { useState } from "react";
import { Alert, Container, Modal, Spinner } from "react-bootstrap";
import { PersonPlus, PencilSquare, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useEffect } from "react";
import { deleteStudent, getStudents } from "../../services/studentService";
import { getCourses } from "../../services/courseService";
import type { User as UserType } from "../../types/user";
import type { Course as CourseType } from "../../types/course";
import AddStudent from "./AddStudent";
import EnrollmentModal from "./EnrollmentModal";
import UpdateStudent from "./UpdateStudent";

export const Student = () => {
  const [students, setStudents] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [showUpdateStudentForm, setShowUpdateStudentForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<UserType | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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

    const loadCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load courses.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleEnrollModal = (student: UserType) => {
    setSelectedStudent(student);
    setShowEnrollmentModal(true);
  };

  const reloadStudents = async () => {
    const response = await getStudents();
    setStudents(response.data);
  };

  const handleEditStudent = (student: UserType) => {
    setSelectedStudent(student);
    setShowUpdateStudentForm(true);
  };

  const handleCloseUpdateStudent = () => {
    setShowUpdateStudentForm(false);
    setSelectedStudent(null);
  };

  const handleDeleteStudent = (student: UserType) => {
    setSelectedStudent(student);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteStudent = async () => {
    if (!selectedStudent) {
      return;
    }

    try {
      setError("");
      await deleteStudent(selectedStudent.id);
      await reloadStudents();
      setShowDeleteConfirmation(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error(err);
      setError("Unable to delete student.");
    }
  };

  const sortedStudents = [...students].sort(
    (firstStudent, secondStudent) => firstStudent.id - secondStudent.id,
  );

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
              sortedStudents.map((student: UserType) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{`${student.firstName} ${student.lastName}`}</td>
                  <td>{student.email}</td>
                  <td>{student.phoneNumber}</td>
                  <td>{`${student.addressLine1}, ${student.addressLine2}, ${student.addressLine3}, ${student.city}`}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        size="sm"
                        variant="outline-success"
                        onClick={() => handleEnrollModal(student)}
                      >
                        <PersonPlus className="me-1" />
                        Enroll
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleEditStudent(student)}
                      >
                        <PencilSquare className="me-1" />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteStudent(student)}
                      >
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
      {selectedStudent && (
        <UpdateStudent
          student={selectedStudent}
          show={showUpdateStudentForm}
          onHide={handleCloseUpdateStudent}
          onUpdated={reloadStudents}
        />
      )}

      {/* Delete student pop up screen */}
      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedStudent?.firstName}{" "}
          {selectedStudent?.lastName}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteStudent}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <EnrollmentModal
        show={showEnrollmentModal}
        student={selectedStudent}
        courses={courses}
        onHide={() => setShowEnrollmentModal(false)}
      />
    </Container>
  );
};
