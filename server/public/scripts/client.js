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
  $( '#viewKoalas' ).on( 'click', '.updateName', {param1: 'koala_name'}, updateProperty ); //this param1 thing is a workaround - can't directly pass paramaters with jQuery's on('click')
  $( '#viewKoalas' ).on( 'click', '.updateAge', {param1: 'age'}, updateProperty );
  $( '#viewKoalas' ).on( 'click', '.updateGender', {param1: 'gender'}, updateProperty );
  $( '#viewKoalas' ).on( 'click', '.updateNotes', {param1: 'notes'}, updateProperty );
    $( '#filterByNameInput').on( 'keyup', filterByName );
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
    for(let i=0; i<response.length; i++){ //for all the koalas we got from server, display them on the dom
      let appendString = `<tr>
           <td class='cell' data-id='${response[i].id}'>${response[i].id}</td>
           <td class='cell' id="koalaName">${response[i].koala_name}<button class='updateName editButton' data-id='${response[i].id}'><img class="editButtonImage" src="./images/editIcon.png" alt="Edit"></button></td>
           <td class='cell'>${response[i].age}<button class='updateAge editButton' data-id='${response[i].id}'><img class="editButtonImage" src="./images/editIcon.png" alt="Edit"></button></td>
           <td class='cell'>${response[i].gender}<button class='updateGender editButton' data-id='${response[i].id}'><img class="editButtonImage" src="./images/editIcon.png" alt="Edit"></button></td>
           <td class='cell'>${response[i].ready_for_transfer}</td> 
           <td class='cell'>${response[i].notes}<button class='updateNotes editButton' data-id='${response[i].id}'><img class="editButtonImage" src="./images/editIcon.png" alt="Edit"></button></td>`;
           //if the koala is NOT ready for transfer (value is false), add a 'ready for trasnfer' button so that can be marked
           if ( !response[i].ready_for_transfer ) {
             appendString += `<td class='cell'><button class='readyForTransferButton' data-id='${response[i].id}'>Ready for Transfer</button></td>`;
           } 
           //otherwise, no button is needed, so just add an empty cell
           else {
             appendString += `<td class='cell'></td>`
           }      
           appendString += `<td class='cell'><button class='removeKoalaButton' data-id='${response[i].id}'>Remove</button></td>
           </tr>`;
           //finally, append this string of HTML to the DOM
           viewKoalas.append( appendString );
    }

  }).catch( function (err) {
    console.log('error getting koalas:', err);
    alert('Error getting koalas - see console');
  })
} // end getKoalas

function removeKoala() {
  //makes an ajax call to remove a koala from our DB, then updates the DOM with new list of koalas

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
  // ajax call to server to add a new koala to the DB, with the info from our input fields
  $.ajax({
    method: 'POST',
    url: '/koalas',
    data: newKoala
  }).then(function(response){
      getKoalas();

      //clear out all the input fields
      $('#nameIn').val('');
      $('#ageIn').val('');
      $('#genderIn').val('');
      $('#readyForTransferIn').val('');
      $('#notesIn').val('');
  }).catch(function ( err ){
      alert(`error adding koala`);
      console.log(err);
  })
}

function updateReadyForTransferToTrue() {
  //function that marks a koala as 'ready for transfer' via ajax put call. changes the ready_for_transfer value to true (hardcoded)

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
  //modular function that allows you to update the value of any property. it takes in 'name', 'age', etc. - names of column rows in our table. 
 
  let prop = (propertyToUpdate.data.param1); //this is part of the workaround - allows us to pass a parameter in using the on('click') seen in lines ~28
  console.log( `in updateProperty` );

  let newProp;

  Swal.fire({ //sweet alert which prompts the user for the new, updated property value
    title: `New ${prop}:`,
    input: 'text',
    inputPlaceholder: `Enter New ${prop}`

  }).then((result) =>{ //after the swal closes, move on and do the next thing...
    newProp = result.value;

    //nested try then catch! Pretty cool
    //AJAX put request to update the data in our db
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


  }).catch( function(err) { //this is the .catch of the SWAL
    //note - you don't need a catch here with swal
    console.log('error with sweetAlert new Name:', err);
  })

 
}
function filterByName( ) {
  //When user types a letter in the 'filter by' input element, the keyup event is triggered.
  //The following will hide anything that doesn't have the letters typed in the input box.
  
  //we want to hide the whole row if nothing is found, so point to it
  let rows = $('#koalaTable tbody tr'); 
  //this points to the text in the 'filter' input box
  let val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase().split(' '); 

  rows.hide().filter(function() {
    let koalaNameText = $( this ).children( '#koalaName' )[0].textContent;
    //Get the text in the 'koala name' cell since we are filtering by koala name.
    let text = koalaNameText.replace(/\s+/g, ' ').toLowerCase(); 
    let matchesSearch = true;
    $(val).each(function(index, value) {
      matchesSearch = (!matchesSearch) ? false : ~text.indexOf(value);
    });
    return matchesSearch;
  }).show();
}