import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Badge, Pagination, Navbar } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Menu from "./Include/Menu";

const Trending = () => {
  const { slug } = useParams();
  const [getdata, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const items = getdata?.data?.items || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://otruyenapi.com/v1/api/danh-sach/${slug}?page=${currentPage}`);
        setData(response.data);
      } catch (error) {
        console.error("API Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, currentPage]);

  const totalItems = getdata?.data?.params?.pagination?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-center text-danger">Lỗi: {error}</p>;

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

      <Container fluid className="mt-5 pt-4">
        <motion.div
          className="d-flex flex-wrap justify-content-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {items.length > 0 ? (
            items
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .map((item, index) => (
                <motion.div
                  key={item.slug || index}
                  whileHover={{ scale: 1.05 }}
                  className="m-1"
                  style={{ width: "160px" }}
                >
                  <Card className="border-0 shadow-sm">
                    <Card.Img
                      variant="top"
                      src={`https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`}
                      alt={item.name || "No Image"}
                      className="img-fluid rounded"
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                    <Card.Body className="p-2 text-center">
                      <Card.Title className="small text-truncate">{item.name || "No Title"}</Card.Title>
                      <Card.Text className="small text-muted">{new Date(item.updatedAt).toLocaleDateString()}</Card.Text>
                      <Link to={`/comics/${item.slug}`} className="btn btn-sm btn-primary">
                        Chi Tiết
                      </Link>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))
          ) : (
            <p className="text-center">Không có dữ liệu</p>
          )}
        </motion.div>

        {/* Phân trang */}
        <motion.div 
          className="d-flex justify-content-center mt-4" 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }}
        >
          <Pagination>
            <Pagination.Prev onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} />
            {Array.from({ length: Math.min(7, totalPages) }, (_, index) => {
              const pageNumber = Math.max(1, Math.min(currentPage - 3, totalPages - 6)) + index;
              return (
                pageNumber <= totalPages && (
                  <Pagination.Item key={pageNumber} active={pageNumber === currentPage} onClick={() => handlePageChange(pageNumber)}>
                    {pageNumber}
                  </Pagination.Item>
                )
              );
            })}
            <Pagination.Next onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} />
          </Pagination>
        </motion.div>
      </Container>
    </div>
  );
};

export default Trending;
