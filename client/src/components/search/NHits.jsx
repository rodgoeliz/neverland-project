import React from 'react'
import { Hits } from "react-instantsearch-dom";

/* eslint-disable */
export default function Never({ hits, hitComponent }) {

    if (hits.length == 0) {
      return (<div> You currently have no orders</div>);
    }
    return <Hits hitComponent={hitComponent} hits={hits} />

}
