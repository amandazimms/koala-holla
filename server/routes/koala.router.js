const express = require('express');
const koalaRouter = express.Router(); //NOTE!!! - we use koalaRouter.get and koalaRouter.otherthings in this file instead of app.get

// DB CONNECTION
const pool = require('../modules/pool'); //we added 

// GET
koalaRouter.get('/', (req, res) => { //only whack, not whack koalas
  const queryString = `SELECT * FROM koalas ORDER BY id`; 

  pool.query(queryString).then( (results) => { 
    res.send(results.rows);
    console.log('results.rows:', results.rows);

  }).catch( (err) => {
    console.log(err);
    res.sendStatus(500);
  })
});


// POST
koalaRouter.post('/', (req, res)=>{
    console.log('/ post hit:', req.query)
    const queryString = 'INSERT INTO koalas (name, age, gender, ready_for_transfer, notes) VALUES ($1, $2, $3, $4, $5)';
    let values = [req.body.name, req.body.age, req.body.gender, req.body.readyForTransfer, req.body.notes];
    
    pool.query(queryString, values).then((results)=>{
        res.sendStatus(201);
    }).catch((err)=>{
        res.sendStatus(500);
    })  
})

// PUT
koalaRouter.put( '/', ( req, res )=>{
    console.log( '/ update hit:', req.query );
    // res.send( 'back from update' ); (don't send status twice)
    //need to fix this so it reads the field to update from req.query instead of 
    
    //Also, should sanitize (this is the $1, $2 thing as seen in POST above)

    let key = `${Object.keys(req.body)[0]}` //this gets, for example, 'ready_for_transfer' from client PUT's data
    let value = `${req.body[Object.keys(req.body)[0]]}` //this gets, for example, 'true' from client PUT's data

    console.log('key:', key, 'val:', value);

    //todo - if you have multiple edits, loop through req.body to find each key and value to be edited
    const queryString = `UPDATE koalas SET ${key}=${value}
                         WHERE id ='${req.query.id}';`;
    pool.query( queryString ).then( ( results )=>{
        res.sendStatus( 200 ); //Not sure if this the status for an update (maybe 204?)
    }).catch( ( err )=>{
        console.log( err );
        res.sendStatus( 500 );
    })
})

// DELETE
koalaRouter.delete( '/', ( req, res )=>{
    console.log( '/ delete hit: ', req.query );
    const queryString = `DELETE FROM koalas WHERE id='${req.query.id}';`;
    pool.query( queryString ).then( ( results )=>{
        res.sendStatus( 200 );
    }).catch( ( err )=>{
        console.log( err );
        res.sendStatus( 500 );
    })
    
})

module.exports = koalaRouter;