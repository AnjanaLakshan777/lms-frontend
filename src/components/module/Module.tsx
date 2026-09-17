import { useEffect, useState } from "react";
import { Container, Alert, Modal, Spinner } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { deleteModule, getModules } from "../../services/moduleService";
import type { Module as ModuleType } from "../../types/module";
import AddModule from "./AddModule";
import UpdateModule from "./UpdateModule";

export const Module = () => {
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [showUpdateModuleForm, setShowUpdateModuleForm] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<ModuleType | null>(null);

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

  const reloadModules = async () => {
    const response = await getModules();
    setModules(response.data);
  };

  const handleEditModule = (module: ModuleType) => {
    setSelectedModule(module);
    setShowUpdateModuleForm(true);
  };

  const closeUpdateModule = () => {
    setShowUpdateModuleForm(false);
    setSelectedModule(null);
  };

  const handleDeleteModule = (module: ModuleType) => {
    setModuleToDelete(module);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteModule = async () => {
    if (!moduleToDelete) return;

    try {
      setError("");
      await deleteModule(moduleToDelete);
      await reloadModules();
      setShowDeleteConfirmation(false);
      setModuleToDelete(null);
    } catch (err) {
      console.error(err);
      setError("Unable to delete module.");
    }
  };

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
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleEditModule(module)}
                      >
                        <PencilSquare className="me-1" />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteModule(module)}
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

      <AddModule
        show={showAddModuleForm}
        onHide={() => setShowAddModuleForm(false)}
        onSaved={reloadModules}
      />
      {selectedModule && (
        <UpdateModule
          module={selectedModule}
          show={showUpdateModuleForm}
          onHide={closeUpdateModule}
          onUpdated={reloadModules}
        />
      )}

      {/* Delete module pop up screen */}
      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete module {moduleToDelete?.moduleCode}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteModule}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
