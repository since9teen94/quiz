import styles from "./Pages.module.css";
import Records from "./Records";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Pages = (props) => {
  const [records, setRecords] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [sortBy, setSortBy] = useState("date_added");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("session")) return navigate("/login");
    const session = JSON.parse(localStorage.getItem("session"));
    let exp = session.cookie.expires;
    let current = new Date(Date.now()).toISOString();
    const oneDay = 1000 * 60 * 60 * 24;
    if (new Date(current) - new Date(exp) >= oneDay) {
      localStorage.clear();
      return navigate("/login");
    }
    if (!session.userid) return navigate("/login");

    const getRecords = async () => {
      const req = await fetch(
        `records/sortBy/${sortBy}/order/${order}?page=${page}&limit=${limit}`
      );
      const res = await req.json();
      return { recs: res.records, rowCount: res.count };
    };

    getRecords().then((res) => {
      const { recs, rowCount } = res;
      setRecords(recs);
      setRowCount(rowCount);
    });
  }, [order, sortBy, page, limit, navigate]);

  const onPage = (e) => {
    const id = e.target.id;
    if (id === "dec" && page > 1) setPage(page - 1);
    if (id === "inc" && page < rowCount) setPage(page + 1);
    if (id === "first") setPage(1);
    if (id === "last") setPage(rowCount);
  };
  const handleChange = (e) => {
    const { value, name } = e.target;
    if (name === "sortBy") setSortBy(value);
    if (name === "order") setOrder(value);
    if (name === "limit") setLimit(value);
  };
  const sortByTags = [
    { val: "date_added", text: "Recent Projects" },
    { val: "category", text: "Category Name" },
    { val: "username", text: "Username" },
    { val: "project_title", text: "Project Title" },
  ];
  const orderByTags = [
    { val: "asc", text: "Ascending" },
    { val: "desc", text: "Descending" },
  ];
  const logOut = () => {
    const logUserOut = async () => {
      const req = await fetch("/users/logout");
      const res = await req.json();
      return res;
    };
    logUserOut().then((res) => {
      localStorage.clear();
      console.log("Logged Out");
      navigate("/login");
    });
  };

  return (
    <div className={styles.pagesDiv}>
      <div className={styles.selectDiv}>
        <label htmlFor="sortBy">Sort By</label>
        <select
          name="sortBy"
          id="sortBy"
          defaultValue="date_added"
          onChange={(e) => handleChange(e)}
        >
          {sortByTags.map((tag) => (
            <option value={tag.val} key={tag.val}>
              {tag.text}
            </option>
          ))}
        </select>
        <label htmlFor="order">Order</label>
        <select
          name="order"
          id="order"
          defaultValue="asc"
          onChange={(e) => handleChange(e)}
        >
          {orderByTags.map((tag) => (
            <option value={tag.val} key={tag.val}>
              {tag.text}
            </option>
          ))}
        </select>
        <label htmlFor="limit">LIMIT</label>
        <input
          type="number"
          name="limit"
          defaultValue="2"
          onChange={(e) => handleChange(e)}
        ></input>
        <button onClick={logOut}>Log Out</button>
      </div>
      <Records records={records} />
      <div className={styles.pages}>
        {page !== 1 ? (
          <button id="first" onClick={(e) => onPage(e)}>
            {1}
          </button>
        ) : (
          <div></div>
        )}
        <button id="dec" onClick={(e) => onPage(e)}>
          {"<<"}
        </button>
        <p>{page}</p>
        <button id="inc" onClick={(e) => onPage(e)}>
          {">>"}
        </button>
        {page < rowCount ? (
          <button id="last" onClick={(e) => onPage(e)}>
            {rowCount}
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Pages;
