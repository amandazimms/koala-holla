const express = require('express');
const app = express();
const koalaRouter = express.Router();

// DB CONNECTION
const pool = require('../modules/pool');


// GET
app.get('/koalas', (req, res) => {
  const queryString = `SELECT * FROM koalas`; 

  pool.query(queryString).then( (results) => { 
    res.send(results.rows);
    console.log('results.rows:', results.rows);

  }).catch( (err) => {
    console.log(err);
    res.sendStatus(500);
  })
});


// POST
app.post('/koalas', (req, res)=>{
    console.log('/koalas post hit:', req.query)
    const queryString = 'INSERT INTO koalas (name, age, gender, ready_for_transfer, notes) VALUES ($1, $2, $3, $4, $5)';
    pool.query(queryString,values).then((results)=>{
        res.sendStatus(201);
    }).catch((err)=>{
        res.sendStatus(500);
    })  
})

// PUT
app.put( '/koalas', ( req, res )=>{
    console.log( '/koalas update hit:', req.query );
    res.send( 'back from update' );
    //need to fix this so it reads the field to update from req.query????
    const queryString = `UPDATE koalas SET ready_for_transfer = true 
                         WHERE id ='${req.query.id}';`;
    pool.query( queryString ).then( ( results )=>{
        res.sendStatus( 200 ); //Not sure if this the status for an update (maybe 204?)
    }).catch( ( err )=>{
        console.log( err );
        res.sendStatus( 500 );
    })
})

// DELETE
app.delete( '/koalas', ( req, res )=>{
    console.log( '/koalas delete hit: ', req.query );
    const queryString = `DELETE FROM koalas WHERE id='${req.query.id}';`;
    pool.query( queryString ).then( ( results )=>{
        res.sendStatus( 200 );
    }).catchj( ( err )=>{
        console.log( err );
        res.sendStats( 500 );
    })
    
})

module.exports = koalaRouter;