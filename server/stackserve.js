const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors')
const { Pool, Client } = require('pg')
const https = require('https');
const fs = require('fs');

const app = new Koa();
const router = new Router();

router.post("/stackserve.js", (ctx, next) => {
	console.log("Connected?");
	const client = new Client({
		user: 'Flamdini',
		host: 'stackpost.crymkd1bcdxk.us-east-1.rds.amazonaws.com',
		database: 'stacks',
		password: '0Mn0mn0m!',
		port: 5432,
		sslmode: require,
		ssl: {
			rejectUnauthorized: false,
			ca: fs.readFileSync('/home/ec2-user/utsa-stacksearch/server/global-bundle.pem').toString(),
			key: fs.readFileSync('/home/ec2-user/utsa-stacksearch/server/key.pem').toString(),
			cert: fs.readFileSync('/home/ec2-user/utsa-stacksearch/server/cert.pem').toString(),
		}
	})
	client.connect();
	console.log("Connected.");
	const jstring = JSON.stringify(ctx.request.body);
	const json = JSON.parse(jstring);
	const basequery = queryconstruct(json);
	const qandaquery = "SELECT PostTypeId, ParentOrChild, COUNT(*) INTO #MyQuery2 FROM #MyQuery GROUP BY PostTypeId, ParentOrChild;";
	const totalquery = "SELECT PostTypeId, COUNT(*) FROM #MyQuery2 GROUP BY PostTypeId;";
	const viewquery = "SELECT ViewCount, COUNT(*) FROM #MyQuery GROUP BY ViewCount;";
	const scorequery = "SELECT Score, COUNT(*) FROM #MyQuery GROUP BY Score;";
	const datequery = "SELECT year, month, COUNT(*) FROM #MyQuery GROUP BY year, month;";
	result1 = client.query(basequery, (err, res) => {
		console.log(err, res);
	});
	result2 = client.query(qandaquery, (err, res) => {
		console.log(err, res);
	});
	result3 = client.query(totalquery, (err, res) => {
		console.log(err, res);
	});
	result4 = client.query(viewquery, (err, res) => {
		console.log(err, res);
	});
	result5 = client.query(scorequery, (err, res) => {
		console.log(err, res);
	});
	result6 = client.query(datequery, (err, res) => {
		console.log(err, res);
	});
	res7 = "{ " + JSON.stringify(result2) + " " + JSON.stringify(result3) + " " + JSON.stringify(result4) + " " + JSON.stringify(result5) + " " + JSON.stringify(result6) + " }";
	res = JSON.parse(res7);
	app.use(async ctx => {
			ctx.body = res;
		});
	});
	client.end();
	next(ctx);
})

function queryconstruct(json){

	const viewsmin = parseInt(json.viewsmin) || null;
	const viewsmax = parseInt(json.viewsmax) || null;
	const scoremin = parseInt(json.scoremin) || null;
	const scoremax = parseInt(json.scoremax) || null;
	const datemin = json.datemin == "" ? null : json.datemin;
	const datemax = json.datemax == "" ? null : json.datemax;

	const titlestring = (json.title != "") ? fieldInjector(json.title.split(" "), "Title", json.includequestion, json.includeanswer) : "";
	const bodystring = (json.body != "") ? fieldInjector(json.body.split(" "), "Body", json.includequestion, json.includeanswer) : "";
	const tagstring = (json.tags != "") ? fieldInjector(json.tags.split(" "), "Tags", json.includequestion, json.includeanswer) : "";
	const viewstring = rangeInjector(json.includequestion, json.includeanswer, viewsmin, viewsmax);
	const qstring = checkInjector(json.includequestion, json.includesatisfied, json.includeunsatisfied, 1);
	const astring = checkInjector(json.includeanswer, json.includeaccepted, json.includeother, 2);

	let querystring = `SELECT PostTypeId, 
								EXTRACT(YEAR FROM CreationDate) AS year, 
								EXTRACT(MONTH FROM CreationDate) AS month, 
								Id,
								ParentOrChild,
								Score,
								ViewCount,
						INTO #MyQuery 
						FROM ${json.table} 
						WHERE (${qstring} OR ${astring}) 
							AND ((CreationDate BETWEEN ${datemin} AND ${datemax}) 
												OR (${datemin} IS NULL AND ${datemax} IS NULL) 
												OR (${datemin} IS NULL AND ${datemax} >= CreationDate) 
												OR (${datemax} IS NULL AND ${datemin} <= CreationDate)) 
							AND ((Score BETWEEN ${scoremin} AND ${scoremax}) 
										OR (${scoremin} IS NULL AND ${scoremax} IS NULL) 
										OR (${scoremin} IS NULL AND ${scoremax} >= Score) 
										OR (${scoremax} IS NULL AND ${scoremin} <= Score)) 
							${titlestring}
							${bodystring}
							${tagstring}
							${viewstring};`;
	return querystring;
}



function checkInjector(bool1, bool2, bool3, type){
	let outstring = `PostTypeId = ${type}`;
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
			outstring += "OR (ViewCount IS NULL)";
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
			if(field == "Tags"){
				outstring += `(${field} LIKE '%<${textarray[i]}>%')`;
			}
			else{
				outstring += `(${field} LIKE '% ${textarray[i]} %')`;
			}
			if (i+1 != textarray.length){
				outstring += " AND ";
			}
		}
		outstring += ") ";
	}
	return outstring;
};

app.use( cors() );
app.use( router.routes() );
console.log("Server is listening.");
app.listen(3001);
