import { Container } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
export const Content = () => {
  return (
    <>
      <Container fluid className="mt-4 px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 fst-italic">All Contents</h2>
          <Button variant="primary">Add New Content</Button>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Content Code</th>
              <th style={{ width: "40%" }}>Title</th>
              <th style={{ width: "10%" }}>Content Type</th>
              <th style={{ width: "10%" }}>Content</th>
              <th style={{ width: "10%" }}>Lesson Code</th>
              <th style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CNT001</td>
              <td>Java</td>
              <td>PNG</td>
              <td>111111</td>
              <td>LES001</td>
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
