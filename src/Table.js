import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries }) {
  return (
    <div className="table">
      {countries.map((country) => (
        <tr>
          <td>{country.country}</td>
          {/* if we use the following code, the live cases numbers will not be seperated by commas or added "K", "M"
          <td>{country.cases}</td> */}
          <td>
            <strong>{numeral(country.cases).format("0.0a")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
