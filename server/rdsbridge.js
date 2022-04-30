const { Pool, Client } = requre('pg')

const pool = new Pool({
    user: 'Flamdini',
    host: 'stackpost.crymkd1bcdxk.us-east-1.rds.amazonaws.com',
    database: 'stacks',
    password: '0Mn0mn0m!',
    port: 5432,
})

pool.quer('SELECT NOW()', (err, res) => {
    console.log(err, res)
    pool.end()
})

const client = new Client({
    user: 'Flamdini',
    host: 'stackpost.crymkd1bcdxk.us-east-1.rds.amazonaws.com',
    database: 'stacks',
    password: '0Mn0mn0m!',
    port: 5432,
})
client.connect()

client.quer('SELECT NOW()', (err, res) =>{
    console.log(err, res)
    client.end()
})