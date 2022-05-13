import React from "react";
import "./feedtype.css";

function FeedType({ setType }) {
  return (
    <div className="feedtype">
      <div className="feedtypeWrapper">
        <div className="type" onClick={() => setType("All")}>
          All
        </div>
        <div className="type" onClick={() => setType("Music")}>
          Music
        </div>
        <div className="type" onClick={() => setType("Science")}>
          Science
        </div>
        <div className="type" onClick={() => setType("Food")}>
          Food
        </div>
        <div className="type" onClick={() => setType("Movies")}>
          Movies
        </div>
        <div className="type" onClick={() => setType("Sports")}>
          Sports
        </div>
      </div>
    </div>
  );
}

export default FeedType;
