import React, { PureComponent } from 'react';

import LOGO from './media/SWLogo.png';

import StarshipsList from './components/StarshipsList';

import './App.css';

class App extends PureComponent {
  render() {
    return (
      <div className="container">
        <img src={ LOGO } alt="Starwars Logo" className="logo" />
        <p className="disclaimer">
            Welcome to the Starwars universe.<br /><br />The API doesn´t allow searching by name, only by ID, and I didn't
            have time to finish the challenge 😞<br /><br />So you can select a topic and type, for example, "1" and get the info,
            if it exists, <br /><br />or leave the input empty and the API will retrieve the complete list.<br /><br />
            Have fun 🙂
        </p>
        <StarshipsList />
      </div>
    );
  }
}

export default App;
