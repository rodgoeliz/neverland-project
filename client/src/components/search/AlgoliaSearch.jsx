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
        refreshAlgolia: props.refreshAlgolia ? props.refreshAlgolia: false,
    }
    if (props.searchClient) {
      props.searchClient.clearCache();
    }
    this.handleRefreshAlgolia = this.handleRefreshAlgolia.bind(this);
  }

  componentDidMount() {
    if (this.state.refreshAlgolia) {
      this.setState({ refreshAlgolia: false });
    }
  }

  handleRefreshAlgolia = () => {
    setTimeout(() => { 
      this.setState({
        refreshAlgolia: true,
      }, () => {
        this.setState({ refreshAlgolia: false });
      });
      }, 1000);
  }

  render() {
    const { indexName, searchClient, filterQuery, hitComponent, filterAttributes, hitsPerPage, ResultsComponent, label} = this.props;
    const HitComponent = ({hit}) => {
      return hitComponent({hit, onRefreshAlgolia: this.handleRefreshAlgolia});
    }
    const hComp = <Hits hitComponent={HitComponent} />
    const hits = ResultsComponent
      ? <ResultsComponent onRefreshAlgolia={this.handleRefreshAlgolia}> {hComp}  </ResultsComponent>
      : hComp;
    const refinementListComponents = filterAttributes ?
      filterAttributes.map((fAttr) => {
        return <RefinementList attribute={fAttr} />
      })
      : [];

    return (
      <div>
        <InstantSearch
          refresh={this.state.refreshAlgolia}
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
