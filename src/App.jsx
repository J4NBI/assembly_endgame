// Imports
import { useState } from "react";
import { nanoid } from "nanoid";
import { generate, count } from "random-words";

// Import Components
import Header from "./components/Header";
import Status from "./components/Status";
import clsx from "clsx";

// Import Images and JS
import { languages } from "../languages";
import dead from "/images/dead.png";
import { use } from "react";

function App() {

  // STATES
  const [currentWord, setCurrentWord] = useState("hello");
  const [guessedLetters, setGuessedLetters] = useState([""]);
  const [count, setCount] = useState(0)
  const [showImage, setShowImage] = useState(languages);
  const [fails, setFails] = useState(0);

  // VARIABLES
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter));
  const isGameLost = fails === 8;
  
  
  // Save guessed Letter in Array(State) guessedLetters and handle Image
  function handleGuess(event) {
    setCount(prev => prev + 1);
    let letter = event.currentTarget.id.toLowerCase();
    let newFails = fails;

    setGuessedLetters((prev) => {
        if (prev.includes(letter)) {
            return prev;
        } else {
            return [...prev, letter];
        }
    });

    console.log(currentWord.includes(letter));

    if (!currentWord.includes(letter)) {
        newFails += 1; 
    }

    setShowImage(prev => prev.map((item, index) => {
        if (index === fails && !currentWord.includes(letter)) {
            return { ...item, isOn: false };
        } else {
            return item;
        }
    }));

    setFails(newFails);
}

  // Start new Game after click Button

  function handleNewGame(){
    setCurrentWord(generate())
    setGuessedLetters([""])
    setShowImage(prev => prev.map((item) => ({...item, isOn: true}) ))
    setFails(0)
    setCount(0)
  }

  return (
    <>
      <main>
        <Header />
        {isGameWon || isGameLost ? <Status won={isGameWon}/> : null }
        <section className="languages">
          {showImage.map((item) => (
            <img
              key={nanoid()}
              src={item.isOn ? item.src : dead}
              alt={item.title}
              width="80px"
            />
          ))}
        </section>

        <section className="word">
          {currentWord
            .toUpperCase()
            .split("")
            .map((letter) => (
              <h2 id={nanoid()} key={nanoid()}>
                { guessedLetters.includes(letter.toLowerCase()) ? letter : "🤔"}
              </h2>
            ))}
        </section> 

        {isGameWon || isGameLost ? <button onClick={handleNewGame} className="btn-newgame">NEW GAME</button> : null}

        <section className="keyboard">
          {alphabet
            .toUpperCase()
            .split("")
            .map((item) => {
              const inList = guessedLetters.includes(item.toLowerCase());
              const inWord = inList && currentWord.includes(item.toLowerCase());
              const notInWord =
                inList && !currentWord.includes(item.toLowerCase());
              const btnClass = clsx({
                right: inWord,
                wrong: notInWord,
              });
              return (
                <button
                  onClick={handleGuess}
                  className={btnClass}
                  id={item}
                  key={nanoid()}
                >
                  {" "}
                  {item}
                </button>
              );
            })}
        </section>
        
        
      </main>
    </>
  );
}

export default App;
