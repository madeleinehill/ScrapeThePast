import React, { useState } from "react";
import { connect } from "react-redux";
import { CREATE_DOCUMENTS, DELETE_ITEM } from "../modules/actions";

const DataView = (props) => {
  const { documents } = props;
  return (
    <div id="log">
      {Object.keys(documents).map((key, i) => (
        <div key={i}>
          <h3>{documents[key].path}</h3>
          <p>Confidence: {documents[key].confidence}</p>
          <p>Loading: {String(documents[key].loading)}</p>
          <p>{documents[key].text}</p>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  documents: state.documents,
});

const mapDispatchToProps = (dispatch) => ({
  addItemToStore: (p) => dispatch({ type: CREATE_DOCUMENTS, payload: p }),
  removeItemFromStore: (p) => dispatch({ type: DELETE_ITEM, payload: p }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataView);
