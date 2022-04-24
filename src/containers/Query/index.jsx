import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  FormControl,
  InputGroup,
  Modal,
  Spinner,
  Table,
  Dropdown,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import axios from "../../helpers/axios";

function Query(props) {
  const [search, setSearch] = useState({
    text: "",
    index: "",
    perPage: 10,
  });
  const [fields, setFields] = useState([]);
  const [checkedFields, setCheckedFields] = useState([]);
  const [data, setData] = useState({
    header: [],
    body: [],
    filterdBody: [],
  });

  const { indexes } = useSelector((state) => state.init);

  const fetchData = async () => {
    if (search.index) {
      const response = await axios.get(
        `/search/multiMatch?index=${search.index}&input=${search.text}&perPage=${search.perPage}`
      );
      const result = response.data.result.hits.hits.map((h) => h._source);

      const header = Object.keys(result[0] ?? []);
      const body = result;
      setData({
        ...data,
        header,
        body,
        filterdBody: body,
      });
    }
  };

  const fetchIndexFields = async () => {
    if (search.index) {
      const response = await axios.get(`index/mapping/${search.index}`);
      setFields(response.data.allFieldOfIndex);
      setCheckedFields(response.data.allFieldOfIndex);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await fetchIndexFields();
    };
    fetch();
  }, [search.index]);

  useEffect(() => {
    const fetch = async () => {
      await fetchData();
    };
    fetch();
  }, [search]);

  const handleSearchTextChange = async (e) => {
    setSearch((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleSelectIndex = async (event) => {
    setFields([]);
    setSearch((prev) => ({
      ...prev,
      index: event,
    }));
  };

  const handleSelectPerPage = async (event) => {
    setSearch((prev) => ({
      ...prev,
      perPage: event,
    }));
  };

  function filterObject(obj, callback) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, val]) => callback(val, key))
    );
  }
  return (
    // const indexNameList = ;

    <Container fluid>
      <div className="dropdowns">
        <Dropdown onSelect={handleSelectIndex}>
          <Dropdown.Toggle className="dropdown__button">
            {search.index || "Select index"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {indexes?.length > 0 &&
              indexes.map((i) => (
                <Dropdown.Item eventKey={i.index}>{i.index}</Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown onSelect={handleSelectPerPage}>
          <Dropdown.Toggle className="dropdown__button">
            {search.perPage || "Item per page"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {[5, 10, 15, 20].map((i) => (
              <Dropdown.Item eventKey={i}>{i}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Form
        className="checkboxes"
        onChange={(e) => {
          const { value } = e.target;
          setCheckedFields((prev) => {
            if (prev.includes(value)) {
              const dataValue = prev.filter((i) => i !== value);
              return dataValue;
            } else {
              const dataValue = [...prev, value];
              // setData((prev) => ({ ...prev, header: dataValue }));
              return dataValue;
            }
          });
        }}
      >
        {fields.length > 0 &&
          fields.map((f) => (
            <Form.Check
              className="checkboxes__item"
              type="checkbox"
              id={f}
              label={f}
              value={f}
              checked={checkedFields.includes(f)}
            />
          ))}
      </Form>
      <FormControl
        value={search.text}
        onChange={handleSearchTextChange}
        placeholder="Search by text"
        className="query__input"
      />

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {data.header &&
              data.header.map((h, index) => <th key={index}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.filterdBody?.length > 0 &&
            data.filterdBody.map((item) => (
              <tr key={item.uuid}>
                {Object.keys(item).map((column) => (
                  <td>{item[column]}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Query;
