import React, { Component, MouseEvent } from 'react';
import { Poll, parsePoll } from './poll';
import { isRecord } from './record';

type ListProps = {
    onNewClick: () => void,
    onPollClick: (name: string) => void
};

type ListState = {
    now: number,
    openPolls: Poll[] | undefined,
    closedPolls: Poll[] | undefined,
    spanish: boolean
};

export class PollList extends Component<ListProps, ListState> {

    constructor(props: ListProps) {
        super(props);
        this.state = {now: Date.now(), openPolls: undefined, closedPolls: undefined, spanish: false};
    }

    componentDidMount = (): void => {
        this.doRefreshClick();
    }

    componentDidUpdate = (prevProps: ListProps): void => {
        if (prevProps !== this.props) {
            this.setState({now: Date.now()});
        }
    };

    render = (): JSX.Element => {
        if (this.state.spanish === false) {
            return (
                <div style={{backgroundColor: "purple"}}>
                    <h1 style = {{color: "magenta"}}>Current Polls</h1> 
                    <h2 style = {{color: "pink"}}>Still Open</h2>
                    {this.renderOpenPolls()}
                    <h2 style = {{color: "pink"}}>Closed</h2>
                    {this.renderClosedPolls()} 
                    <button type = "button" onClick = {this.doRefreshClick}>Refresh</button>
                    <button type = "button" onClick = {this.doNewClick}>New Poll</button>
                    <button type = "button" onClick = {this.doSpanishClick}>Espanol</button>
                </div>
            )
        }
        else {
            return (
                <div style={{backgroundColor: "purple"}}>
                    <h1 style = {{color: "magenta"}}>Encuestas actuales</h1> 
                    <h2 style = {{color: "pink"}}>Todavia abierta</h2>
                    {this.renderOpenPolls()}
                    <h2 style = {{color: "pink"}}>Cerrada</h2>
                    {this.renderClosedPolls()} 
                    <button type = "button" onClick = {this.doRefreshClick}>Actualiza</button>
                    <button type = "button" onClick = {this.doNewClick}>Nueva Encuesta</button>
                    <button type = "button" onClick = {this.doEnglishClick}>English</button>
                </div>
            )
        }
    }

    doSpanishClick = (): void => {
        this.setState({spanish: true});
    }

    doEnglishClick = (): void => {
        this.setState({spanish: false});
    }

    renderOpenPolls = (): JSX.Element => {
        if (this.state.openPolls === undefined) {
            if (this.state.spanish === false) {
                return <p style = {{color: "white"}}>Loading poll list...</p>
            }
            else {
                return <p style = {{color: "white"}}>Cargando lista de encuestas...</p>
            }
        }
        else {
            const polls: JSX.Element[] = [];
            for (const poll of this.state.openPolls) {
                const min = (poll.endTime - this.state.now) / 60 / 1000;
                const desc = (min < 0) ? "" : (this.state.spanish === false)?
                    <span style = {{color: "white"}}> – {Math.round(min)} minutes remaining</span>:
                    <span style = {{color: "white"}}> – {Math.round(min)} minutos restantes</span>
                polls.push(
                    <li key = {poll.name}>
                        <a href = "#" onClick = {(evt) => this.doPollClick(evt, poll.name)} style = {{color: "white"}}>{poll.name}</a>
                        {desc}
                    </li>);
            }
            return <ul>{polls}</ul>
        }
    }

    renderClosedPolls = (): JSX.Element => {
        if (this.state.closedPolls === undefined) {
            return <p>Loading poll list...</p>
        }
        else {
            const polls: JSX.Element[] = [];
            for (const poll of this.state.closedPolls) {
                const min = (this.state.now - poll.endTime) / 60 / 1000;
                const desc = (this.state.spanish === false)?
                <span style = {{color: "white"}}> – closed {Math.round(min)} minutes ago</span>:
                <span style = {{color: "white"}}> – cerrada {Math.round(min)} hace minutos</span>
                polls.push(
                    <li key = {poll.name}>
                        <a href = "#" onClick = {(evt) => this.doPollClick(evt, poll.name)} style = {{color: "white"}}>{poll.name}</a>
                        {desc}
                    </li>);
            }
            return <ul>{polls}</ul>
        }
    }

    doRefreshClick = (): void => {
        fetch("/api/list").then(this.doListResp)
            .catch(() => this.doListError("failed to connect to server"));
    };

    doListResp =  (resp: Response): void => {
        if (resp.status === 200) {
            resp.json().then(this.doListJson)
                .catch(() => this.doListError("200 response is not JSON"));
          } else if (resp.status === 400) {
            resp.text().then(this.doListError)
                .catch(() => this.doListError("400 response is not text"));
          } else {
            this.doListError(`bad status code from /api/list: ${resp.status}`);
          }   
    }

    doListJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("bad data from /api/list: not a record", data);
            return;
        }
    
          if (!Array.isArray(data.values)) {
            console.error("bad data from /api/list: polls is not an array", data);
            return;
          }
      
          const pollsO: Poll[] = [];
          const pollsC: Poll[] = [];
          for (const val of data.values) {
            const poll = parsePoll(val)
            if (poll === undefined) {
              return;
            }
            else {
                if (((poll.endTime - this.state.now) / 60 / 1000) <= 0) {
                    pollsC.push(poll);
                }
                else {
                    pollsO.push(poll)
                }
            }
          }
          this.setState({openPolls: pollsO, closedPolls: pollsC, now: Date.now()});
          
    }

    doListError = (msg: string): void => {
        console.error(`Error fetching /api/list: ${msg}`);
      };


    doNewClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onNewClick(); 
      };

    doPollClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
        evt.preventDefault();
        this.props.onPollClick(name);
    }

    

}