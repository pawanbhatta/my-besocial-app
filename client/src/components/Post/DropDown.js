// import { useEffect, useRef, useState } from 'react';
import DropItems from "./DropItems";
import "./DrpDwn.css";
function Dropdown({ children, className, hover }) {
  return (
    <div
      className={`drpstatic 
      ${hover ? "hoverable" : ""}
         ${className !== undefined ? className : ""}`}
    >
      {children}
    </div>
  );
}
Dropdown.Visible = ({ children, onClick }) => (
  <div onClick={onClick} className="visible-content hover-white" tabIndex={1}>
    {children}
  </div>
);
Dropdown.Focus = DropItems;
export default Dropdown;
