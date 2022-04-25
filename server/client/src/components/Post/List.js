import "./list.css";
function List({ children, className }) {
  return <ul className={`list ${!className ? "" : className}`}>{children}</ul>;
}

export default List;
