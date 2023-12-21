import React, { Component, ChangeEvent, MouseEvent, FormEvent } from "react";
import { solid, split, Path, Square, toJson, fromJson } from './square';
import { Editor } from "./Editor";
import { isRecord } from "./record";


type AppState = {
  // will probably need something here
  fileName?: string;
  created: boolean;  
  savedFiles: string[];
  savedSquare?: Square;

}


export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);

    this.state = {fileName: undefined, created: false, savedFiles: [], savedSquare: undefined};
  }
  
  render = (): JSX.Element => {
    if (this.state.created === false) {
      return (<div>
        <h2>Files</h2>
        {this.renderSavedFiles()}
        <p>Name: </p>
        <input type = "text" value = {this.state.fileName} 
      onChange = {this.doTextChange}></input>
      <button onClick = {this.doCreateClick}>Create</button>
      </div>)

    }
    else if (this.state.savedSquare !== undefined && this.state.fileName !== undefined && 
              this.state.savedFiles.includes(this.state.fileName)) {
      return <Editor initialState={this.state.savedSquare} saved = {this.doSaveClick} back = {this.doBackClick}/>
    }

    else {
    const sq = split(solid("blue"), solid("orange"), solid("purple"), solid("red"));
    return <Editor initialState={sq} saved = {this.doSaveClick} back = {this.doBackClick}/>
    }
  };

  doSquareClick = (path: Path): void => {
    console.log(path);
    alert("Stop that!");
  };

  doTextChange = (_evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({fileName: _evt.target.value});
  }


  doCreateClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.setState({created: true});
  };

  doSaveClick = (sq: Square): void => {
    const args = {name: this.state.fileName, value: toJson(sq)};
    fetch("/api/save", {method: "POST",
      body: JSON.stringify(args),
      headers: {"Content-Type": "application/json"}})
      .then(this.doSaveResp)
      .catch(() => this.doSaveError("failed to connect"))
  }


  doSaveResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doSaveJson)
      .catch(() => this.doSaveError("200 response is not JSON"));
    } 
    else if (res.status === 400) {
      res.text().then(this.doSaveError)
      .catch(() => this.doSaveError("400 response is not text"));
    } 
    else {
      this.doSaveError(`bad status code ${res.status}`);
    }
  };

  doSaveError = (msg: string): void => {
    console.error(`Error fetching /api/save: ${msg}`);
  };

  doSaveJson = (data: unknown): void => {
    if(!isRecord(data)) {
      console.error("not a record", data);
      return;
    }
    const url = "/api/names?" 
    fetch(url)
      .then(this.doNamesResp)
      .catch(() => this.doNamesError("failed to connect"))

  };

   doNamesResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doNamesJson)
      .catch(() => this.doNamesError("200 response is not JSON"));
    }
    else if (res.status === 400) {
      res.text().then(this.doNamesError)
      .catch(() => this.doNamesError("400 response is not text"));
    }
    else {
      this.doNamesError(`bad status code ${res.status}`);
    }
  };

  doNamesError = (msg: string): void => {
    console.error(`Error fetching /api/names: ${msg}`);
  };

  doNamesJson = (data: unknown): void => {
    if(!isRecord(data)) {
      console.error("not a record", data);
      return;
    }
    if(!Array.isArray(data.value)) {
      console.error("not an array", data);
      return;
    }
    this.setState({savedFiles: data.value});
  }

  doBackClick = (): void => {
    this.setState({created: false});
    this.setState({fileName: undefined});
  };

  renderSavedFiles = (): JSX.Element[] => {
    const files: JSX.Element[] = [];
    for (let file of this.state.savedFiles) {
      files.push(
        <div > 
          <li onClick = {(evt) => this.doLoadClick(evt, file)}><a href="#">{file}</a></li>
        </div>
      )
    }
    return files;
  }

  doLoadClick = (_evt: FormEvent<HTMLLIElement>, f:string): void => {
    const url = "/api/load?" +
    "name=" + encodeURIComponent(f);
    fetch(url)
    .then(this.doLoadResp)
    .catch(() => this.doLoadError("failed to connect"))
    this.setState({fileName: f});
  }

  doLoadResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doLoadJson)
      .catch(() => this.doLoadError("200 response is not JSON"));
    } 
    else if (res.status === 400) {
      res.text().then(this.doLoadError)
      .catch(() => this.doLoadError("400 response is not text"));
    } 
    else {
      this.doLoadError(`bad status code ${res.status}`);
    }
  };

  doLoadError = (msg: string): void => {
    console.error(`Error fetching /api/load?: ${msg}`);
  };

  doLoadJson = (data: unknown): void => {
    if(!isRecord(data)) {
      console.error("not a record", data);
      return;
    }
    const s:Square = fromJson(data.value);
    this.setState({created: true, savedSquare: s});
  }
}
