import React from 'react';
import {
  InstantSearch,
  Pagination,
  // ClearRefinements,
  Hits,
  connectRefinementList,
  Configure,
  SearchBox
} from 'react-instantsearch-dom';

import NButton from "components/UI/NButton";

import CustomRefinementList from './CustomRefinementList';
import LoadingIndicator from "./components/LoadingIndicator";

const RefinementList = connectRefinementList(CustomRefinementList);

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
    const { indexName, searchClient, filterQuery, hitComponent, filterAttributes, hitsPerPage, ResultsComponent, label} = this.props;
    searchClient.clearCache()
    const hComp = <Hits hitComponent={hitComponent} />
    const hits = ResultsComponent
      ? <ResultsComponent> {hComp}  </ResultsComponent>
      : hComp;

    const refinementListComponents = filterAttributes ?
      filterAttributes.map((fAttr) => {
        return <RefinementList attribute={fAttr} />
      })
      : [];

    return (
      <div>
        <InstantSearch
          indexName={indexName}
          searchClient={searchClient}>
          <div>
            <SearchBox showLoadingIndicator translations={{ placeholder: label ? `Search ${label}...` : '' }} submit={<NButton size="x-small" theme="secondary" title="SUBMIT"/>} />
          </div>
          <div>
          {refinementListComponents}
          <Configure filters={filterQuery} hitsPerPage={hitsPerPage} />
          </div>
          <div>
            <LoadingIndicator />
            {hits}
            <Pagination showFirst={false} showLast={false} />
          </div>
        </InstantSearch>
      </div>
    );
  }

}
