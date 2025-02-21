import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Row, Col, Badge, ListGroup, Modal, Button, Navbar } from "react-bootstrap";
import { motion } from "framer-motion";
import Menu from "./Include/Menu";

const DetailPage = () => {
  const { slug } = useParams();
  const [getdata, setData] = useState(null);
  const [getDataChapter, setDataChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`);
        setData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong: {error}</p>;

  const item = getdata?.data?.item;
  if (!item) return <p>No data available</p>;

  const handleClose = () => setIsModalOpen(false);

  const fetchChapterData = async (chapter_api, index) => {
    try {
      const response = await axios.get(chapter_api);
      setDataChapter(response.data);
      setCurrentChapterIndex(index);
      setIsModalOpen(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {/* Navbar cố định trên cùng */}
      <Navbar bg="light" expand="lg" fixed="top" className="shadow-sm">
        <Container>
          <Menu />
        </Container>
      </Navbar>

      <Container className="mt-5 pt-4">
        <Row className="g-4">
          <Col md={4}>
            <Card className="shadow p-3 h-100 d-flex flex-column">
              <Card.Img
                src={item?.thumb_url ? `https://img.otruyenapi.com/uploads/comics/${item.thumb_url}` : "default_image.jpg"}
                alt={item?.name || "Unknown"}
                className="rounded mb-3"
                style={{ width: "100%", height: "350px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title className="fw-bold text-primary fs-4">{item?.name || "Không có tên"}</Card.Title>
                <Card.Text className="text-muted">
                  <strong>Updated at:</strong> {item?.updatedAt ? new Date(item.updatedAt).toLocaleString() : "N/A"}
                </Card.Text>
                <Card.Text>
                  <strong>Thể loại: </strong>
                  {item?.category?.length > 0 ? (
                    item.category.map((category, index) => (
                      <Badge pill bg="info" className="me-1" key={index}>{category.name}</Badge>
                    ))
                  ) : (
                    <Badge pill bg="secondary">Chưa cập nhật</Badge>
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Card className="shadow p-3 h-100">
              <Card.Title className="fw-bold">Danh Sách Chương</Card.Title>
              <ListGroup className="overflow-auto" style={{ maxHeight: "500px" }}>
                {item?.chapters?.length > 0 ? (
                  item.chapters.map((chapter, index) => (
                    <ListGroup.Item key={index}>
                      <strong>{chapter.server_name}</strong>
                      {chapter.server_data.map((listchapter, subIndex) => (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="chapter_click p-2 border rounded bg-light text-primary fw-bold"
                          key={subIndex}
                          onClick={() => fetchChapterData(listchapter.chapter_api_data, index)}
                          style={{ cursor: "pointer" }}
                        >
                          Chapter: {listchapter.chapter_name}
                        </motion.div>
                      ))}
                    </ListGroup.Item>
                  ))
                ) : (
                  <p>Chưa có chương nào</p>
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>

        {/* Modal Đọc Truyện */}
        <Modal show={isModalOpen} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {getDataChapter?.data?.item?.chapter_name || "Không có dữ liệu"} - {getDataChapter?.data?.item?.comic_name || ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            {getDataChapter?.data?.item?.chapter_image?.map((chapterImage, index) => (
              <motion.img
                key={index}
                src={`${getDataChapter.data.domain_cdn}/${getDataChapter.data.item.chapter_path}/${chapterImage.image_file}`}
                className="img-fluid mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%" }}
              />
            ))}
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button variant="danger" onClick={handleClose}>Đóng</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default DetailPage;
