import { useEffect, useState } from "react";
import {
  Alert,
  Container,
  Spinner,
  Button,
  Modal,
  ListGroup,
} from "react-bootstrap";
import {
  ChevronDown,
  ChevronRight,
  PencilSquare,
  Trash,
} from "react-bootstrap-icons";
import { Link, useParams } from "react-router-dom";
import { getModules, deleteModule } from "../../services/moduleService";
import { deleteLesson, getLessons } from "../../services/lessonService";
import type { Module } from "../../types/module";
import type { Lesson } from "../../types/lesson";
import AddModule from "../module/AddModule";
import UpdateModule from "../module/UpdateModule";
import type { Module as ModuleType } from "../../types/module";
import AddLesson from "../lesson/AddLesson";
import UpdateLesson from "../lesson/UpdateLesson";

export const AssignedCourseModules = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [showUpdateModuleForm, setShowUpdateModuleForm] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<ModuleType | null>(null);
  const [showAddLessonForm, setShowAddLessonForm] = useState(false);
  const [defaultLessonModuleId, setDefaultLessonModuleId] = useState<number>();
  const [showUpdateLessonForm, setShowUpdateLessonForm] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showDeleteLessonConfirmation, setShowDeleteLessonConfirmation] =
    useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

  useEffect(() => {
    const loadModules = async () => {
      try {
        const [modulesResponse, lessonsResponse] = await Promise.all([
          getModules(),
          getLessons(),
        ]);
        setModules(
          modulesResponse.data.filter(
            (module: Module) => Number(module.courseId) === Number(courseId),
          ),
        );
        setLessons(lessonsResponse.data);
      } catch (loadError) {
        console.error(loadError);
        setError("Unable to load modules for this course.");
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [courseId]);

  const reloadModules = async () => {
    const [modulesResponse, lessonsResponse] = await Promise.all([
      getModules(),
      getLessons(),
    ]);
    setModules(
      modulesResponse.data.filter(
        (module: Module) => Number(module.courseId) === Number(courseId),
      ),
    );
    setLessons(lessonsResponse.data);
  };

  const reloadLessons = async () => {
    const response = await getLessons();
    setLessons(response.data);
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

  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowUpdateLessonForm(true);
  };

  const handleDeleteLesson = (lesson: Lesson) => {
    setLessonToDelete(lesson);
    setShowDeleteLessonConfirmation(true);
  };

  const confirmDeleteLesson = async () => {
    if (!lessonToDelete) return;

    try {
      setError("");
      await deleteLesson(lessonToDelete);
      await reloadLessons();
      setShowDeleteLessonConfirmation(false);
      setLessonToDelete(null);
    } catch (err) {
      console.error(err);
      setError("Unable to delete lesson.");
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-4 text-center">Course Modules</h2>

        <Button variant="primary" onClick={() => setShowAddModuleForm(true)}>
          Add New Module
        </Button>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && modules.length === 0 && (
        <p className="text-center text-muted">
          No modules are available for this course.
        </p>
      )}

      {!loading && !error && modules.length > 0 && (
        <div className="assigned-module-list">
          {modules.map((module) => {
            const isExpanded = expandedModuleId === module.moduleId;

            return (
              <section className="assigned-module" key={module.moduleId}>
                <div className="assigned-module-header">
                  <button
                    className="assigned-module-toggle"
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpandedModuleId(isExpanded ? null : module.moduleId)
                    }
                  >
                    <span className="assigned-module-chevron">
                      {isExpanded ? <ChevronDown /> : <ChevronRight />}
                    </span>
                    <span>
                      {module.moduleCode} - {module.moduleName}
                    </span>
                  </button>

                  <div className="d-flex gap-2 ms-auto me-2">
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
                </div>
                {isExpanded && (
                  <div className="assigned-module-details">
                    {module.description && <p>{module.description}</p>}
                    <div className="d-flex align-items-center justify-content-between mt-3 mb-2">
                      <h3 className="fs-6 mb-0">Lessons</h3>
                      <Button
                        size="sm"
                        onClick={() => {
                          setDefaultLessonModuleId(module.moduleId);
                          setShowAddLessonForm(true);
                        }}
                      >
                        Add New Lesson
                      </Button>
                    </div>
                    {lessons.filter(
                      (lesson) =>
                        Number(lesson.moduleId) === Number(module.moduleId),
                    ).length > 0 ? (
                      <ListGroup variant="flush">
                        {lessons
                          .filter(
                            (lesson) =>
                              Number(lesson.moduleId) ===
                              Number(module.moduleId),
                          )
                          .map((lesson) => (
                            <ListGroup.Item
                              className="d-flex align-items-center gap-3"
                              key={lesson.lessonId}
                            >
                              <span>
                                <strong>{lesson.lessonCode}</strong> -{" "}
                                <Link
                                  to={`/assignedCourses/lessons/${lesson.lessonId}/contents`}
                                  className="text-decoration-none"
                                >
                                  {lesson.lessonName}
                                </Link>
                              </span>
                              <div className="d-flex gap-2 ms-auto">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => handleEditLesson(lesson)}
                                >
                                  <PencilSquare className="me-1" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleDeleteLesson(lesson)}
                                >
                                  <Trash className="me-1" />
                                </Button>
                              </div>
                            </ListGroup.Item>
                          ))}
                      </ListGroup>
                    ) : (
                      <p className="text-muted mb-0">
                        No lessons are available for this module.
                      </p>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
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

      <AddLesson
        show={showAddLessonForm}
        onHide={() => setShowAddLessonForm(false)}
        onSaved={reloadLessons}
        defaultModuleId={defaultLessonModuleId}
      />
      {selectedLesson && (
        <UpdateLesson
          lesson={selectedLesson}
          show={showUpdateLessonForm}
          onHide={() => {
            setShowUpdateLessonForm(false);
            setSelectedLesson(null);
          }}
          onUpdated={reloadLessons}
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
      <Modal
        show={showDeleteLessonConfirmation}
        onHide={() => setShowDeleteLessonConfirmation(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete lesson {lessonToDelete?.lessonCode}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteLessonConfirmation(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteLesson}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
