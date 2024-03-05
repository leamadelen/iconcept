import React, { Component } from 'react';

export class FeelingList extends Component {
  static displayName = FeelingList.name;

  constructor(props) {
    super(props);
    this.state = { concepts: [], loading: true };
  }

  componentDidMount() {
    this.populateFeelingsData();
  }
  static renderFeelingsList(concepts) {
    return (
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Feelings</th>
          </tr>
        </thead>
        <tbody>
          {concepts.map(concept =>
            concept.religions.map(religion => (
              <tr key={`${concept.id}-${religion.id}`}>
                <td>{concept.translation}</td>
                <td>{concept.term.termName}</td>
                <td>{religion.religionName}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }

  render() {
    console.log(this.state.concepts);
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : FeelingList.renderFeelingsList(this.state.concepts);

    return (
      <div>
        <h1 id="tableLabel">Feelings List</h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </div>
    );
  }
  async populateFeelingsData() {
    console.log('Fetching feelings data...');
    // try {
    //     const response = await fetch('api/feelings');
    //     if (response.ok) {
    //         const data = await response.json();
    //         console.log(data)
    //         this.setState({ feelings: data, loading: false });
    //         console.log('Fetched feelings data:', data);
    //     } else {
    //         console.error('Failed to fetch feelings data, status:', response.status);
    //     }
    // } catch (error) {
    //     console.error('Error fetching feelings data:', error);
    //     this.setState({ loading: false }); // Consider setting an error state as well
    // }
    const response = await fetch('/api/feelings');
    const data = await response.json();
    this.setState({ concepts: data, loading: false });
  }
}
