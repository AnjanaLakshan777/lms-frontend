import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import api from "../../services/axios";

export const SignIn = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await api.post("/auth/login", form);
      const { token, role, email } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);
      window.dispatchEvent(new Event("authStateChanged"));

      if (role === "ADMIN") {
        navigate("/students");
      } else if (role === "INSTRUCTOR") {
        navigate("/assignedCourses");
      } else {
        navigate("/enrolledCourses");
      }
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="signin-page">
      <Card className="signin-card">
        <Card.Body>
          <Card.Title className="text-center mb-4 fw-bold fs-4">
            Sign In
          </Card.Title>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 fw-bold">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3 fw-bold">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Text className="d-block text-end mb-3 fw-bold">
              <a href="/forgot-password" className="text-decoration-none">
                Forgot Password?
              </a>
            </Form.Text>

            <Button className="w-100 mt-2" variant="primary" type="submit">
              Sign In
            </Button>

            <Form.Text className="d-block text-center mt-3 mb-0">
              Don't have an account?{" "}
              <a href="/signup" className="text-decoration-none fw-bold">
                Sign Up
              </a>
            </Form.Text>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
