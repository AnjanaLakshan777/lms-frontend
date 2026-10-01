import { useEffect, useState } from "react";
import { Alert, Container, ListGroup, Spinner } from "react-bootstrap";
import { ChevronDown, ChevronRight } from "react-bootstrap-icons";
import { Link, useParams } from "react-router-dom";
import { getCourses } from "../../services/courseService";
import { getLessons } from "../../services/lessonService";
import { getModules } from "../../services/moduleService";
import type { Course } from "../../types/course";
import type { Lesson } from "../../types/lesson";
import type { Module } from "../../types/module";

export const EnrolledCourseModule = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourseModules = async () => {
      try {
        const [coursesResponse, modulesResponse, lessonsResponse] =
          await Promise.all([getCourses(), getModules(), getLessons()]);
        const selectedCourse = coursesResponse.data.find(
          (item: Course) => Number(item.courseId) === Number(courseId),
        );

        if (!selectedCourse) {
          setError("The requested course could not be found.");
          return;
        }

        setCourse(selectedCourse);
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

    loadCourseModules();
  }, [courseId]);

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h2 className="mb-1">{course?.courseName ?? "Course Modules"}</h2>
        {course && <p className="text-muted mb-0">{course.courseCode}</p>}
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && modules.length === 0 && (
        <p className="text-center text-muted">
          No modules are available for this course yet.
        </p>
      )}

      {!loading && !error && modules.length > 0 && (
        <div className="assigned-module-list">
          {modules.map((module) => {
            const isExpanded = expandedModuleId === module.moduleId;
            const moduleLessons = lessons.filter(
              (lesson) => Number(lesson.moduleId) === Number(module.moduleId),
            );

            return (
              <section className="assigned-module" key={module.moduleId}>
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

                {isExpanded && (
                  <div className="assigned-module-details">
                    {module.description && <p>{module.description}</p>}
                    <h3 className="fs-6 mb-2">Lessons</h3>
                    {moduleLessons.length > 0 ? (
                      <ListGroup variant="flush">
                        {moduleLessons.map((lesson) => (
                          <ListGroup.Item key={lesson.lessonId}>
                            <strong>{lesson.lessonCode}</strong> -{" "}
                            <Link
                              to={`/enrolledCourses/lessons/${lesson.lessonId}/contents`}
                              className="text-decoration-none"
                            >
                              {lesson.lessonName}
                            </Link>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <p className="text-muted mb-0">
                        No lessons are available for this module yet.
                      </p>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </Container>
  );
};
