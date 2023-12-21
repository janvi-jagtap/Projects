import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Square, Path, replace, findNode, split, Color, solid, rotateSquare } from './square';
import { SquareElem } from "./square_draw";
import { prefix, len } from "./list";


type EditorProps = {
  /** Initial state of the file. */
  initialState: Square;
  saved: (square: Square) => void;
  back: () => void;
};


type EditorState = {
  /** The root square of all squares in the design */
  root: Square;

  /** Path to the square that is currently clicked on, if any */
  selected?: Path;

  /** The color of the square that is currently clicked on, if any */
  color?: string;
};


/** UI for editing the image. */
export class Editor extends Component<EditorProps, EditorState> {

  constructor(props: EditorProps) {
    super(props);

    this.state = { root: props.initialState };
  }

  render = (): JSX.Element => {
    // TODO: add some editing tools here
    if (this.state.selected !== undefined) {
      return (<div> <h2>Tools</h2>
                    <button onClick = {this.doSplitClick}>Split</button> 
                    <button onClick = {this.doMergeClick}>Merge</button>
                    <button onClick = {this.doSaveClick}>Save</button>
                    <button onClick = {this.doBackClick}>Back</button>
                    <select value = {this.state.color} onChange = {this.doColorChange}>
                      <option value = "white">white</option>
                      <option value = "red">red</option>
                      <option value = "orange">orange</option>
                      <option value = "yellow">yellow</option>
                      <option value = "green">green</option>
                      <option value = "blue">blue</option>
                      <option value = "purple">purple</option>
                    </select>
                      <SquareElem width={600} height={600}
                        square={this.state.root} selected={this.state.selected}
                        onClick={this.doSquareClick}></SquareElem> 
                        </div>);
    }
    else {
      return(<div>  <h2>Tools</h2>
                    <button onClick = {this.doRotateClick}>Rotate</button>
                    <button onClick = {this.doSaveClick}>Save</button>
                    <button onClick = {this.doBackClick}>Back</button>
                      <SquareElem width={600} height={600}
                        square={this.state.root} selected={this.state.selected}
                        onClick={this.doSquareClick}></SquareElem> 
      </div>);
    }
  };

  doSquareClick = (path: Path): void => {
    this.setState({selected: path});
      const s: Square|undefined = findNode(this.state.root, path);
      if (s !== undefined && s.kind === "solid") {
        this.setState({color: s.color});
    }
  }

  doSplitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.selected !== undefined) {
      const sq: Square|undefined = findNode(this.state.root, this.state.selected)
      if (sq !== undefined && sq.kind === "solid") {
        const c: Color = sq.color;
        const rep: Square = split(solid(c), solid(c), solid(c), solid(c));
        const res: Square = replace(this.state.root, this.state.selected, rep);
        this.setState({root: res, selected: undefined});
      }
    }
  };

  doMergeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.selected !== undefined) {
      const sq: Square|undefined = findNode(this.state.root, this.state.selected)
      if (sq !== undefined && sq.kind === "solid") {
        const c: Color = sq.color;
        const rep: Square = solid(c);
        const parentPath: Path = prefix(len(this.state.selected) - 1, this.state.selected);
        const res: Square = replace(this.state.root, parentPath, rep);
        this.setState({root: res, selected: undefined});
      }
    }
  };

  doColorChange = (_evt: ChangeEvent<HTMLSelectElement>): void => {
    if (_evt.target.value === "green") {
      const coloredSquare: Square = solid("green");
      if (this.state.selected !== undefined) {
        this.setState({root: replace(this.state.root, this.state.selected, coloredSquare), selected: undefined, color: "green"});
      }
    }
    else if (_evt.target.value === "white") {
      const coloredSquare: Square = solid("white");
      if (this.state.selected !== undefined) {
        this.setState({root: replace(this.state.root, this.state.selected, coloredSquare), selected: undefined, color: "white"});
      }
    }
    else if (_evt.target.value === "red") {
      const coloredSquare: Square = solid("red");
      if (this.state.selected !== undefined) {
        this.setState({root: replace(this.state.root, this.state.selected, coloredSquare), selected: undefined, color: "red"});
      }
    }
    else if (_evt.target.value === "orange") {
      const coloredSquare: Square = solid("orange");
      if (this.state.selected !== undefined) {
        this.setState({root: replace(this.state.root, this.state.selected, coloredSquare), selected: undefined, color: "orange"});
      }
    }
    else if (_evt.target.value === "yellow") {
      const coloredSquare: Square = solid("yellow");
      if (this.state.selected !== undefined) {
        this.setState({root: replace(this.state.root, this.state.selected, coloredSquare), selected: undefined, color: "yellow"});
      }
    }
    else if (_evt.target.value === "blue") {
      const coloredSquare: Square = solid("blue");
      if (this.state.selected !== undefined) {
        this.setState({root: replace(this.state.root, this.state.selected, coloredSquare), selected: undefined, color: "blue"});
      }
    }
    else if (_evt.target.value === "purple") {
      const coloredSquare: Square = solid("purple");
      if (this.state.selected !== undefined) {
        this.setState({root: replace(this.state.root, this.state.selected, coloredSquare), selected: undefined, color: "purple"});
      }
    }
    else if (_evt.target.value === "white") {
      const coloredSquare: Square = solid("white");
      if (this.state.selected !== undefined) {
        this.setState({root: replace(this.state.root, this.state.selected, coloredSquare), selected: undefined, color: "white"});
      }
    }
  };

  doSaveClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.saved(this.state.root);
  };

  doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.back();
  };

  doRotateClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const rotatedSquare: Square = rotateSquare(this.state.root);
    this.setState({root: rotatedSquare});
  }

  
}
