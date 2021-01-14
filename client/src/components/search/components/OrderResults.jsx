import React from "react";

import { connectStateResults } from "react-instantsearch-dom";

export default connectStateResults(
  ({ searchResults, children }) => searchResults && searchResults.nbHits !== 0 
    ? (children)
    : (<div>No orders (yet)!</div>)
  );

