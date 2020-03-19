import React, { Component } from 'react';
import ReactDOM from 'react-dom';
window.ListToJump = [];
window.ListsInBatch = [];
window.ListsForDisplay = [];

export class Home extends Component {
    static displayName = Home.name;

    displayResult(solution) {
        window.ListsForDisplay = window.ListsInBatch.map((o, i) => { return { 'original': o, 'result': solution[i] }; });
        window.ListsInBatch = [];
        var resultElement = document.getElementById('result');
        ReactDOM.unmountComponentAtNode(resultElement);
        ReactDOM.render(<AllResults results={window.ListsForDisplay} />, resultElement);
    };

    dialButtonClick(e) {
        e.preventDefault();
        var listToJumpElement = document.getElementById('listToJump');
        console.log(e);
        var val = e.target.innerText;
        var digit = parseInt(val);
        if (isNaN(digit)) {
            if (val === "Delete") {
                window.ListToJump.pop()
            }
            else {
                if (window.ListToJump.length > 0) {
                    window.ListsInBatch.push(window.ListToJump);
                }
                window.ListToJump = [];
                if (val === "Add to Batch") {
                    debugger;
                    var listsInBatchContainer = document.getElementById('ListsInBatchContainer');
                    ReactDOM.unmountComponentAtNode(listsInBatchContainer)
                    ReactDOM.render(<ListsInBatch lists={window.ListsInBatch} />, listsInBatchContainer);
                }
                else {
                    var solution = [];
                    if (localStorage.getItem(JSON.stringify(window.ListsInBatch))) {
                        solution = JSON.parse(localStorage.getItem(JSON.stringify(window.ListsInBatch)));
                        this.displayResult(solution);
                    } else {
                        fetch("https://localhost:44330/jumper", {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(window.ListsInBatch)
                        })
                            .then(res => {
                                return res.json();
                            }).catch((error) => {
                                console.log(error);
                                document.getElementsByTagName('h1')[0].style.color = "#FF0000";
                            })
                            .then(
                                (result) => {
                                    solution = result;
                                    localStorage.setItem(JSON.stringify(window.ListsInBatch), JSON.stringify(solution));
                                    this.displayResult(solution);
                                });
                    }
                }
            }
        } else {
            window.ListToJump.push(digit);
        }
        listToJumpElement.value = window.ListToJump.toString();
    }
    render() {
        return (
            <div>
                <h1>You need to point fetch API to correct port (in Home.js)</h1>
                <div id="result"></div>
                <div id="ListsInBatchContainer">
                    <ListsInBatch lists={window.ListsInBatch} />
                </div>
                <ListToJump value={window.ListToJump} />

                <div className="buttonPad">
                    <div className="dialButton" onClick={e => this.dialButtonClick(e)}>1</div>
                    <div className="dialButton" onClick={e => this.dialButtonClick(e)}>2</div>
                    <div className="dialButton" onClick={e => this.dialButtonClick(e)}>3</div>
                    <div className="dialButton" onClick={e => this.dialButtonClick(e)}>4</div>
                    <div className="dialButton" onClick={e => this.dialButtonClick(e)}>5</div>
                    <div className="dialButton" onClick={e => this.dialButtonClick(e)}>6</div>
                    <div className="dialButton" onClick={e => this.dialButtonClick(e)}>7</div>
                    <div className="dialButton" onClick={e => this.dialButtonClick(e)}>8</div>
                    <div className="dialButton" onClick={e => this.dialButtonClick(e)}>9</div>
                    <div className="dialButton" onClick={e => this.dialButtonClick(e)}>Send</div>
                    <div className="dialButton" onClick={e => this.dialButtonClick(e)}>0</div>
                    <div className="dialButton" onClick={e => this.dialButtonClick(e)}>Delete</div>
                    <div className="dialButton dialButton-last" onClick={e => this.dialButtonClick(e)}>Add to Batch</div>
                </div>

            </div>
        );
    }
}

class ListsInBatch extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.lists
    };

    render() {
        return (
            <div>
                <div style={{ display: this.state.length > 0 ? "block" : "none" }}>
                    Lists ready for batch processing
        </div>
                <div id="listsInBatch">{JSON.stringify(this.state)}</div>
            </div >
        )
    };
}

class ListToJump extends Component {
    render() {
        return (<input type="text" className="input" id="listToJump" ></input>);
    };
}

class AllResults extends Component {
    render() {
        return (<div>
            {this.props.results.map(o => { return (o.result === null ? ("Non traversable") : (<BoldedLine lineData={o} />)); })}
            </div>)
    };
}

class BoldedLine extends Component {
    render() {
        return (<div>
            {this.props.lineData.original.map((o, i) => {
                if (this.props.lineData.result.indexOf(i) > -1) {
                    return (<span><b>{o}</b></span>);
                }
                else {
                    return (<span>{o}</span>);
                }
            })}
        </div>);
    };
}

