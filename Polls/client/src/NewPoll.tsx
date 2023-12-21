import React, { Component, ChangeEvent, MouseEvent } from 'react';
import { isRecord } from './record'


type NewPollProps = {
    onBackClick: () => void
};

type NewPollState = {
    name: string,
    options: string,
    minutes: string,
    error: string
    spanish: boolean
};

export class NewPoll extends Component<NewPollProps, NewPollState> {
    constructor(props: NewPollProps) {
        super(props);
        this.state = {name: "", options: "", minutes: "10", error: "", spanish: false};
    }

    render = (): JSX.Element => {
        if (this.state.spanish === false) {
            return (<div  style={{backgroundColor: "pink"}}>
                <h1 style = {{color: "magenta"}}>New Poll</h1>
                <label htmlFor = "name" style = {{color: "purple"}}>Name:</label>
                <input id = "name" type= "text" value = {this.state.name}
                    onChange = {this.doNameChange}></input>
                <br/>
                <label htmlFor = "minutes" style = {{color: "purple"}}>Minutes:</label>
                <input id = "minutes" type = "number" min = "1" value = {this.state.minutes}
                    onChange = {this.doMinutesChange}></input>
                <br/>
                <label htmlFor = "textbox" style = {{color: "purple"}}>Options, one per line with a minimum of 2 lines</label>
                <br/>
                <textarea id = "textbox" rows={3} value = {this.state.options}
                    onChange = {this.doOptionsChange}></textarea>
                <br/>
                <button type = "button" onClick = {this.doCreateClick}>Create</button>
                <button type = "button" onClick = {this.doBackClick}>Back</button>
                <button type = "button" onClick = {this.doSpanishClick}>Espanol</button>
                {this.renderError()}
            </div>)
        }
        else {
            return (<div  style={{backgroundColor: "pink"}}>
            <h1 style = {{color: "magenta"}}>Nueva Encuesta</h1>
            <label htmlFor = "name" style = {{color: "purple"}}>Nombre:</label>
            <input id = "name" type= "text" value = {this.state.name}
                onChange = {this.doNameChange}></input>
            <br/>
            <label htmlFor = "minutes" style = {{color: "purple"}}>Minutos:</label>
            <input id = "minutes" type = "number" min = "1" value = {this.state.minutes}
                onChange = {this.doMinutesChange}></input>
            <br/>
            <label htmlFor = "textbox" style = {{color: "purple"}}>Opciones, una por linea con un minimo de 2 lineas</label>
            <br/>
            <textarea id = "textbox" rows={3} value = {this.state.options}
                onChange = {this.doOptionsChange}></textarea>
            <br/>
            <button type = "button" onClick = {this.doCreateClick}>Crea</button>
            <button type = "button" onClick = {this.doBackClick}>Regresa</button>
            <button type = "button" onClick = {this.doEnglishClick}>English</button>
            {this.renderError()}
        </div>)
        }
    }

    doSpanishClick = (): void => {
        this.setState({spanish: true});
    }

    doEnglishClick = (): void => {
        this.setState({spanish: false});
    }

    renderError = (): JSX.Element => {
        if (this.state.error.length === 0) {
          return <div></div>;
        } else {
          const style = {width: '300px', backgroundColor: 'rgb(246,194,192)',
              border: '1px solid rgb(137,66,61)', borderRadius: '5px', padding: '5px' };
          return (<div style={{marginTop: '15px'}}>
              <span style={style}><b>Error</b>: {this.state.error}</span>
            </div>);
        }
    };

    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({name: evt.target.value, error: ""});
    }

    doMinutesChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({minutes: evt.target.value, error: ""});
    }

    doOptionsChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
        this.setState({options: evt.target.value, error: ""});
    }

    doCreateClick = (_: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.name.trim().length === 0 ||
            this.state.minutes.trim().length === 0 ||
            this.state.options.trim().length === 0) {
          if (this.state.spanish === false) {  
            this.setState({error: "a required field is missing."});
            return;
          }
          else {
            this.setState({error: "falta el campo obligatorio"});
            return;            
          }
        }


        const minutes = parseFloat(this.state.minutes);
        if (isNaN(minutes) || minutes < 1 || Math.floor(minutes) !== minutes) {
            if (this.state.spanish === false) {  
                this.setState({error: "minutes is not a positive integer"});
                return;
              }
              else {
                this.setState({error: "Los minutos no son un entero positivo."});
                return;            
              }
        }

        const array = this.state.options.split('\n');
        if (array.length < 2) {
            if (this.state.spanish === false) {  
                this.setState({error: "you should have at least two options"});
                return;
              }
              else {
                this.setState({error: "deberías tener al menos dos opciones"});
                return;            
              }
        }

        //Checking for duplicates in the poll options
        const extraArray: string[] = []
        for (const word of array) {
            if (extraArray.includes(word)) {
                if (this.state.spanish === false) {  
                    this.setState({error: "you have duplicate options in your poll"});
                    return;
                  }
                  else {
                    this.setState({error: "Tienes opciones duplicadas en tu encuesta."});
                    return;            
                  }
            }
            extraArray.push(word);

        }

        const args = { name: this.state.name,
            options: array, minutes: minutes};
        fetch("/api/add", {
            method: "POST", body: JSON.stringify(args),
            headers: {"Content-Type": "application/json"} })
            .then(this.doAddResp)
              .catch(() => this.doAddError("failed to connect to server"));
    };
        
    doAddResp = (resp: Response): void => {
        if (resp.status === 200) {
            resp.json().then(this.doAddJson)
                .catch(() => this.doAddError("200 response is not JSON"));
        } else if (resp.status === 400) {
            resp.text().then(this.doAddError)
                .catch(() => this.doAddError("400 response is not text"));
        } else {
            this.doAddError(`bad status code from /api/add: ${resp.status}`);
        }
    };
        
    doAddJson = (data: unknown): void => {
        if (!isRecord(data)) {
              console.error("bad data from /api/add: not a record", data);
              return;
        }
        
        this.props.onBackClick();  // show the updated list
    };
        
    doAddError = (msg: string): void => {
        if (msg === "poll for " + "'" + this.state.name + "'" + " already exists") {
            if (this.state.spanish === false) {  
                this.setState({error: msg });
              }
              else {
                this.setState({error: "encuesta para " + "'" + this.state.name + "'" + " ya existe"});            
              }
        
        }
        console.error(`Error fetching /api/add: ${msg}`)
    };
        
    doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBackClick();  // tell the parent this was clicked
    };

}
