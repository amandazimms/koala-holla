const express = require('express');
const koalaRouter = express.Router(); //NOTE!!! - we use koalaRouter.get and koalaRouter.otherthings in this file instead of app.get

// DB CONNECTION
const pool = require('../modules/pool'); //we added 


// GET
koalaRouter.get('/', (req, res) => { //only whack, not whack koalas
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
    // res.send( 'back from update' );
    //need to fix this so it reads the field to update from req.query instead of 
    //hard-coding the field (i.e. ready_for_transfer)
    //Also, should sanitize
    console.log('PUT req.body:', req.body);

    //todo - somethign with req.body below after SET?
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
koalaRouter.delete( '/', ( req, res )=>{
    console.log( '/ delete hit: ', req.query );
    const queryString = `DELETE FROM koalas WHERE id='${req.query.id}';`;
    pool.query( queryString ).then( ( results )=>{
        res.sendStatus( 200 );
    }).catchj( ( err )=>{
        console.log( err );
        res.sendStats( 500 );
    })
    
})

module.exports = koalaRouter;