import React, { PureComponent } from 'react';
import isEmpty from 'lodash/isEmpty';
import head from 'lodash/head';
import get from 'lodash/get';
import Loader from 'react-loader-spinner';
import NO_RESULTS_GIF from '../media/giphy.gif';
import './StarshipsList.css';

const BASE_API_URL = 'https://swapi.co/api/';

export default class StarshipsList extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            searchResults: [],
            searchableTopics: [],
            isLoading: true,
            error: false,
        }
    }

    componentDidMount() {
        this.setState({
            searchableTopics: this.getSearchResults(),
            searchResults: this.getSearchResults('starships'),
        });
    }

    getSearchResults = (search = '') => {
        this.setState({ isLoading: true });

        fetch(`${BASE_API_URL}${search}`)
            .then((results) => results.json())
            .catch(() => { this.setState({ error: true, isLoading: false }) })
            .then((data) => {
                const hasResults = get(data, 'detail', '').toLowerCase() !== 'not found';
                const searchResults = get(data, 'results') || (data && hasResults && [{ ...data }]);

                this.setState({ error: !hasResults, isLoading: false });

                if (hasResults) {
                    search === '' ?
                        this.setState({ searchableTopics: searchResults || [] }) :
                        this.setState({ searchResults });
                }
            });
    };

    getAttributeName = (attribute) =>
        typeof attribute !== 'object' ?
            attribute :
            Object.keys(attribute).map((attr) => attribute[attr]);

    handleSearch = (e) => {
        e.preventDefault();
        const attr = document.getElementById('searchTypeSelect').value;
        const search = document.getElementById('search').value;
        const res = attr ?
            search ?
                `${attr}/${search}` :
                attr :
        null;

        res && this.getSearchResults(res);
    };

    render() {
        const { searchableTopics = [], searchResults = [], isLoading, error } = this.state;
        const numberOfResults = searchResults && searchResults.length;
        const attributes = !isEmpty(searchResults) && head(searchResults);
        const resultsMessage = error ?
            'Oops, no results ! Try again ...' :
            numberOfResults === 0 || numberOfResults === undefined ?
                'Sorry ! Could not find any results' :
                `Search results: ${numberOfResults}`;

        return (
            <div className="searchResultsContainer">
                { this.renderSearchForm(searchableTopics) }
                { isLoading ?
                    <Loader className="loader" type="TailSpin" color="#e5d11b" height={80} width={80} /> :
                    (
                        <>
                            <p className="resultsMessage">{ resultsMessage }</p>
                            {
                                error || numberOfResults === 0 ?
                                    <img src={ NO_RESULTS_GIF } alt="Starwars gif idk" className="noResultsGif" /> :
                                    this.renderSearchResults(searchResults, attributes, numberOfResults)
                            }
                        </>
                    )
                }
            </div>
        );
    }

    renderSearchForm = (searchableTopics = []) => {
        const results = !isEmpty(searchableTopics) ?
            searchableTopics.length === 1 ?
                head(searchableTopics) :
                searchableTopics
            : null;

        return <form className="searchWrapper" onSubmit={this.handleSearch}>
                <select id="searchTypeSelect" className="searchTopics" required>
                    <option value="">Please select a topic</option>
                    { results && Object.keys(results).map((topic, key) =>
                        <option key={key} value={topic}>
                            { topic }
                        </option>
                    )}
                </select>
                <input type="text" id="search" placeholder="Empty = all results" className="searchInput"/>
                <button type="submit" className="searchButton">Search</button>
            </form>;
    };

    renderSearchResults = (searchResults = [], attributes = [], numberOfResults = 0) =>
        numberOfResults && !isEmpty(attributes) &&
        (
            <div className="searchResultsWrapper">
                <div className="searchResultsAttributesWrapper">
                    {
                        attributes && (attributes.length > 1 || Object.keys(attributes).length > 1) ? (
                            <>
                                <span className="searchResultsAttribute"> { this.getAttributeName(Object.keys(attributes)[0]) } </span>
                                <span className="searchResultsAttribute"> { this.getAttributeName(Object.keys(attributes)[1]) } </span>
                            </>
                        ) : attributes && Object.keys(attributes) && (
                            <span className="searchResultsAttribute"> { this.getAttributeName(Object.keys(attributes)[0]) } </span>
                        )
                    }
                </div>
                {
                    !isEmpty(searchResults) &&
                        searchResults.map((result, index) => this.renderItem(result, index))
                }
            </div>
        );

    renderItem(result = {}, index) {
        const attributeList = result ? [...Object.keys(result).map((res) => result[res])] : [];

        return !isEmpty(attributeList) ? (
            <div key={ index } className="resultInfoWrapper">
                {
                    attributeList.length > 1 ? (
                        <>
                            <span className="resultInfo">{ this.getAttributeName(attributeList[0]) }</span>
                            <span className="resultInfo">{ this.getAttributeName(attributeList[1]) }</span>
                        </>
                    ) : <span className="resultInfo">{ this.getAttributeName(Object.keys(attributeList[0])) }</span>
                }
            </div>
        ) : null;
    }
}
