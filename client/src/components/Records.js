import styles from "./Records.module.css";
const Records = (props) => {
  const { records } = props;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Username</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.project_id}>
            <td>
              {!record.project_title ? " NA" : ` ${record.project_title}`}
            </td>
            <td>{!record.username ? "NA" : record.username}</td>
            <td>{!record.category ? "NA" : record.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Records;
