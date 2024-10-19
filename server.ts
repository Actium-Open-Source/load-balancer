import axios from 'axios';
import express, { Request, Response, Express } from 'express'
import ejs from 'ejs';

import { DatabaseSchema, DatabaseHelper } from './database_helper'

const app: Express = express();
const dbHelper: DatabaseHelper = new DatabaseHelper('./nodes.db');

app.use('/static/', express.static('static'));
app.engine('html', ejs.renderFile);
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req: Request, res: Response) => {
    try{
        const resp = await dbHelper.get_all_rows();
        res.render('index.html', {resp: resp});
    } catch (error){
        res.render(String(error));
    }
});


app.get('/new', (req: Request, res: Response): void =>{
    res.render('new.html');
});

app.post('/new', async (req: Request, res: Response)=>{
    const { name, route, enabled } = req.body;

    const NewRow: DatabaseSchema = {
        NodeName: name,
        NodeRoute: route,
        Enabled: enabled
    }

    try{
        const db = await dbHelper.init_database();
        await dbHelper.insert_into_database(db, NewRow);
        await dbHelper.close_database(db);
    } catch(error){
        return res.send(String(error));
    }

    return res.render('new.html');
});

app.listen(5000, ()=>{
    console.log("Load Balancer Started. See the Dashboard on http://localhost:5000.");
});
/*
async function fetchMultipleUrls() {
    try {
        const responses = await Promise.all(urls.map(url => axios.get(url)));
        const data = responses.map(response => response.data);

        // Process data from all API requests
        console.log(data);
    } catch (error) {
        console.error('Error fetching data from one or more URLs:', error);
    }
}

fetchMultipleUrls();
*/