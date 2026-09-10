import { Container } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

export const Lesson = () => {
  return (
    <>
      <Container fluid className="mt-4 px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">All Lessons</h2>
          <Button variant="primary">Add New Lesson</Button>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Lesson Code</th>
              <th style={{ width: "60%" }}>Lesson Name</th>
              <th style={{ width: "10%" }}>Module Code</th>
              <th style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>LES001</td>
              <td>Variables and Types</td>
              <td>MD001</td>
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
