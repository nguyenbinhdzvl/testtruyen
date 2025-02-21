import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Badge, Pagination, Spinner, Navbar } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Menu from "./Include/Menu";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [getdata, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const itemsPerPage = 25;

  const items = getdata?.data?.items || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://otruyenapi.com/v1/api/tim-kiem?keyword=${query}&page=${currentPage}`);
        setData(response.data);
      } catch (error) {
        console.error("API Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, currentPage]);

  const totalItems = getdata?.data?.params?.pagination?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-5 text-danger">
        <p>❌ Lỗi: {error}</p>
      </div>
    );

  return (
    <div>
      <Helmet>
        <title>Kết Quả Tìm Kiếm</title>
      </Helmet>

      <Navbar bg="light" expand="lg" fixed="top" className="shadow-sm">
        <Container>
          <Menu />
        </Container>
      </Navbar>

      <Container fluid className="mt-5 pt-4">
        <h4 className="mb-4 text-center">
          🔍 Kết quả tìm kiếm cho: <strong>{query}</strong>
        </h4>

        <motion.div
          className="d-flex flex-wrap justify-content-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {items.length > 0 ? (
            items.map((item, index) => (
              <motion.div
                key={item.slug || index}
                whileHover={{ scale: 1.05 }}
                className="m-1"
                style={{ width: "160px" }}
              >
                <Card className="border-0 shadow-sm">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={`https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`}
                      alt={item.name || "No Image"}
                      className="img-fluid rounded"
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                    <Badge pill bg="danger" className="position-absolute top-0 end-0 m-2">
                      {item.latest_chapter?.name || "Chưa có chương"}
                    </Badge>
                  </div>
                  <Card.Body className="p-2 text-center">
                    <Card.Title className="small text-truncate">
                      <Link to={`/comics/${item.slug}`} className="text-dark text-decoration-none">
                        {item.name || "No Title"}
                      </Link>
                    </Card.Title>
                    <Card.Text className="small text-muted">
                      🕒 {new Date(item.updatedAt).toLocaleDateString()}
                    </Card.Text>
                    <div className="mb-2">
                      {item.category?.length > 0
                        ? item.category.map((category, catIndex) => (
                            <Badge pill bg="primary" key={catIndex} className="me-1">
                              {category.name}
                            </Badge>
                          ))
                        : <Badge pill bg="secondary">Khác</Badge>}
                    </div>
                    <Button variant="primary btn-sm" as={Link} to={`/comics/${item.slug}`}>
                      Xem Chi Tiết
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-muted">Không tìm thấy truyện nào</p>
          )}
        </motion.div>

        {totalPages > 1 && (
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
        )}
      </Container>
    </div>
  );
};

export default Search;
