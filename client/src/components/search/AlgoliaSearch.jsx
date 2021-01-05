import React from 'react';
import {
  InstantSearch,
  Pagination,
  // ClearRefinements,
  // RefinementList,
  Configure,
  Hits,
  SearchBox
} from 'react-instantsearch-dom';

export default class AlgoliaSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    if (props.searchClient) {
      props.searchClient.clearCache();
    }
  }

  render() {
    const { indexName, searchClient, filterQuery, hitComponent, hitsPerPage } = this.props;
    searchClient.clearCache()
    return (
      <div>
        <InstantSearch
          indexName={indexName}
          searchClient={searchClient}>
          <div>
            <SearchBox translations={{ placeholder: '' }} submit="SUBMIT" />
          </div>
          <div>
            {/* <ClearRefinements /> */}
            {/* <RefinementList attribute={filterAttribute} /> */}
            <Configure filters={filterQuery} hitsPerPage={hitsPerPage} />
          </div>
          <div>
            <Hits hitComponent={hitComponent} />
            <Pagination showFirst={false} showLast={false} />
          </div>
        </InstantSearch>
      </div>
    );
  }

}
