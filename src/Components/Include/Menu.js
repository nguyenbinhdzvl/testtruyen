import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navbar, Nav, Form, Button, Container, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaFire, FaCheckCircle, FaClock, FaBook, FaSearch } from "react-icons/fa";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://otruyenapi.com/v1/api/the-loai");
        setCategories(response.data?.data?.items || []);
      } catch (error) {
        console.error("Lỗi API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("keyword").trim();
    if (query) navigate(`/search?query=${query}`);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="px-3 shadow w-100">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-light">📖 OTruyen</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="text-center">
            <Nav.Link as={Link} to="/" className="nav-item"><FaHome /> Trang Chủ</Nav.Link>
            <Nav.Link as={Link} to="/trending/dang-phat-hanh" className="nav-item"><FaFire /> Đang phát hành</Nav.Link>
            <Nav.Link as={Link} to="/trending/hoan-thanh" className="nav-item"><FaCheckCircle /> Hoàn thành</Nav.Link>
            <Nav.Link as={Link} to="/trending/sap-ra-mat" className="nav-item"><FaClock /> Sắp ra mắt</Nav.Link>

            {/* Dropdown thể loại */}
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-the-loai" className="nav-item">
                <FaBook /> Thể loại
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-dark text-center" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {loading ? (
                  <Dropdown.Item disabled>Đang tải...</Dropdown.Item>
                ) : categories.length > 0 ? (
                  categories.map((category, index) => (
                    <Dropdown.Item key={index} as={Link} to={`/genre/${category.slug}`}>
                      {category.name}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item disabled>Không có thể loại</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>

        {/* Ô tìm kiếm */}
        <Form onSubmit={handleSearch} className="d-flex">
          <Form.Control type="text" name="keyword" placeholder="🔍 Tìm kiếm..." className="me-2" />
          <Button type="submit" variant="primary"><FaSearch /></Button>
        </Form>
      </Container>

      {/* CSS Bổ sung */}
      <style>
        {`
          .nav-item {
            color: white !important;
            padding: 10px 15px;
            border-radius: 5px;
            transition: all 0.3s ease;
            font-size: 16px;
          }
          .nav-item:hover {
            background-color: #007bff;
            color: white !important;
          }
          .dropdown-menu-dark {
            background-color: #343a40;
            border: none;
            min-width: 180px;
          }
          .dropdown-menu-dark .dropdown-item {
            color: white;
          }
          .dropdown-menu-dark .dropdown-item:hover {
            background-color: #007bff;
          }
        `}
      </style>
    </Navbar>
  );
};

export default Menu;
