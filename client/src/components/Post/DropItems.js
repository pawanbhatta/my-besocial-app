import { useEffect, useRef, useState } from "react";

const DropItems = ({
  children,
  className,
  top,
  bottom,
  left,
  right,
  start,
  end,
  center,
}) => {
  const [classes, setClasses] = useState("");
  useEffect(() => {
    if (top === true)
      if (end === true) {
        setClasses("top end");
        return;
      } else if (center === true) {
        setClasses("top vcenter");
        return;
      } else {
        setClasses("top start");
        return;
      }
    else if (bottom === true)
      if (end === true) {
        setClasses("bottom end");
        return;
      } else if (center === true) {
        setClasses("bottom vcenter");
        return;
      } else {
        setClasses("bottom start");
        return;
      }
    else if (left === true)
      if (center === true) {
        setClasses("left hcenter");
        return;
      } else if (end === true) {
        setClasses("left hend");
        return;
      } else {
        setClasses("left hstart");
        return;
      }
    else if (right === true)
      if (center === true) {
        setClasses("right hcenter");
        return;
      } else if (end === true) {
        setClasses("right hend");
        return;
      } else {
        setClasses("right hstart");
        return;
      }
    else setClasses("bottom start");
  }, [top, bottom, left, right, start, end, center]);

  const observe = new IntersectionObserver(
    (entries, observer) => {
      if (entries[0].isIntersecting) observer.disconnect();
      // console.log('notIntersection')
      const dim = fc.current.getBoundingClientRect();
      if (left || right) {
        if (dim.top < 0) {
          fc.current.classList.toggle("hstart", true);
          fc.current.classList.toggle("hend", false);
          fc.current.classList.toggle("hcenter", false);
        }
        if (
          dim.bottom >
          (window.innerHeight || document.documentElement.clientHeight)
        ) {
          fc.current.classList.toggle("hstart", false);
          fc.current.classList.toggle("hend", true);
          fc.current.classList.toggle("hcenter", false);
        }
        if (dim.left < 0) {
          fc.current.classList.toggle("left", false);
          fc.current.classList.toggle("right", true);
        }
        if (
          dim.right >
          (window.innerWidth || document.documentElement.clientWidth)
        ) {
          fc.current.classList.toggle("right", false);
          fc.current.classList.toggle("left", true);
        }
      } else {
        if (dim.top < 0) {
          fc.current.classList.toggle("top", !top);
          fc.current.classList.toggle("bottom", true);
        }
        if (
          dim.bottom >
          (window.innerHeight || document.documentElement.clientHeight)
        ) {
          fc.current.classList.toggle("top", true);
          fc.current.classList.toggle("bottom", !bottom);
        }
        if (dim.left < 0) {
          fc.current.classList.toggle("vcenter", false);
          fc.current.classList.toggle("start", true);
          fc.current.classList.toggle("end", false);
        }
        if (
          dim.right >
          (window.innerWidth || document.documentElement.clientWidth)
        ) {
          fc.current.classList.toggle("vcenter", false);
          fc.current.classList.toggle("start", false);
          fc.current.classList.toggle("end", true);
        }
      }
    },
    {
      threshold: 1,
    }
  );
  const fc = useRef();
  const startObserving = () => {
    observe.observe(fc.current);
  };
  const stopObserving = () => {
    observe.disconnect();
  };
  useEffect(() => {
    const refere = fc.current;
    refere.parentElement.addEventListener("focusin", startObserving);
    refere.parentElement.addEventListener("mouseenter", startObserving);
    refere.parentElement.addEventListener("focusout", stopObserving);
    refere.parentElement.addEventListener("mouseleave", stopObserving);
    return (_) => {
      if (!refere) return;
      refere.parentElement.removeEventListener("focusin", startObserving);
      refere.parentElement.removeEventListener("focusout", stopObserving);
      refere.parentElement.removeEventListener("mouseenter", startObserving);
      refere.parentElement.removeEventListener("mouseleave", stopObserving);
    };
  });
  return (
    <div
      ref={fc}
      tabIndex={0}
      className={`focus-content ${classes} ${className ? className : ""}`}
    >
      {children}
    </div>
  );
};

export default DropItems;
