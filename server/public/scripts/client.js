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
    // NOT WORKING YET :(
    // using a test object
    let koalaToSend = {
      name: 'testName',
      age: 'testName',
      gender: 'testName',
      readyForTransfer: 'testName',
      notes: 'testName',
    };
    // call saveKoala with the new obejct
    saveKoala( koalaToSend );
  }); 
  $( '#viewKoalas').on('click', '.removeKoalaButton', removeKoala);
  $( '#viewKoalas' ).on( 'click', '.readyForTransferButton', readyForTransfer );//Capture click event of 
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
        `<tr>
          <td data-id='${response[i].id}'>${response[i].id}</td>
          <td>${response[i].name}</td>
          <td>${response[i].age}</td>
          <td>${response[i].gender}</td>
          <td>${response[i].ready_for_transfer}</td> 
          <td>${response[i].notes}</td>
          <td><button class='readyForTransferButton' data-id='${response[i].id}'>Ready for Transfer</button></td>
          <td><button class='removeKoalaButton' data-id='${response[i].id}'>Remove</button></td>
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
    
  }).catch( function ( err ){
    console.log ( err );
    alert('Oops! There was an error with your delete. Check Console for details.');
  });
  
}// end removeKoala


// function addPassenger () {
//   // get user input & store in an object
//   let objectToSend = {
//       firstName:  $( '#firstNameIn' ).val(),
//       lastName: $( '#lastNameIn' ).val() 
//   }

//   $.ajax({
//       method: 'POST',
//       url: '/passengers',
//       data: objectToSend // must have data to send in a POST
//   }).then( function( response ){
//       // if successful, update DOM
//       getPassengers();
//       $( '#firstNameIn' ).val('');
//       $( '#lastNameIn' ).val('');
//   }).catch( function( err ){
//       // catch any errors
//       alert( 'error adding passenger' );
//       console.log( err );
//   })
// }
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
function readyForTransfer() {
  console.log( `in readyForTransfer` );
  $.ajax({
    method: 'PUT',
    url: '/koalas?id=' + $( this ).data( 'id' ),//telling server which record to update
    data: 'ready_for_transfer=true'
  }).then( function( response ){
    console.log( `back from update:`, response );
  }).catch( function( err ){
    alert( `error with update `);
    console.log( err );
  })
}