import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import searchIcon from "./assets/search.svg";
import filterIcon from "./assets/filterIcon.svg";

function PokemonCard({ name, url }) {
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
  }, []);

  return (
    <div key={name} className="pokemon_card">
      <img alt={name} src={pokeImg} />
      <div>{name}</div>
    </div>
  );
}

function App() {
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=100")
      .then((res) => {
        console.log("result is ", res.data);
        if (res.data && res.data.results) {
          setPokemonData(res.data.results);
        }
      })
      .catch((err) => {
        console.log("error in listing api", err);
      });
  }, []);
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img alt="search icon" src={searchIcon} />
        <input
          type="text"
          className="input_search"
          placeholder="Search.."
        ></input>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {pokemonData.map((item) => (
          <PokemonCard name={item.name} url={item.url} />
        ))}
      </div>
    </div>
  );
}

export default App;
