import React, {Component, MouseEvent, ChangeEvent} from 'react';
import { Poll, parsePoll } from './poll';
import { isRecord } from './record';

type DetailsProp = {
    name: string,
    onBackClick: () => void,
};

type DetailsState = {
    now: number,
    poll: Poll | undefined,
    voterName: string,
    optionChosen: string
    voted: boolean,
    error: string
    spanish: boolean

}

export class PollDetails extends Component<DetailsProp, DetailsState> {
    constructor(props: DetailsProp) {
        super(props);

        this.state = {now: Date.now(), poll: undefined, 
                      voterName: "", optionChosen: "", error: "", voted: false, spanish: false};
    }

    componentDidMount = (): void => {
        this.doRefreshClick();
    };

    render = (): JSX.Element => {
        if (this.state.poll === undefined) {
            if (this.state.spanish === false) {
                return <p style = {{color: "purple"}}>Loading poll "{this.props.name}"</p>
            }
            else {
                return <p style = {{color: "purple"}}>Cargando encuesta "{this.props.name}"</p>  
            }
        }
        else {
            if (this.state.poll.endTime <= this.state.now) {
                if (this.state.spanish === false) {
                    const min = (this.state.now - this.state.poll.endTime) / 60 / 1000;
                    return (<div style={{backgroundColor: "pink"}}><h2 style = {{color: "magenta"}}>{this.state.poll.name}</h2>
                    <span style = {{color: "purple"}}>Closed {Math.round(min)} minutes ago.</span>
                    {this.renderCompleted(this.state.poll)}
                    <button type = "button" onClick = {this.doBackClick}>Back</button>
                    <button type = "button" onClick = {this.doRefreshClick}>Refresh</button>
                    <button type = "button" onClick = {this.doSpanishClick}>Espanol</button>
                    {this.renderError()}
                </div>)
                }
                else {
                    const min = (this.state.now - this.state.poll.endTime) / 60 / 1000;
                    return (<div style={{backgroundColor: "pink"}}><h2 style = {{color: "magenta"}}>{this.state.poll.name}</h2>
                    <span style = {{color: "purple"}}>Cerrada {Math.round(min)} hace minutos.</span>
                    {this.renderCompleted(this.state.poll)}
                    <button type = "button" onClick = {this.doBackClick}>Regresa</button>
                    <button type = "button" onClick = {this.doRefreshClick}>Actualiza</button>
                    <button type = "button" onClick = {this.doEnglishClick}>English</button>
                    {this.renderError()}
                </div>)                    
                }
            }
            else if (this.state.voted === true) {
                if (this.state.spanish === false) {
                    const min = (this.state.poll.endTime - this.state.now) / 60 / 1000;
                    return (
                        <div style={{backgroundColor: "pink"}}>
                            <h2 style = {{color: "magenta"}}>{this.state.poll.name}</h2>
                            <span style = {{color: "purple"}}>Closes in {Math.round(min)} minutes...</span>
                            {this.renderOngoing(this.state.poll)}
                            <label htmlFor = "name" style = {{color: "purple"}}>Voter Name:</label>
                            <input id = "name" type= "text" value = {this.state.voterName}
                            onChange = {this.doVoterNameChange}></input>
                            <br/>
                            <button type = "button" onClick = {this.doBackClick}>Back</button>
                            <button type = "button" onClick = {this.doRefreshClick}>Refresh</button>
                            <button type = "button" onClick = {this.doVoteClick}>Vote</button>
                            <button type = "button" onClick = {this.doSpanishClick}>Espanol</button>
                            <br/>
                            <span style = {{color: "purple"}}>Recorded vote of {this.state.voterName} as {this.state.optionChosen}</span>
                        {this.renderError()}
                        </div>
                    )  
                }
                else {
                    const min = (this.state.poll.endTime - this.state.now) / 60 / 1000;
                    return (
                        <div style={{backgroundColor: "pink"}}>
                            <h2 style = {{color: "magenta"}}>{this.state.poll.name}</h2>
                            <span style = {{color: "purple"}}>Cierra en {Math.round(min)} minutos...</span>
                            {this.renderOngoing(this.state.poll)}
                            <label htmlFor = "name" style = {{color: "purple"}}>Nombre del votante:</label>
                            <input id = "name" type= "text" value = {this.state.voterName}
                            onChange = {this.doVoterNameChange}></input>
                            <br/>
                            <button type = "button" onClick = {this.doBackClick}>Regresa</button>
                    <button type = "button" onClick = {this.doRefreshClick}>Actualiza</button>
                            <button type = "button" onClick = {this.doVoteClick}>Vota</button>
                            <button type = "button" onClick = {this.doEnglishClick}>English</button>
                            <br/>
                            <span style = {{color: "purple"}}>Votación registrada de {this.state.voterName} como {this.state.optionChosen}</span>
                        {this.renderError()}
                        </div>
                    )                     
                }              
            }
            else {
                if (this.state.spanish === false) {
                    const min = (this.state.poll.endTime - this.state.now) / 60 / 1000;
                    return (
                        <div style={{backgroundColor: "pink"}}>
                            <h2 style = {{color: "magenta"}}>{this.state.poll.name}</h2>
                            <span style = {{color: "purple"}}>Closes in {Math.round(min)} minutes...</span>
                            {this.renderOngoing(this.state.poll)}
                            <label htmlFor = "name" style = {{color: "purple"}}>Voter Name:</label>
                            <input id = "name" type= "text" value = {this.state.voterName}
                            onChange = {this.doVoterNameChange}></input>
                            <br/>
                            <button type = "button" onClick = {this.doBackClick}>Back</button>
                            <button type = "button" onClick = {this.doRefreshClick}>Refresh</button>
                            <button type = "button" onClick = {this.doVoteClick}>Vote</button>
                            <button type = "button" onClick = {this.doSpanishClick}>Espanol</button>
                        {this.renderError()}
                        </div>
                    )
                }
                else {
                    const min = (this.state.poll.endTime - this.state.now) / 60 / 1000;
                    return (
                        <div style={{backgroundColor: "pink"}}>
                            <h2 style = {{color: "magenta"}}>{this.state.poll.name}</h2>
                            <span style = {{color: "purple"}}>Cierra en {Math.round(min)} minutos...</span>
                            {this.renderOngoing(this.state.poll)}
                            <label htmlFor = "name" style = {{color: "purple"}}>Nombre del votante:</label>
                            <input id = "name" type= "text" value = {this.state.voterName}
                            onChange = {this.doVoterNameChange}></input>
                            <br/>
                            <button type = "button" onClick = {this.doBackClick}>Regresa</button>
                    <button type = "button" onClick = {this.doRefreshClick}>Actualiza</button>
                            <button type = "button" onClick = {this.doVoteClick}>Vota</button>
                            <button type = "button" onClick = {this.doEnglishClick}>English</button>
                            {this.renderError()}
                        </div>
                    )                     
                }
            }
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

    renderCompleted = (poll: Poll): JSX.Element => {
        const votes: number = this.getSum(poll.votes, 0);
        const votesWithPercent: number[] = [];
        for (const vote of poll.votes) {
            if (votes !== 0) {
                votesWithPercent.push(Math.round((vote / votes) * 100));
            }
            else {
                votesWithPercent.push(0);
            }
        }
        const array: number[] = [];
        const finalVotes: JSX.Element[] = [];
        for (const vote of votesWithPercent) {
            const desc = <span style = {{color: "magenta"}}> – {poll.options[array.length]}</span>;
            finalVotes.push(
                <li style = {{color: "purple"}}>{vote}%
                {desc}
                </li>
            )
            array.push(0);
        }
        return <ul>{finalVotes}</ul>;
    }

    getSum = (nums: number[], index: number): number => {
        if (index < 0) {
            return -1;
        }
        else if (index >= nums.length) {
            return -1;
        }
        else if(index + 1 === nums.length) {
            return nums[index];
        }
        else {
            return nums[index] + this.getSum(nums, index + 1);
        }
    }

    renderOngoing = (poll: Poll): JSX.Element => {
        const options: JSX.Element[] = [];
        for (const option of poll.options) {
            options.push (
                <div key ={poll.options.indexOf(option)}>
                    <input type = "radio" id = {option} name = {option} value = {option} checked = {option === this.state.optionChosen} 
                    onChange = {(evt) => this.doOptionChange(evt, option)}/>
                    <label htmlFor = {option} style = {{color: "magenta"}}>{option}</label>
                </div>
            )
        }
        return <ul>{options}</ul>;
    }

    doRefreshClick = (): void => {
        const url = "/api/get?" + "name=" + encodeURIComponent(this.props.name);
        fetch(url).then(this.doGetResp)
            .catch(() => this.doGetError("failed to connect to server"));
    }

    doGetResp = (resp: Response): void => {
        if (resp.status === 200) {
            resp.json().then(this.doGetJson)
                .catch(() => this.doGetError("200 response is not JSON"));
          } else if (resp.status === 400) {
            resp.text().then(this.doGetError)
                .catch(() => this.doGetError("400 response is not text"));
          } else {
            this.doGetError(`bad status code from /api/get: ${resp.status}`);
          }
    };

    doGetJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("bad data from /api/get: not a record", data);
            return;
        }
        const p = parsePoll(data.values);
        if (p === undefined) {
            return;
        }
        else {
           this.setState({poll: p, error: "", voterName: "", optionChosen: "", now: Date.now(), voted: false}) 
        }
    };

    doGetError = (msg: string): void => {
        console.error(`Error fetching /api/get: ${msg}`);
    };


    doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBackClick();  // tell the parent this was clicked
    };

    doOptionChange = (_evt: ChangeEvent<HTMLInputElement>, o: string): void => {
        this.setState({optionChosen: o, error: "", voted: false});
    };

    doVoterNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({voterName: evt.target.value, error: "", voted: false});
    }

    doVoteClick = (): void => {
        if (this.state.poll === undefined) {
            throw new Error("impossible");
        }
        
        if (this.state.voterName.trim().length === 0) {
            if (this.state.spanish === false) {
                this.setState({error: "name field is required"});
                return;
            }
            else {
                this.setState({error: "el campo de nombre es obligatorio"});
                return;                
            }
        }
        if (this.state.optionChosen === "") {
            if (this.state.spanish === false) {
                this.setState({error: "No option was chosen"});
                return;
            }
            else {
                this.setState({error: "no se eligió ninguna opción"});
                return;                
            }
        }

        const args = {name: this.props.name, option: this.state.optionChosen, person: this.state.voterName}; 
        fetch("/api/vote", {
            method: "POST", body: JSON.stringify(args),
            headers: {"Content-Type": "application/json"} })
            .then(this.doVoteResp) 
            .catch(() => this.doVoteError("failed to connect to server"));
    };

    doVoteResp = (res: Response): void => {
        if (res.status === 200) {
            res.json().then(this.doVoteJson) 
                .catch(() => this.doVoteError("200 response is not JSON"));
        }
        else if (res.status === 400) {
            res.text().then(this.doVoteError)
                .catch(() => this.doVoteError("400 response is not a text"));
        }
        else {
            this.doVoteError(`bad status code from /api/Vote: ${res.status}`);
        }
    }

    doVoteJson = (data: unknown): void => {
        if (this.state.poll === undefined)
          throw new Error("impossible");
    
        if (!isRecord(data)) {
          console.error("bad data from /api/bid: not a record", data);
          return;
        }
        this.setState({voted: true});
      };
    
      doVoteError = (msg: string): void => {
        if (msg === "the poll " + "'" + this.props.name + "'" + " has already ended") {
            if (this.state.spanish === false) {
                this.setState({error: "This poll has already ended, please hit refresh to see the results!"});
            }
            else {
                this.setState({error: "Esta encuesta ya finalizó. ¡Presiona actualizar para ver los resultados!"});                
            }
        }
        console.error(`Error fetching /api/bid: ${msg}`);
      };

}