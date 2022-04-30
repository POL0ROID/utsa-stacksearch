import React from 'react';

class Search extends React.Component {
    render() {
        console.log("Hello world");
        return (
            <div style ={{textAlign: 'center'}}>
                <div style={{margin: '4em'}} />
                <h1>StackExchange Analytic Search</h1>
			<p>A data tool to facilitate research of the StackExchange Q&A database, best used to compare patterns between its communities and between queries. <br />
            This database is current up to March 7, 2022 and made available through the Internet Archive under a Creative Commons license (CC-BY-SA).<br />
            As a derivative work, all relevant source code for this tool can be found (here) as required by the license.<br />
            No posts are used directly without attribution. For a more content-centric search, see StackExchange's own search, and consider creating an account to see more than 500 results.</p>
            <div class="form-container">
            	<form class="form">
                	<input type="checkbox" name="isquestion" id="isquestion" value="" /><label>Questions</label><br />
                    Include: <input type="checkbox" name="includesatisfied" id="includesatisfied" value="" /><label>Satisfied</label><input type="checkbox" name="includeunsatisfied" id="includeunsatisfied" value="" /><label>Unsatisfied</label><br />
                    Minimum:<input type="datetime-local" name="datemin" id="includesatisfied" /><label>Date</label><input type="number" name="scoremin" id="scoremin"/><label>Score</label><input type="number" name="viewsmin" id="viewsmin"/><label>Views</label><br />
                    Maximum:<input type="datetime-local" name="datemax" id="datemax"/><label>Date</label><input type="number" name="scoremax" id="scoremax"/><label>Score</label><input type="number" name="viewsmax" id="viewsmax"/><label>Views</label>
                    <hr />
                    <input type="checkbox" name="isanswer" id="isanswer" value="" /><label>Answers</label><br />
                    Include: <input type="checkbox" name="includeaccepted" id="isanswer" value="" /><label>Accepted</label><input type="checkbox" name="includeother" value="" /><label>Other</label><br />
                    Minimum:<input type="datetime-local" name="datemin" id="datemin" /><label>Date</label><input type="number" name="scoremin" id="scoremin"/><label>Score</label><br />
                    Maximum:<input type="datetime-local" name="datemax" id="datemin"/><label>Date</label><input type="number" name="scoremax" id="scoremax"/><label>Score</label><br />

                	<input id="search" type="text" class="input" placeholder="Title" name="title" id="title"/><br />
                    <input id="search" type="text" class="input" placeholder="Body" name="body" id="body"/><br />
                    <input id="search" type="text" class="input" placeholder="Tags" name="tags" id="tags"/>
                </form>
            </div>
            </div>
        )
    }
}

export default Search;