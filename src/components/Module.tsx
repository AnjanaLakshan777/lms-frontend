import { Container } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

export const Module = () => {
  return (
    <>
      <Container fluid className="mt-4 px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 fst-italic">All Modules</h2>
          <Button variant="primary">Add New Module</Button>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Module Code</th>
              <th style={{ width: "24%" }}>Module Name</th>
              <th style={{ width: "40%" }}>Description</th>
              <th style={{ width: "10%" }}>Course ID</th>
              <th style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>MD001</td>
              <td>Object Oriented Programming</td>
              <td>Fundamental OOP knowledge for beginners</td>
              <td>CS001</td>
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
