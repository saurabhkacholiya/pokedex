import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import searchIcon from "./assets/search.svg";

function PokemonCard({ name, url, captured, onclick }) {
  console.log("name and captured", name, captured);
  const [pokeImg, setPokeImage] = useState([]);

  useEffect(() => {
    const splitData = url.split("/");
    const id = splitData[splitData.length - 2];
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((res) => {
        if (res.data && res.data.sprites)
          setPokeImage(res.data.sprites.front_shiny);
      })
      .catch((err) => {
        console.log("error in pokemon card", err);
      });
  }, [url]);

  return (
    <div
      key={name}
      className="pokemon_card"
      style={{ backgroundColor: captured ? "#eee" : "#fff" }}
    >
      <img alt={name} src={pokeImg} />
      <div>{name}</div>
      {!captured && (
        <button onClick={onclick} className="captured_button">
          captured?
        </button>
      )}
    </div>
  );
}

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [capturedPokemonData, setCapturedPokemonData] = useState([]);
  const [capturedPokemonObj, setCapturedPokemonObj] = useState({});

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=100")
      .then((res) => {
        if (res.data && res.data.results) {
          setPokemonData(res.data.results);
          setMasterData(res.data.results);
        }
      })
      .catch((err) => {
        console.log("error in listing api", err);
      });
  }, []);

  function onChangeListener(event) {
    const text = event.target.value;
    if (text) {
      const newData = masterData.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setPokemonData(newData);
    } else {
      setPokemonData(masterData);
    }
  }

  function onClickOfCaptured(item, index) {
    capturedPokemonData.push(item);
    setCapturedPokemonData(capturedPokemonData); // pushing into array for filtered view

    if (capturedPokemonObj[`${item.name}_${index}`]) {
      capturedPokemonObj[`${item.name}_${index}`] = false;
    } else {
      capturedPokemonObj[`${item.name}_${index}`] = true;
    }

    setCapturedPokemonObj(capturedPokemonObj);
  }

  return (
    <div>
      <div className="item-center">
        <div className="input_search_div">
          <img alt="search icon" className="search_img" src={searchIcon} />
          <input
            type="text"
            className="input_search"
            placeholder="Search.."
            onChange={onChangeListener}
          ></input>
        </div>
      </div>
      <div className="main_container">
        {pokemonData.map((item, index) => (
          <PokemonCard
            key={`${item.name}_${index}`}
            name={item.name}
            url={item.url}
            onclick={() => onClickOfCaptured(item, index)}
            captured={capturedPokemonObj[`${item.name}_${index}`]}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
