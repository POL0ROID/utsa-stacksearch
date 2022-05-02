import React from 'react';

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            includequestion: false,
            includesatisfied: false,
            includeunsatisfied: false,
            qdatemin: null,
            qscoremin: "",
            viewsmin: "",
            qdatemax: null,
            qscoremax: "",
            viewsmax: "",
            includeanswer: false,
            includeaccepted: false,
            includeother: false,
            adatemin: null,
            ascoremin: "",
            adatemax: null,
            ascoremax: "",
            title: "",
            body: "",
            tags: "", 
            table: "writers"
        }
    }

    handleChange = (event) => {
        let t = {};
        const target = event.target;
        const value = (target.type === 'checkbox') ? target.checked : target.value;
        t[target.id] = value;
        this.setState( { ...t } );
    }

    handleSubmit = async (event) => {
        alert("Submitted")
        event.preventDefault();            
        const url = 'http://ec2-3-94-209-176.compute-1.amazonaws.com:3001/query'
        // const url = 'localhost:3001/query'
        const options = {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(this.state)
        };
        let res = await fetch(url, options)
            .then(response => console.log(response));
    }


    //hhhandleSubmit = (event) => {
      //fetchQuery(event).then(movies => {
        //movies; // fetched movies
      //});
    //}

    render() {
        console.log("Hello world: " , this.state);
        return (
            <div style ={{textAlign: 'right'}}>
                <div style={{margin: '4em'}} />
                <h1>StackExchange Analytic Search</h1>
			<p>A data tool to facilitate research of the StackExchange Q&A database, best used to compare patterns between its communities and between queries. <br />
            This database is current up to March 7, 2022 and made available through the Internet Archive under a Creative Commons license (CC-BY-SA).<br />
            As a derivative work, all relevant source code for this tool can be found (here) as required by the license.<br />
            No posts are used directly without attribution. For a more content-centric search, see StackExchange's own search, and consider creating an account to see more than 500 results.</p>
            <div class="form-container">
            	<form class="form" onSubmit={this.handleSubmit}>
                	<input type="checkbox" name="includequestion" id="includequestion" value={this.state.isquestion} onChange={this.handleChange}/><label>Questions</label><br />
                    Include:
                     <input type="checkbox" name="includesatisfied" id="includesatisfied" value={this.state.includesatisfied} onChange={this.handleChange}/><label>Satisfied</label>
                     <input type="checkbox" name="includeunsatisfied" id="includeunsatisfied" value={this.state.includeunsatisfied} onChange={this.handleChange}/><label>Unsatisfied</label><br />
                     <label>Minimum Views</label><input type="text" name="viewsmin" id="viewsmin" size="2" value={this.state.viewsmin} onChange={this.handleChange}/><br />
                     <label>Maximum Views</label><input type="text" name="viewsmax" id="viewsmax" size="2" value={this.state.viewsmax} onChange={this.handleChange}/><br />
                     <label>Tags</label><textarea name="tags" id="tags" rows="1" value={this.state.tags} onChange={this.handleChange}/>< br/>
                     <label>Title</label><textarea name="title" id="title" rows="1" value={this.state.title} onChange={this.handleChange}/>< br/>
                    <hr />
                    <input type="checkbox" name="includeanswer" id="includeanswer" value={this.state.includeanswer} onChange={this.handleChange}/><label>Answers</label><br />
                    Include:
                    <input type="checkbox" name="includeaccepted" id="includeaccepted" value={this.state.includeaccepted} onChange={this.handleChange}/><label>Accepted</label>
                    <input type="checkbox" name="includeother" value={this.state.includeother} onChange={this.handleChange}/><label>Other</label><br />
                    <hr />
                    Minimum:<input type="datetime-local" name="datemin" id="adatemin" value={this.state.adatemin} onChange={this.handleChange}/><label>Date </label>
                            <input type="text" name="scoremin" id="ascoremin" size="2" value={this.state.ascoremin} onChange={this.handleChange}/><label>Score</label><br />
                    Maximum:<input type="datetime-local" name="datemax" id="adatemax" value={this.state.adatemax} onChange={this.handleChange}/><label>Date </label>
                            <input type="text" name="scoremax" id="ascoremax" size="2" value={this.state.ascoremax} onChange={this.handleChange}/><label>Score</label><br />
                    <textarea name="body" id="body" rows="4" value={this.state.body} onChange={this.handleChange}/>< br/>
                    <input type="submit" name="submit" id="submit" value="Submit"></input>
                </form>
            </div>
            </div>
        )
    }
}

export default Search;