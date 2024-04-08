import React, { useState } from "react";
import {
  InstantSearch,
  SearchBox,
  useHits,
  Pagination,
  HitsPerPage,
  Hits,
  Snippet,
  useSearchBox,
} from "react-instantsearch";
import algoliasearch from "algoliasearch";
import TranslationTable from "../Tables/TranslationTable";
import TranslationDetailsTable from "../Tables/TranslationDetailsTable";
import "instantsearch.css/themes/algolia.css";
import { autocomplete, AutocompleteOptions } from "@algolia/autocomplete-js";
import { BaseItem } from "@algolia/autocomplete-core";
import "@algolia/autocomplete-theme-classic";
import Autocomplete from "../AutoComplete";

const AlgoliaTest = () => {
  const searchClient = algoliasearch(
    "P5EELNNK48",
    "2f296b2c05e3f1e67d580832f292f0d3"
  );

  const [selectedTranslation, setTranslation] = useState(null);
  const handleRowClick = (translation) => {
    setTranslation(translation);
  };

  const [page, setPage] = useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", paddingRight: "1rem" }}>
          <h4 className="mt-3">Begreper</h4>
          <InstantSearch searchClient={searchClient} indexName="bachelor_index">
            {/* <SearchBox /> */}
            <Autocomplete
              placeholder="Søk etter konseptoversettelser..."
              detachedMediaQuery="none"
              openOnFocus
            />
            <CustomHits handleRowClick={handleRowClick} />
            <HitsPerPage
              items={[
                { label: "10 rader per side", value: 10, default: true },
                { label: "25 rader per side", value: 25 },
              ]}
            />
            <Pagination padding={2} className="Pagination" />
          </InstantSearch>
        </div>

        <div style={{ width: "50%" }}>
          <h4 className="mt-3">Oversettelsesdetaljer</h4>
          {selectedTranslation && (
            <TranslationDetailsTable translation={selectedTranslation} />
          )}
        </div>
      </div>
    </div>
  );
};

// const CustomHits = ({ handleRowClick }) => {
//     const HitComponent = ({ hit }) => (
//       <div onClick={() => handleRowClick(hit)}>
//         <article>
//             <header>
//                 <strong>{hit.termName}</strong>
//             </header>
//             <p>
//                 <Snippet hit={hit} attribute="translation"/>
//             </p>
//         </article>
//       </div>
//     );

//     return (
//       <Hits hitComponent={HitComponent} />
//     );
//   };

const CustomHits = ({ handleRowClick }) => {
  const { hits } = useHits();
  return (
    <TranslationTable translations={hits} handleRowClick={handleRowClick} />
  );
};

export default AlgoliaTest;