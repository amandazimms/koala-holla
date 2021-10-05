console.log( 'js' );

$( document ).ready( function(){
  console.log( 'JQ' );
  // Establish Click Listeners
  setupClickListeners()
  // load existing koalas on page load
  getKoalas();

}); // end doc ready

function setupClickListeners() {
  $( '#addButton' ).on( 'click', function(){
    console.log( 'in addButton on click' );
    // get user input and put in an object
    let koalaToSend = {
      name:  $( '#nameIn' ).val(),
      age: $( '#ageIn' ).val(),
      gender: $( '#genderIn' ).val(), 
      readyForTransfer: $( '#readyForTransferIn' ).val(), 
      notes: $( '#notesIn' ).val(), 
    };
    // call saveKoala with the new obejct
    saveKoala( koalaToSend );
  }); 
  $( '#viewKoalas' ).on( 'click', '.removeKoalaButton', removeKoala);
  $( '#viewKoalas' ).on( 'click', '.readyForTransferButton', updateReadyForTransferToTrue );//Capture click event of 
  $( '#viewKoalas' ).on( 'click', '.updateName', {param1: 'name'}, updateProperty ); //this param1 thing is a workaround - can't directly pass paramaters with jQuery's on('click')
  $( '#viewKoalas' ).on( 'click', '.updateAge', {param1: 'age'}, updateProperty );
  //todo - follow similar logic for other update buttons - update gender, etc. 

}

function getKoalas(){
  console.log( 'in getKoalas' );
  // ajax call to server to get koalas
  
  $.ajax({
    method: 'GET',
    url: '/koalas'

  }).then (function(response) {
    console.log('response:', response);
    let viewKoalas = $('#viewKoalas');
    viewKoalas.empty();
    for(let i=0; i<response.length; i++){
      viewKoalas.append( 
        //todo - name and age cells now have 'edit' buttons - other fields also need these buttons. 
        //stretch todo - change buttons to pencil icons. 
        //super stretch todo - make pencil icons only appear on hover 
        `<tr>
          <td data-id='${response[i].id}'>${response[i].id}</td>
          <td>${response[i].name}<button class='updateName' data-id='${response[i].id}'>Edit</button></td>
          <td>${response[i].age}<button class='updateAge' data-id='${response[i].id}'>Edit</button></td>
          <td>${response[i].gender}</td>
          <td>${response[i].ready_for_transfer}</td> 
          <td>${response[i].notes}</td>
          <td><button class='readyForTransferButton' data-id='${response[i].id}'>Ready for Transfer</button></td>
          <td><button class='removeKoalaButton' data-id='${response[i].id}'>Remove</button></td>
          <td><button class='updateInfoButton' data-id='${response[i].id}'>Update</button></td>
        </tr>`
      );
    }

  }).catch( function (err) {
    console.log('error getting koalas:', err);
    alert('Error getting koalas - see console');
  })
} // end getKoalas

function removeKoala() {
  console.log( 'in removeKoala:', $(this).data('id'));
  let koalaToRemove = $(this).data('id');

  $.ajax({
    method: 'DELETE',
    url: '/koalas?id=' + koalaToRemove
  }).then ( function ( response ){
    console.log ( 'remove Koala:', response);
    getKoalas();
    
  }).catch( function ( err ){
    console.log ( err );
    alert('Oops! There was an error with your delete. Check Console for details.');
  });
  
}// end removeKoala


function saveKoala( newKoala ){
  console.log( 'in saveKoala', newKoala );
  // ajax call to server to get koalas
  $.ajax({
    method: 'POST',
    url: '/koalas',
    data: newKoala
  }).then(function(response){
    getKoalas();

  }).catch(function ( err ){
      alert(`error adding koala`);
      console.log(err);
  })
}
//Update koala ready for transfer
function updateReadyForTransferToTrue() {
  console.log( `in readyForTransfer` );
  $.ajax({
    method: 'PUT',
    url: '/koalas?id=' + $( this ).data( 'id' ),//telling server which record to update
    data: 'ready_for_transfer=true'
  }).then( function( response ){
    console.log( `back from update:`, response );
    getKoalas();
  }).catch( function( err ){
    alert( `error with update `);
    console.log( err );
  })
}


async function updateProperty(propertyToUpdate) {
  //modular function that allows you to update any property. it takes in 'name', 'age', etc. - names of column rows in our table. 
 
  let prop = (propertyToUpdate.data.param1); //this is part of the workaround - allows us to pass a parameter in using the on('click') seen in lines ~28
  console.log ('prop is', prop);

  console.log( `in updateProperty` );

  let newProp;

  Swal.fire({
    title: `New ${prop}:`,
    input: 'text',
    inputPlaceholder: `Enter New ${prop}`
  }).then((result) =>{
    newProp = result.value;

    $.ajax({
      method: 'PUT',
      url: '/koalas?id=' + $( this ).data( 'id' ),//telling server which record to update
      data: `${prop}='${newProp}'`
    }).then( function( response ){
      console.log( `back from update:`, response );
      getKoalas();
    }).catch( function( err ){
      alert( `error with update `);
      console.log( err );
    })


  }).catch( function(err) {
    console.log('error with sweetAlert new Name:', err);
  })

 
}