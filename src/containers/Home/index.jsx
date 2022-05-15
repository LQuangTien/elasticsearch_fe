import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dropdown,
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
const defaultValue = {
  name: "",
  file: null,
  error: "",
  isSubmitting: false,
  mapping: null,
};

function Home(props) {
  const [fields, setFields] = useState([]);
  const [showImportNewDataModal, setShowImportNewDataModal] = useState(false);
  const [showDeleteIndexModal, setShowDeleteIndexModal] = useState(false);
  const [showImportDataForIndexModal, setShowImportDataForIndexModal] =
    useState(false);
  const [indexData, setIndexData] = useState(defaultValue);

  const dispatch = useDispatch();
  const { indexes } = useSelector((state) => state.init);

  const handleSubmit = (event) => {
    event.preventDefault();

    const indexNameList = indexes.map((i) => i.index);
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
    formData.append("mapping", JSON.stringify(indexData.mapping));

    axios
      .post("/bulk/new-data", formData)
      .then(() => {
        dispatch(getInitialData());
      })
      .finally(() => {
        setIndexData({
          ...indexData,
          name: "",
          file: null,
          mapping: [],
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
      name: "",
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

  function onReaderLoad(event, file) {
    const obj = JSON.parse(event.target.result);
    const fileFields = Object.keys(obj[0]);
    setFields(() => fileFields);
    const newData = {
      ...indexData,
      mapping: fileFields.reduce((acc, cur) => {
        acc[cur] = { type: "text" };
        return acc;
      }, {}),
      file,
    };
    console.log(newData);
    setIndexData(() => newData);
  }

  const handleSelectFile = (e) => {
    var reader = new FileReader();
    reader.onload = (event) => onReaderLoad(event, e.target.files[0]);
    reader.readAsText(e.target.files[0]);
  };
  const handleSelectTypeForField = (e, field) => {
    const cloneIndexData = indexData;
    cloneIndexData.mapping[field].type = e.target.value;
    indexData.mapping[field].type = e.target.value;
    setIndexData((prev) => ({ ...prev, ...cloneIndexData }));
    console.log(indexData.mapping);
  };

  return (
    <Container>
      <div className="home__import-button">
        <Button
          onClick={() => {
            setShowImportNewDataModal(true);
            setIndexData(defaultValue);
          }}
        >
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
              <Form.Control onChange={handleSelectFile} type="file" />
            </Form.Group>
            {indexData.file &&
              fields.length > 0 &&
              fields.map((field) => (
                <Form.Group key={field} className="my-3">
                  <Form.Label>Select type for field: "{field}"</Form.Label>
                  <select
                    className="selectTypeForFile"
                    style={{ textTransform: "capitalize" }}
                    onChange={(e) => handleSelectTypeForField(e, field)}
                    value={indexData.mapping[field].type}
                    name={indexData.mapping[field]}
                  >
                    {[
                      "keyword",
                      "text",
                      "integer",
                      "float",
                      "datetime",
                      "byte",
                      "boolean",
                      "ip",
                    ].map((i) => (
                      <option
                        key={i}
                        style={{ textTransform: "capitalize" }}
                        value={i}
                      >
                        {i}
                      </option>
                    ))}
                  </select>
                </Form.Group>
              ))}
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
