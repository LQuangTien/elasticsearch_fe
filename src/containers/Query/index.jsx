import React, { useEffect, useState } from "react";
import { Container, Dropdown, Form, FormControl, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import axios from "../../helpers/axios";
import AU from "./arrow-up.svg";
import AD from "./arrow-down.svg";
import "./style.css";

function Query(props) {
  const [search, setSearch] = useState({
    text: "",
    index: "",
    perPage: 10,
    totalPage: 1,
    page: 1,
  });
  const [fields, setFields] = useState([]);
  const [checkedFields, setCheckedFields] = useState([]);
  const [checkedFilters, setCheckedFilters] = useState([]);
  const [data, setData] = useState({
    header: [],
    body: [],
  });

  const { indexes } = useSelector((state) => state.init);

  const fetchData = async (page = 1) => {
    if (search.index && checkedFields.length > 0) {
      const queryData = {
        index: search.index,
        input: search.text,
        perPage: search.perPage,
        page,
        includes: checkedFields,
        fields: checkedFilters,
        sort: search.sort,
      };
      const response = await axios.post(
        `/search/partialSearch/${page}/${search.perPage}`,
        queryData
      );
      const result = response.data.formatResult.result.items.map(
        (h) => h._source
      );

      const { totalPage } = response.data.formatResult.result;

      const header = Object.keys(result[0] ?? []);
      const body = result;
      setData({
        ...data,
        header,
        body,
      });
      setSearch((prev) => ({ ...prev, totalPage }));
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
      await fetchData(search.page);
    };
    fetch();
  }, [
    search.index,
    search.perPage,
    search.page,
    search.sort,
    checkedFields,
    checkedFilters,
  ]);

  useEffect(() => {
    const fetch = async () => {
      await fetchData(1);
    };
    fetch();
    setSearch((prev) => ({
      ...prev,
      page: 1,
    }));
  }, [search.text]);

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

  const handlePageClick = (activePage) => {
    setSearch((prev) => ({
      ...prev,
      page: +activePage.selected + 1,
    }));
  };

  const handleSortColumn = (column) => {
    setSearch((prev) => {
      if (prev.sort == void 0) {
        return { ...prev, sort: [{ [column]: { order: "desc" } }] };
      }
      if (Object.keys(prev.sort[0])[0] === column) {
        return {
          ...prev,
          sort: [
            {
              [column]: {
                order: prev.sort[0][column].order === "asc" ? "desc" : "asc",
              },
            },
          ],
        };
      } else {
        return { ...prev, sort: [{ [column]: { order: "desc" } }] };
      }
    });
  };

  const renderheader = (header, index) => {
    const existSortHeader =
      search.sort && Object.keys(search.sort[0])[0] === header;
    const descExistSortHeader =
      existSortHeader && search.sort[0][header].order === "desc";
    const ascExistSortHeader =
      existSortHeader && search.sort[0][header].order === "asc";
    return (
      <th
        className="tableHeader"
        onClick={() => handleSortColumn(header)}
        key={index}
      >
        <span style={{ marginRight: "10px" }}>{header}</span>
        {descExistSortHeader ? (
          <img style={{ height: "20px", width: "20px" }} src={AU} alt="" />
        ) : ascExistSortHeader ? (
          <img style={{ height: "20px", width: "20px" }} src={AD} alt="" />
        ) : (
          <></>
        )}
      </th>
    );
  };

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
      <div>Columns</div>
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
      <div>Filter</div>
      <Form
        className="checkboxes"
        onChange={(e) => {
          const { value } = e.target;
          setCheckedFilters((prev) => {
            if (prev.includes(value)) {
              const dataValue = prev.filter((i) => i !== value);
              return dataValue;
            } else {
              const dataValue = [...prev, value];
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
              id={`${f}_filter`}
              label={f}
              value={f}
              checked={checkedFilters.includes(f)}
            />
          ))}
      </Form>
      <FormControl
        value={search.text}
        onChange={handleSearchTextChange}
        placeholder="Search by text"
        className="query__input"
      />
      {data.body?.length > 0 && (
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={search.totalPage}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          forcePage={Number(search.page - 1) || 0}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"pagination_active"}
        />
      )}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {data.header &&
              data.header.map((h, index) => renderheader(h, index))}
          </tr>
        </thead>
        <tbody>
          {data.body?.length > 0 &&
            data.body.map((item) => (
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
