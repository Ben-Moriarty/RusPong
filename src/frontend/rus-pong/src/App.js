import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentRandomWord, displayRandomWord] = useState("Initial filler");

  const onButtonClick = () => {
    console.log('click');

    fetch('/api/random')
    .then(response => {
      if(!response.ok) {
        throw new Error(`error fetching random  ${response.status}`)
      }

      return response.json();
    })
    .then(data => {
      displayRandomWord(`${data.bare}`)
    })
    .catch(error => {
      console.log("Error getting data: ", error.message)
    })
    displayRandomWord("returned value");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>{currentRandomWord}</h2>
      </header>
    </div>
  );
}

export default App;