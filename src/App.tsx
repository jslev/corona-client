import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import createClient from "socket.io-client";
import {observable} from "mobx";
import {observer} from "mobx-react";


class Vibes {
  @observable vibes: String[] = [];
}

const vibes = new Vibes();

const App = observer(() => {

  const [client, setClient] = useState<SocketIOClient.Socket>();
  // const [vibes, setVibes] = useState<Vibes>([]);


  const incrementVibes = (vibe: string) => {
    vibes.vibes.push(vibe);
  }

  useEffect(() => {

    const myClient = createClient();

    myClient.on("connect", () => {
      // vibes.push("connected");
      incrementVibes("connect");
      console.log("connected");

      myClient.on("vibes", () => {
        console.log("vibes");
        incrementVibes("good vibes");
      })
    })

    setClient(myClient);
    myClient.send("yolo")

    return () => {
      setClient(undefined);
      myClient.disconnect();
    }
  }, [vibes]);


  const onClick = () => {
    if (client !== undefined) {
      client.emit("vibes");
    }
  } 

  const renderVibes = vibes.vibes.map((vibe, index) => (
    <p key={index}>{vibe}</p>
  ));

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p className="App-logo">
        🦠
        </p>
        <p>
          Corona vibes go here
        </p>
        {renderVibes}
        <button onClick={onClick} >Press to give good vibes</button>
      </header>
    </div>
  );
})

export default App;
