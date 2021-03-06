import React, { useEffect, useState } from "react";
import axios from "axios";
import searchIcon from "./assets/search.svg";
import logoIcon from "./assets/logo.png";
import Modal from "./Components/Modal";
import "./App.css";

function PokemonCard({ name, url, captured, onclick, onClickViewMoreDetails }) {
  const [pokeImg, setPokeImage] = useState([]);
  const [currentPokemonData, setCurrentPokemonData] = useState([]);

  useEffect(() => {
    const splitData = url.split("/");
    const id = splitData[splitData.length - 2];
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((res) => {
        if (res.data && res.data.sprites) {
          setPokeImage(res.data.sprites.front_shiny);
          setCurrentPokemonData(res.data);
        }
      })
      .catch((err) => {
        console.log("error in pokemon card", err);
      });
  }, [url]);

  function handleViewMoreDetails() {
    const item = { name, url };
    onClickViewMoreDetails(currentPokemonData, item);
  }

  return (
    <div
      key={name}
      className="pokemon_card"
      style={{ backgroundColor: captured ? "#eee" : "#fff" }}
    >
      <img alt={name} src={pokeImg} />
      <div>{name}</div>
      <div>
        <>
          {!captured && (
            <button onClick={onclick} className="captured_button">
              capture
            </button>
          )}
        </>
        <button onClick={handleViewMoreDetails} className="view_details_button">
          View details
        </button>
      </div>
    </div>
  );
}

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [capturedPokemonData, setCapturedPokemonData] = useState([]);
  const [capturedPokemonObj, setCapturedPokemonObj] = useState({});
  const [filteredValue, setFilteredValue] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedPokemonData, setSelectedPokemonData] = useState({});

  const [pokemonDataForCapturingList, setSelectedPokemonDataForCapturingList] =
    useState({});

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

  function searchBarListener(text, data) {
    if (text) {
      const newData = data.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setPokemonData(newData);
    } else {
      setPokemonData(data);
    }
  }

  function onChangeListener(event) {
    const text = event.target.value;

    if (filteredValue === "All") {
      searchBarListener(text, masterData);
    } else if (filteredValue === "Captured") {
      searchBarListener(text, capturedPokemonData);
    } else {
      const filterData = masterData.filter((item) => {
        return !capturedPokemonObj[item.name];
      });
      searchBarListener(text, filterData);
    }
  }

  function onClickOfCaptured(item) {
    const updatedCapturedPokemonData = [...capturedPokemonData];
    updatedCapturedPokemonData.push(item);
    setCapturedPokemonData(updatedCapturedPokemonData); // pushing into array for filtered view

    const updatedPokemonObj = { ...capturedPokemonObj };
    if (updatedPokemonObj[`${item.name}`]) {
      updatedPokemonObj[`${item.name}`] = false;
    } else {
      updatedPokemonObj[`${item.name}`] = true;
    }

    setCapturedPokemonObj(updatedPokemonObj);
  }

  function handleChange(event) {
    const filterSelectedValue = event.target.value;

    if (filterSelectedValue === "All") {
      setPokemonData(masterData);
    } else if (filterSelectedValue === "Captured") {
      setPokemonData(capturedPokemonData);
    } else {
      const filteredData = masterData.filter((item) => {
        return !capturedPokemonObj[item.name];
      });
      setPokemonData(filteredData);
    }

    setFilteredValue(filterSelectedValue);
  }

  function onClickViewMoreDetails(data, obj) {
    setSelectedPokemonData(data);
    setSelectedPokemonDataForCapturingList(obj);
    setShowModal(true);
  }

  return (
    <main>
      <nav className="nav_bar">
        <img src={logoIcon} className="logo_img" alt="pokeapi logo" />
      </nav>
      <div className="item-center">
        <div className="filter_section">
          <div className="input_search_div">
            <img alt="search icon" className="search_img" src={searchIcon} />
            <input
              type="text"
              className="input_search"
              placeholder="Search.."
              onChange={onChangeListener}
            ></input>
          </div>
          <div>
            <select
              className="filter_dropdown"
              defaultValue={filteredValue}
              onChange={handleChange}
            >
              <option value="All">All</option>
              <option value="Captured">Captured</option>
              <option value="Not Captured">Not Captured</option>
            </select>
          </div>
        </div>
      </div>
      <div className="main_container">
        {pokemonData.map((item, index) => (
          <PokemonCard
            key={`${item.name}_${index}`}
            name={item.name}
            url={item.url}
            onclick={() => onClickOfCaptured(item)}
            captured={capturedPokemonObj[`${item.name}`]}
            onClickViewMoreDetails={onClickViewMoreDetails}
          />
        ))}
      </div>

      <Modal show={showModal}>
        <div>
          {selectedPokemonData.sprites &&
            selectedPokemonData.sprites.front_default && (
              <div className="item-center">
                <img
                  alt="pokemon"
                  src={selectedPokemonData.sprites.front_default}
                  className="modal-img"
                />
                <img
                  alt="pokemon"
                  src={selectedPokemonData.sprites.back_default}
                  className="modal-img"
                />
              </div>
            )}
          <p className="item-center">
            <span className="card">
              Weight is{" "}
              <span className="card_span">{` ${selectedPokemonData.weight}`}</span>
            </span>
          </p>
          <p className="item-center">
            <span className="card">
              Name is{" "}
              <span className="card_span">
                {" "}
                {` ${selectedPokemonData.name}`}{" "}
              </span>
            </span>
          </p>
          <p className="item-center">
            <span className="card">
              Height is{" "}
              <span className="card_span">{selectedPokemonData.height}</span>
            </span>
          </p>
          <p className="item-center">
            <span className="card">
              Base experience is{" "}
              <span className="card_span">
                {" "}
                {` ${selectedPokemonData.base_experience}`}{" "}
              </span>
            </span>
          </p>
          <p className="item-center">
            <span className="card">
              ID is{" "}
              <span className="card_span">{` ${selectedPokemonData.id}`}</span>
            </span>
          </p>

          <div className="item-center">
            <button
              onClick={() => {
                onClickOfCaptured(pokemonDataForCapturingList);
                setShowModal(false);
              }}
              className="captured_button"
            >
              capture
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="view_details_button"
            >
              close
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}

export default App;
