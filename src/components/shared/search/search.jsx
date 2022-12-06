import algoliasearch from 'algoliasearch/lite';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useRef, useState, useMemo } from 'react';
import { InstantSearch } from 'react-instantsearch-dom';

import useDebounce from 'hooks/use-debounce';
import useOnClickOutside from 'hooks/use-on-click-outside';
import algoliaQueries from 'utils/algolia-queries';

import Input from './input';
import Results from './results';

const indices = [{ name: algoliaQueries[0].indexName, title: 'Docs', hitComp: 'postPageHit' }];

const Search = ({ className }) => {
  const ref = useRef(null);
  const [query, setQuery] = useState();
  const [hasFocus, setFocus] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  const searchClient = useMemo(
    () => algoliasearch(process.env.GATSBY_ALGOLIA_APP_ID, process.env.GATSBY_ALGOLIA_SEARCH_KEY),
    []
  );

  useOnClickOutside(ref, () => setFocus(false));

  const shouldShowResult = !!debouncedQuery?.length && hasFocus;

  return (
    <div className={clsx('relative', className)} ref={ref}>
      <InstantSearch
        searchClient={searchClient}
        indexName={indices[0].name}
        onSearchStateChange={({ query }) => setQuery(query)}
      >
        <Input hasFocus={hasFocus} onFocus={() => setFocus(true)} />
        {shouldShowResult && <Results indices={indices} />}
      </InstantSearch>
    </div>
  );
};

Search.propTypes = {
  className: PropTypes.string,
};

Search.defaultProps = {
  className: null,
};

export default Search;
