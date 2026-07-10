import { Container } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

export const Instructor = () => {
  return (
    <>
      <Container fluid className="mt-4 px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 fst-italic">All Instructors</h2>
          <Button variant="primary">Add New Instructor</Button>
        </div>

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
            <tr>
              <td>INS001</td>
              <td>Anjana Lakshan</td>
              <td>anjana@gmail.com</td>
              <td>0711111111</td>
              <td>123 Main St, Colombo</td>
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
