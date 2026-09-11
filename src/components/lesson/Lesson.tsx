import { useEffect, useState } from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { getLessons } from "../../services/lessonService";
import type { Lesson as LessonType } from "../../types/lesson";
import AddLesson from "./AddLesson";

export const Lesson = () => {
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddLessonForm, setShowAddLessonForm] = useState(false);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const response = await getLessons();
        setLessons(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load lessons.");
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, []);

  return (
    <Container fluid className="mt-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">All Lessons</h2>

        <Button variant="primary" onClick={() => setShowAddLessonForm(true)}>
          Add New Lesson
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
              <th style={{ width: "12%" }}>Lesson Code</th>
              <th style={{ width: "53%" }}>Lesson Name</th>
              <th style={{ width: "20%" }}>Module Code</th>
              <th style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {lessons.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No lessons found.
                </td>
              </tr>
            ) : (
              lessons.map((lesson) => (
                <tr key={lesson.lessonId}>
                  <td>{lesson.lessonCode}</td>
                  <td>{lesson.lessonName}</td>
                  <td>{lesson.moduleCode}</td>

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

      <AddLesson
        show={showAddLessonForm}
        onHide={() => setShowAddLessonForm(false)}
      />
    </Container>
  );
};
