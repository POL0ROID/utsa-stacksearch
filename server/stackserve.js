const Koa = require('koa');
const Router = require('@koa/router');
const parser = require('koa-bodyparser')
const cors = require('@koa/cors')
const { Pool, Client } = require('pg')

const app = new Koa();
const router = new Router();

router.post("/query", (ctx, next) => {
	const client = new Client({
		user: 'Flamdini',
		host: 'stackpost.crymkd1bcdxk.us-east-1.rds.amazonaws.com',
		database: 'stacks',
		password: '0Mn0mn0m!',
		port: 5432,
	})
	client.connect()
	console.log("SERVER GOT POST REQUEST!");
	console.log("POST BODY", ctx.request.body);
	const jstring = JSON.stringify(ctx.request.body);
	const json = JSON.parse(jstring);
	const query = queryconstruct(json);
	console.log(jstring);
	console.log(json);
	console.log(query);
	client.query(query, (err, res) =>{
		console.log(err, res)
		client.end()
	});
	ctx.body = "post hello paul!!!";
	console.log("CTX", ctx);
	console.log("NEXT", next);
	next(ctx);
})

function queryconstruct(json){
	const titlestring = (json.title != "") ? fieldInjector(json.title.split(" "), "Title", json.includequestion, json.includeanswer) : "";
	const bodystring = (json.body != "") ? fieldInjector(json.body.split(" "), "Body", json.includequestion, json.includeanswer) : "";
	const tagstring = (json.tags != "") ? fieldInjector(json.tags.split(" "), "Tags", json.includequestion, json.includeanswer) : "";
	const viewstring = rangeInjector(json.includequestion, json.includeanswer, json.viewsmin, json.viewsmax);
	const qstring = checkInjector(json.includequestion, json.includesatisfied, json.includeunsatisfied, 1);
	const astring = checkInjector(json.includeanswer, json.includeaccepted, json.includeother, 2);
	const querystring = `SELECT PostTypeId, 
								EXTRACT(YEAR FROM CreationDate), 
								EXTRACT(MONTH FROM CreationDate), 
								ParentOrChild,
								Score,
								ViewCount,
								COUNT(*) 
						FROM ${json.table} 
						WHERE ((${qstring} OR ${astring})
							AND ((CreationDate BETWEEN ${json.datemin} AND ${json.datemax}) 
												OR (${json.datemin} IS NULL AND ${json.datemax} IS NULL) 
												OR (${json.datemin} IS NULL AND ${json.datemax} >= CreationDate) 
												OR (${json.datemax} IS NULL AND ${json.datemin} <= CreationDate)) 
							AND ((Score BETWEEN ${json.scoremin} AND ${json.scoremax}) 
										OR (${json.scoremin} IS NULL AND ${json.scoremax} IS NULL) 
										OR (${json.scoremin} IS NULL AND ${json.scoremax} >= Score) 
										OR (${json.scoremax} IS NULL AND ${json.scoremin} <= Score)) 
							${titlestring}
							${bodystring}
							${tagstring}
							${viewstring})
						GROUP BY
							PostTypeId,
							EXTRACT(YEAR FROM CreationDate),
							EXTRACT(MONTH FROM CreationDate),
							ParentOrChild,
							Score,
							ViewCount;`;
	return querystring;
}

function checkInjector(bool1, bool2, bool3, type){
	let outstring = `(PostTypeId = ${type}`;
	if (bool1 == true){
		if (bool2 == true){
			if (bool3 == false){
				outstring += " AND ParentOrChild IS NOT NULL";
			}
		}
		else{
			if (bool3 == true){
				outstring += " AND ParentOrChild IS NULL";
			}
		}
		outstring += ") ";
	}
	return outstring;
}

function rangeInjector(boolq, boola, min, max){
	let outstring = "";
	if (boolq == true){
		outstring += `AND ( 
			((ViewCount BETWEEN ${min} AND ${max}) 
						OR (${min} IS NULL AND ${max} IS NULL}) 
						OR (${min} IS NULL AND ${max} >= ViewCount) 
						OR (${max} IS NULL AND ${min} <= ViewCount))`;
		if (boola == true){
			outstring += "OR (ViewCount IS NULL) ";
		}
	}
	return outstring;
}

function fieldInjector(textarray, field, boolq, boola){
	let outstring;
	if ((textarray[0] == "") || ((field == "Title" || field == "Tags") && boolq == false && boola == true)){
		outstring = ""
	}
	else{
		outstring = "AND ("
		for(let i = 0; i < textarray.length; i++){
			outstring += `(${field} LIKE '% ` + textarray[i] + " %')";
			if (i+1 != textarray.length){
				outstring += " AND ";
			}
		}
		outstring += ") ";
	}
	return outstring;
};

//app.use(async ctx => {
//	ctx.body = ctx.request.body;
//});

app.use( parser() );
app.use( cors() );
app.use( router.routes() );
console.log("SERVER is RUNNING!");
app.listen(3001);
