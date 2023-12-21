import React, { Component} from "react";
import { NewPoll } from "./NewPoll";
import { PollList } from "./PollList";
import { PollDetails } from "./PollDetails";



// TODO: When you're ready to get started, you can remove all the code below and
// start with this blank application:
//
type Page = "list" | "new" | {kind: "details", name: string};

type PollsAppState = {page: Page}; 


/** Displays the UI of the Polls application. */
export class PollsApp extends Component<{}, PollsAppState> {

  constructor(props: {}) {
    super(props);
    this.state = {page: "list"};
  }
  
  render = (): JSX.Element => {
    if (this.state.page === "new") {
    return <NewPoll onBackClick={this.doBackClick}/>;
    }
    else if (this.state.page === "list"){
      return <PollList onNewClick={this.doNewClick}
                        onPollClick={this.doPollClick}/>;
    }
    else {
      return <PollDetails name = {this.state.page.name}
                          onBackClick={this.doBackClick}/>;
    }
  }
;

  doNewClick = (): void => {
    this.setState({page: "new"});
  }

  doPollClick = (name: string): void => {
    this.setState({page: {kind: "details", name}});
  }

  doBackClick = (): void => {
    this.setState({page: "list"});
  }
  }


