import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import { deleteContent, getContents } from "../../services/contentService";
import { getLessons } from "../../services/lessonService";
import type { Content } from "../../types/content";
import type { Lesson } from "../../types/lesson";
import AddContent from "../content/AddContent";
import UpdateContent from "../content/UpdateContent";

const mimeTypes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  pdf: "application/pdf",
  mp4: "video/mp4",
};

export const AssignedLessonContents = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddContentForm, setShowAddContentForm] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showUpdateContentForm, setShowUpdateContentForm] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const loadLessonContents = async () => {
      try {
        const [lessonsResponse, contentsResponse] = await Promise.all([
          getLessons(),
          getContents(),
        ]);
        const selectedLesson = lessonsResponse.data.find(
          (item: Lesson) => Number(item.lessonId) === Number(lessonId),
        );

        if (!selectedLesson) {
          setError("The requested lesson could not be found.");
          return;
        }

        setLesson(selectedLesson);
        setContents(
          contentsResponse.data.filter(
            (content: Content) => Number(content.lessonId) === Number(lessonId),
          ),
        );
      } catch (loadError) {
        console.error(loadError);
        setError("Unable to load content for this lesson.");
      } finally {
        setLoading(false);
      }
    };

    loadLessonContents();
  }, [lessonId]);

  const reloadContents = async () => {
    const response = await getContents();
    setContents(
      response.data.filter(
        (content: Content) => Number(content.lessonId) === Number(lessonId),
      ),
    );
  };

  const confirmDeleteContent = async () => {
    if (!contentToDelete) return;

    try {
      setError("");
      await deleteContent(contentToDelete);
      await reloadContents();
      setShowDeleteConfirmation(false);
      setContentToDelete(null);
    } catch (deleteError) {
      console.error(deleteError);
      setError("Unable to delete content.");
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="mb-1">{lesson?.lessonName ?? "Lesson Content"}</h2>
          {lesson && <p className="text-muted mb-0">{lesson.lessonCode}</p>}
        </div>
        <Button onClick={() => setShowAddContentForm(true)}>Add Content</Button>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && contents.length === 0 && (
        <p className="text-center text-muted">
          No content is available for this lesson yet.
        </p>
      )}

      {!loading && !error && contents.length > 0 && (
        <Row className="g-4">
          {contents.map((content) => {
            const type = content.type.toLowerCase();
            const mimeType = type.includes("/")
              ? type
              : (mimeTypes[type] ?? "application/octet-stream");
            const fileUrl = `data:${mimeType};base64,${content.fileData}`;
            const extension = mimeType.split("/")[1] || "file";

            return (
              <Col key={content.contentId} xs={12} md={6} lg={4}>
                <Card className="h-100">
                  {mimeType.startsWith("image/") && (
                    <Card.Img
                      variant="top"
                      src={fileUrl}
                      alt={content.title}
                      style={{
                        height: 220,
                        objectFit: "contain",
                        background: "#f5f6f8",
                      }}
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Subtitle className="text-muted mb-2">
                      {content.contentCode} · {content.type}
                    </Card.Subtitle>
                    <Card.Title>{content.title}</Card.Title>
                    <div className="d-flex flex-wrap gap-2 mt-auto">
                      <a
                        className="btn btn-outline-primary"
                        href={fileUrl}
                        download={`${content.contentCode}.${extension}`}
                        target={
                          mimeType === "application/pdf" ? "_blank" : undefined
                        }
                        rel={
                          mimeType === "application/pdf"
                            ? "noreferrer"
                            : undefined
                        }
                      >
                        {mimeType === "application/pdf"
                          ? "Open / Download"
                          : "Download"}
                      </a>
                      <Button
                        variant="outline-primary"
                        onClick={() => {
                          setSelectedContent(content);
                          setShowUpdateContentForm(true);
                        }}
                      >
                        <PencilSquare className="me-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => {
                          setContentToDelete(content);
                          setShowDeleteConfirmation(true);
                        }}
                      >
                        <Trash className="me-1" />
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <AddContent
        show={showAddContentForm}
        onHide={() => setShowAddContentForm(false)}
        onSaved={reloadContents}
        defaultLessonId={lesson?.lessonId}
      />
      {selectedContent && (
        <UpdateContent
          content={selectedContent}
          show={showUpdateContentForm}
          onHide={() => {
            setShowUpdateContentForm(false);
            setSelectedContent(null);
          }}
          onUpdated={reloadContents}
        />
      )}

      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete content {contentToDelete?.contentCode}
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteContent}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
