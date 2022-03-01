import { useEffect, useRef } from "react";
import "./DisplayFullPage.css"
function FullPage({ children, keyHandler }) {
   const fp = useRef()
   useEffect(() => {
      fp.current.focus();
      fp.current.classList.toggle('hidden', false);
      const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      fp.current.style.height = `calc(${h}px - var(--topBarHeight))`
   }, [])
   return (<div className="fullPage hidden" ref={fp} tabIndex={1}
      onKeyDown={keyHandler}>
      {children}
   </div>);
}

export default FullPage;