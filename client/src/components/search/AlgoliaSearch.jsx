import React from 'react';
import { 
    InstantSearch, 
    Pagination,
    ClearRefinements,
    RefinementList,
    Configure,
    Hits, 
    SearchBox } from 'react-instantsearch-dom';

export default class AlgoliaSearch extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {

    }
  }

  render() {
    const {indexName, page, searchClient, hitComponent} = this.props;
    return (
      <div>
        <InstantSearch indexName={indexName} searchClient={searchClient}>
          <div>
            <SearchBox />
          </div>
          <div>
            <ClearRefinements />
            <RefinementList attribute="status" />
            <Configure hitsPerPage={page} />
          </div>
          <div>
            <Hits hitComponent={hitComponent} />
            <Pagination />
          </div>
        </InstantSearch>
      </div>
    );
  }

}
