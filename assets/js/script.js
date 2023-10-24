const openingElement = $('.opening');
const mainElement = $('.main');
const btnStopMusic = $('.btn-music.stop');
const btnPlayMusic = $('.btn-music.play');
const music = document.getElementById('music');
// get name of invited person
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const invitedPerson = urlParams.get('to');

const invitedPersonElement = $('#invited-person');
if(invitedPerson) {
  invitedPersonElement.text(invitedPerson);
}
// end get name of invited person

const listComments = document.getElementsByClassName('list-comments');

mainElement.css( 'display', 'none' );
// btn open invitation
if( window.screen.width <= 768 ) {
  openingElement.css('height', window.screen.height)
}
const btnOpenInvitation = $('.btn-open-invitation');
if( btnOpenInvitation ) {
  btnOpenInvitation.click( function() {
    openingElement.css( 'display', 'none' );
    mainElement.css( 'display', 'block' );
    btnStopMusic.css( 'display', 'inline-block' );
    music.play()
  } );
}
// end btn open invitation
btnStopMusic.on('click', function() {
  btnStopMusic.css('display', 'none')
  btnPlayMusic.css( 'display', 'inline-block' );
  music.pause()
})
btnPlayMusic.on('click', function() {
  btnPlayMusic.css('display', 'none')
  btnStopMusic.css( 'display', 'inline-block' );
  music.play()
})

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, set, get, child, update, remove } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyDLnNwbe-Qku0QrKggu5n7rQd30wHSn73U",
  authDomain: "wedding-eka.firebaseapp.com",
  projectId: "wedding-eka",
  storageBucket: "wedding-eka.appspot.com",
  messagingSenderId: "660964490434",
  appId: "1:660964490434:web:10ed2694a3910bacf0cf5b",
  databaseURL: "https://wedding-eka-default-rtdb.asia-southeast1.firebasedatabase.app"
}
const app = initializeApp(firebaseConfig);
const database = getDatabase();


// btn copy to clipboard
const btnCopyText = $('.btn-copy-text')
if( btnCopyText ) {
    btnCopyText.click( function() {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(this.dataset.account).select();
        document.execCommand("copy");
        $temp.remove();

        toast()
    } )
}

function toast() {
  var x = document.getElementById("toast");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function getComments() {
  const databaseRef = ref(database);
  listComments.innerHTML = '';

  get( child( databaseRef, "comments/" ) )
      .then( (snapshot) => {
          if( snapshot.exists() ) {
              const datas = snapshot.val();
              console.log( datas )
              for (const data in datas) {
                  if (Object.hasOwnProperty.call(datas, data)) {
                      const element = datas[data];
                      
                      const commentCard = `
                          <div class="comment">
                              <img src="assets/images/placeholder-1.png" alt="">
                              <div class="comment-card">
                                  <div class="header font-weight-500">
                                      <p>${element.name}</p>
                                      <p class="badge-state font-weight-600">${element.state}</p>
                                  </div>
                                  <p class="font-weight-500">${element.comment}</p>
                              </div>
                          </div>
                      `;
                      listComments[0].innerHTML += commentCard;
                  }
              }
          }
      } )
}
getComments();

// countdown timer
function countdownTimer() {
  const daysElement = $('#days');
  const hoursElement = $('#hours');
  const minutesElement = $('#minutes');
  const secondsElement = $('#seconds');
  const countdownDate = new Date('Oct 29, 2023 10:00:00').getTime();

  const x = setInterval(function() {
      let now = new Date().getTime();
      let distance = countdownDate - now;

      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      if (days < 10) days = `0${days}`;
      if (hours < 10) hours = `0${hours}`;
      if (minutes < 10) minutes = `0${minutes}`;
      if (seconds < 10) seconds = `0${seconds}`;

      daysElement.text( days );
      hoursElement.text( hours );
      minutesElement.text( minutes );
      secondsElement.text( seconds );

      if( distance < 0 ) {
          clearInterval(x);
      }
  }, 1000);
}
countdownTimer();

$('#btn-form-comment').on("click", function(event) {
  event.preventDefault();

  const id = Date.now();
  const nameInput = $('#name');
  const commentInput = $('#comment');
  const stateInput = $('#state');
  
  set( ref( database, "comments/" + id ), {
      name: nameInput.val(),
      comment: commentInput.val(),
      state: stateInput.val(),
  } )
      .then( (result) => {
          location.reload();
      } )
})
