import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  InputGroup,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getInitialData, importDataWithNewIndex } from "../../actions";
import "./style.css";
import axios from "../../helpers/axios";

function Home(props) {
  const [showImportNewDataModal, setShowImportNewDataModal] = useState(false);
  const [showDeleteIndexModal, setShowDeleteIndexModal] = useState(false);
  const [showImportDataForIndexModal, setShowImportDataForIndexModal] =
    useState(false);
  const [indexData, setIndexData] = useState({
    name: "",
    file: null,
    error: "",
    isSubmitting: false,
  });

  const dispatch = useDispatch();
  const { indexes } = useSelector((state) => state.init);

  const handleSubmit = (event) => {
    event.preventDefault();

    const indexNameList = indexes.map((i) => i.index);
    console.log(indexNameList.includes(indexData.name));
    if (indexNameList.includes(indexData.name)) {
      setIndexData({
        ...indexData,
        error: "Please input a unique index name",
      });
      return;
    }

    setIndexData({
      ...indexData,
      error: "",
      isSubmitting: true,
    });

    const formData = new FormData();
    formData.append("index", indexData.name);
    formData.append("dataFile", indexData.file);

    axios
      .post("/bulk/data", formData)
      .then(() => {
        dispatch(getInitialData());
      })
      .finally(() => {
        setIndexData({
          ...indexData,
          namne: "",
          isSubmitting: false,
        });
        setShowImportNewDataModal(false);
      });
  };

  const handleShowDeleteIndexModal = (index) => {
    setIndexData({
      ...indexData,
      name: index,
    });
    setShowDeleteIndexModal(true);
  };

  const handleDeleteIndex = async (index) => {
    setIndexData({
      ...indexData,
      isDeleting: true,
    });
    setShowDeleteIndexModal(true);
    await axios.delete(`/delete/${index}`);
    dispatch(getInitialData());
    setIndexData({
      ...indexData,
      namne: "",
      isDeleting: false,
    });
    setShowDeleteIndexModal(false);
  };

  const handleShowImportIndexModal = (index) => {
    setIndexData({
      ...indexData,
      name: index,
    });
    setShowImportDataForIndexModal(true);
  };

  const handleImportDataForIndex = (event) => {
    event.preventDefault();

    setIndexData({
      ...indexData,
      error: "",
      isSubmitting: true,
    });

    const formData = new FormData();
    formData.append("index", indexData.name);
    formData.append("dataFile", indexData.file);

    axios
      .post("/bulk/data", formData)
      .then(() => {
        dispatch(getInitialData());
      })
      .finally(() => {
        setIndexData({
          ...indexData,
          namne: "",
          isSubmitting: false,
        });
        setShowImportDataForIndexModal(false);
      });
  };

  return (
    <Container>
      <div className="home__import-button">
        <Button onClick={() => setShowImportNewDataModal(true)}>
          Import index
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Index</th>
            <th>ID</th>
            <th>Docs Count</th>
            <th>Store Size</th>
            <th>Health</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {indexes?.length > 0 &&
            indexes.map((item) => (
              <tr key={item.uuid}>
                <td>{item.index}</td>
                <td>{item.uuid}</td>
                <td>{item["docs.count"]}</td>
                <td>{item["store.size"]}</td>
                <td>{item.health}</td>
                <td>{item.status}</td>
                <td>
                  <div className="table__actions">
                    <Button
                      variant="success"
                      onClick={() => handleShowImportIndexModal(item.index)}
                    >
                      Import
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleShowDeleteIndexModal(item.index)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      {/* NEW INDX MODAL */}
      <Modal
        show={showImportNewDataModal}
        onHide={() => setShowImportNewDataModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Import new index</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Index</Form.Label>
              <Form.Control
                type="text"
                placeholder="Index name"
                required
                value={indexData.name}
                onChange={(e) =>
                  setIndexData({
                    ...indexData,
                    name: e.target.value,
                  })
                }
              />
              {indexData.error.length > 0 && (
                <div class="text-danger">{indexData.error}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Choose index file (.json)</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setIndexData({
                    ...indexData,
                    file: e.target.files[0],
                  })
                }
                type="file"
              />
            </Form.Group>
            <Button
              className="importNewData__button"
              variant="primary"
              type="submit"
              disabled={indexData.isSubmitting}
            >
              {indexData.isSubmitting && (
                <Spinner size="sm" animation="border" role="status"></Spinner>
              )}
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        centered
        show={showDeleteIndexModal}
        onHide={() => setShowDeleteIndexModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete index: {indexData.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            className="importNewData__button"
            variant="danger"
            type="submit"
            disabled={indexData.isSubmitting}
            onClick={() => handleDeleteIndex(indexData.name)}
          >
            {indexData.isSubmitting && (
              <Spinner size="sm" animation="border" role="status"></Spinner>
            )}
            Delete
          </Button>
        </Modal.Body>
      </Modal>

      {/* IMPORT MODAL */}
      <Modal
        show={showImportDataForIndexModal}
        onHide={() => setShowImportDataForIndexModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Import data for index: {indexData.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleImportDataForIndex}>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Choose index file (.json)</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setIndexData({
                    ...indexData,
                    file: e.target.files[0],
                  })
                }
                type="file"
              />
            </Form.Group>
            <Button
              className="importNewData__button"
              variant="primary"
              type="submit"
              disabled={indexData.isSubmitting}
            >
              {indexData.isSubmitting && (
                <Spinner size="sm" animation="border" role="status"></Spinner>
              )}
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Home;
