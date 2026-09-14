import { useState, useEffect } from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { getContents } from "../../services/contentService";
import type { Content as ContentType } from "../../types/content";
import AddContent from "./AddContent";
import UpdateContent from "./UpdateContent";

export const Content = () => {
  const [contents, setContents] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddContentForm, setShowAddContentForm] = useState(false);
  const [showUpdateContentForm, setShowUpdateContentForm] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentType | null>(
    null,
  );

  useEffect(() => {
    const loadContents = async () => {
      try {
        const response = await getContents();
        setContents(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load contents.");
      } finally {
        setLoading(false);
      }
    };
    loadContents();
  }, []);

  const reloadContents = async () => {
    const response = await getContents();
    setContents(response.data);
  };

  const handleEditContent = (content: ContentType) => {
    setSelectedContent(content);
    setShowUpdateContentForm(true);
  };

  const closeUpdateContent = () => {
    setShowUpdateContentForm(false);
    setSelectedContent(null);
  };

  return (
    <Container fluid className="mt-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">All Contents</h2>
        <Button variant="primary" onClick={() => setShowAddContentForm(true)}>
          Add New Content
        </Button>
      </div>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Content Code</th>
              <th style={{ width: "29%" }}>Title</th>
              <th style={{ width: "10%" }}>Content Type</th>
              <th style={{ width: "10%" }}>Content</th>
              <th style={{ width: "10%" }}>Lesson Code</th>
              <th style={{ width: "11%" }}>UploadAt</th>
              <th style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contents.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  No contents available.
                </td>
              </tr>
            ) : (
              contents.map((content) => {
                const normalizeMimeType = (type: string) => {
                  const normalized = type.toLowerCase();

                  if (normalized === "jpg" || normalized === "jpeg")
                    return "image/jpeg";
                  if (normalized === "png") return "image/png";
                  if (normalized === "pdf") return "application/pdf";
                  if (normalized === "gif") return "image/gif";
                  if (normalized === "webp") return "image/webp";

                  return "application/octet-stream";
                };

                const mimeType = normalizeMimeType(content.type);
                const fileUrl = `data:${mimeType};base64,${content.fileData}`;
                const fileExtension = mimeType.split("/")[1] || "file";

                return (
                  <tr key={content.contentId}>
                    <td>{content.contentCode}</td>
                    <td>{content.title}</td>
                    <td>{content.type}</td>
                    <td>
                      <a
                        href={fileUrl}
                        download={`${content.contentCode}.${fileExtension}`}
                      >
                        <img
                          src={fileUrl}
                          alt={content.title}
                          style={{ width: "80px", height: "auto" }}
                        />
                      </a>
                    </td>
                    <td>{content.lessonCode}</td>
                    <td>
                      {new Date(content.uploadAt).toLocaleDateString("en-CA")} /{" "}
                      {new Date(content.uploadAt).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="outline-primary"
                          onClick={() => handleEditContent(content)}
                        >
                          <PencilSquare className="me-2" />
                          Edit
                        </Button>

                        <Button variant="outline-danger">
                          <Trash className="me-2" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      )}
      <AddContent
        show={showAddContentForm}
        onHide={() => setShowAddContentForm(false)}
        onSaved={reloadContents}
      />
      {selectedContent && (
        <UpdateContent
          content={selectedContent}
          show={showUpdateContentForm}
          onHide={closeUpdateContent}
          onUpdated={reloadContents}
        />
      )}
    </Container>
  );
};
