import { useEffect, useState } from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { getModules } from "../../services/moduleService";
import type { Module as ModuleType } from "../../types/module";
import AddModule from "./AddModule";

export const Module = () => {
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);

  useEffect(() => {
    const loadModules = async () => {
      try {
        const response = await getModules();
        setModules(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load modules.");
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  return (
    <Container fluid className="mt-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">All Modules</h2>

        <Button variant="primary" onClick={() => setShowAddModuleForm(true)}>
          Add New Module
        </Button>
      </div>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Module Code</th>
              <th style={{ width: "25%" }}>Module Name</th>
              <th style={{ width: "40%" }}>Description</th>
              <th style={{ width: "10%" }}>Course Code</th>
              <th style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {modules.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No modules found.
                </td>
              </tr>
            ) : (
              modules.map((module) => (
                <tr key={module.moduleId}>
                  <td>{module.moduleCode}</td>
                  <td>{module.moduleName}</td>
                  <td>{module.description}</td>
                  <td>{module.courseCode}</td>

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

      <AddModule
        show={showAddModuleForm}
        onHide={() => setShowAddModuleForm(false)}
      />
    </Container>
  );
};
