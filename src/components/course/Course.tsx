import { Container } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

export const Course = () => {
  return (
    <>
      <Container fluid className="mt-4 px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 fst-italic">All Courses</h2>
          <Button variant="primary">Add New Course</Button>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Course Code</th>
              <th style={{ width: "24%" }}>Course Name</th>
              <th style={{ width: "40%" }}>Description</th>
              <th style={{ width: "10%" }}>Instructor ID</th>
              <th style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CS001</td>
              <td>Introduction to Python</td>
              <td>Learn the basics of Python programming.</td>
              <td>INS001</td>
              <td className="d-flex justify-content-center">
                <Button variant="outline-primary" className="me-2">
                  <PencilSquare className="me-2" />
                  Edit
                </Button>
                <Button variant="outline-danger">
                  <Trash className="me-2" />
                  Delete
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </>
  );
};
