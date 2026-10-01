import { useEffect, useState } from "react";
import { Alert, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getContents } from "../../services/contentService";
import { getLessons } from "../../services/lessonService";
import type { Content } from "../../types/content";
import type { Lesson } from "../../types/lesson";

const mimeTypes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  pdf: "application/pdf",
  mp4: "video/mp4",
};

export const EnrolledLessonContents = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="mb-1">{lesson?.lessonName ?? "Lesson Content"}</h2>
          {lesson && <p className="text-muted mb-0">{lesson.lessonCode}</p>}
        </div>
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
                  {mimeType === "application/pdf" && (
                    <object
                      data={fileUrl}
                      type={mimeType}
                      aria-label={content.title}
                      style={{ height: 260, width: "100%" }}
                    />
                  )}
                  {mimeType.startsWith("video/") && (
                    <video
                      className="w-100"
                      controls
                      preload="metadata"
                      src={fileUrl}
                      style={{ maxHeight: 260, background: "#111" }}
                    />
                  )}
                  {mimeType.startsWith("audio/") && (
                    <div className="p-3">
                      <audio className="w-100" controls src={fileUrl} />
                    </div>
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Subtitle className="text-muted mb-2">
                      {content.contentCode} · {content.type}
                    </Card.Subtitle>
                    <Card.Title>{content.title}</Card.Title>
                    <a
                      className="btn btn-outline-primary mt-auto align-self-start"
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
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};
