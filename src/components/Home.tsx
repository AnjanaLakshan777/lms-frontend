import Carousel from "react-bootstrap/Carousel";
import slide1 from "../assets/carouselImages/slide1.jpg";
import slide2 from "../assets/carouselImages/slide2.jpg";
import slide3 from "../assets/carouselImages/slide3.jpg";
import slide4 from "../assets/carouselImages/slide4.jpg";
import slide5 from "../assets/carouselImages/slide5.jpg";

function Home() {
  return (
    <Carousel>
      <Carousel.Item interval={2000}>
        <img
          src={slide1}
          alt="slide 1"
          style={{
            width: "100%",
            height: "90.9vh",
            objectFit: "cover",
            display: "block",
          }}
        />
        <Carousel.Caption>
          <h3>Welcome to Our Learning Platform</h3>
          <p>Discover courses, lessons, and resources that help you succeed.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={2000}>
        <img
          src={slide2}
          alt="slide 2"
          style={{
            width: "100%",
            height: "90.9vh",
            objectFit: "cover",
            display: "block",
          }}
        />
        <Carousel.Caption>
          <h3>Learn with Confidence</h3>
          <p>Explore practical lessons designed to build real-world skills.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={2000}>
        <img
          src={slide3}
          alt="slide 3"
          style={{
            width: "100%",
            height: "90.9vh",
            objectFit: "cover",
            display: "block",
          }}
        />
        <Carousel.Caption>
          <h3>Grow Your Knowledge</h3>
          <p>
            Access expert-led content that keeps you motivated and moving
            forward.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={2000}>
        <img
          src={slide4}
          alt="slide 4"
          style={{
            width: "100%",
            height: "90.9vh",
            objectFit: "cover",
            display: "block",
          }}
        />
        <Carousel.Caption>
          <h3>Flexible Learning, Better Results</h3>
          <p>
            Study at your own pace and unlock new opportunities for your future.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={2000}>
        <img
          src={slide5}
          alt="slide 5"
          style={{
            width: "100%",
            height: "90.9vh",
            objectFit: "cover",
            display: "block",
          }}
        />
        <Carousel.Caption>
          <h3>Empower Your Future</h3>
          <p>
            Build skills that matter with engaging courses and expert guidance.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Home;
