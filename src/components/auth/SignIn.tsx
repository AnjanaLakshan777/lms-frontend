import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const SignIn = () => {
  return (
    <div className="signin-page">
      <Card className="signin-card">
        <Card.Body>
          <Card.Title className="text-center mb-4 fw-bold fs-4">
            Sign In
          </Card.Title>

          <Form>
            <Form.Group className="mb-3 fw-bold">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3 fw-bold">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
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
