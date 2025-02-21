import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, ListGroup, Badge, Pagination, Navbar } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Menu from "./Include/Menu";

const Home = () => {
  const [getdata, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 25;
  const items = getdata?.data?.items || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://otruyenapi.com/v1/api/danh-sach/truyen-moi?page=${currentPage}`);
        setData(response.data);
      } catch (error) {
        console.error("API Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const totalItems = getdata?.data?.params?.pagination?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      <Helmet>
        <title>Trang Chủ</title>
      </Helmet>

      {/* Navbar cố định trên cùng */}
      <Navbar bg="light" expand="lg" fixed="top" className="shadow-sm">
        <Container>
          <Menu />
        </Container>
      </Navbar>

      {/* Nội dung chính */}
      <Container fluid className="mt-5 pt-5">
        <Row>
          <Col md={{ span: 10, offset: 1 }} className="p-4" style={{ minHeight: "100vh" }}>
            {loading ? (
              <p className="text-center mt-5">Đang tải dữ liệu...</p>
            ) : error ? (
              <p className="text-center text-danger">Lỗi: {error}</p>
            ) : (
              <motion.div
                key={currentPage} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
              >
                <ListGroup variant="flush" className="bg-dark text-white rounded w-100">
                  <AnimatePresence>
                    {items.length > 0 ? (
                      items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((item, index) => (
                        <motion.div 
                          key={item.slug || index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.05, boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)" }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ListGroup.Item
                            className="d-flex align-items-center justify-content-between bg-dark text-white border-secondary"
                          >
                            <div className="d-flex align-items-center">
                              <img
                                src={`https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`}
                                alt={item.name || "No Image"}
                                className="rounded me-3"
                                style={{ width: "50px", height: "50px" }}
                              />
                              <div>
                                <h6 className="mb-1">
                                  <Link to={`/comics/${item.slug}`} className="text-white text-decoration-none">
                                    {item.name || "No Title"}
                                  </Link>
                                </h6>
                              </div>
                            </div>
                            <div className="text-end">
                              <Badge bg="primary" className="me-2">Chương {item.chapter || "?"}</Badge>
                              <span className="text-danger">{new Date(item.updatedAt).toLocaleString()}</span>
                            </div>
                          </ListGroup.Item>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center">Không có dữ liệu</p>
                    )}
                  </AnimatePresence>
                </ListGroup>
              </motion.div>
            )}

            {/* Pagination */}
            <motion.div 
              className="d-flex justify-content-center mt-4"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3 }}
            >
              <Pagination>
                <Pagination.Prev 
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1} 
                />
                {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                  const pageNumber = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + index;
                  return (
                    pageNumber <= totalPages && (
                      <Pagination.Item 
                        key={pageNumber} 
                        active={pageNumber === currentPage} 
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </Pagination.Item>
                    )
                  );
                })}
                <Pagination.Next 
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages} 
                />
              </Pagination>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
