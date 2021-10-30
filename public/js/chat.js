const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector(
  '#location-message-template'
).innerHTML

socket.on('message', (message) => {
  console.log(message)
  const html = Mustache.render(messageTemplate, {
    message,
  })
  $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (url) => {
  console.log(url)
  const html = Mustache.render(locationMessageTemplate, {
    url,
  })
  $messages.insertAdjacentHTML('afterbegin', html)
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  $messageFormButton.setAttribute('disabled', 'disabled')
  // disable
  const message = document.querySelector('.textMsg').value

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

    // enable
    if (error) {
      return console.log(error)
    }

    console.log('Message delivered')
  })
})

$sendLocationButton.addEventListener('click', (e) => {
  e.preventDefault()

  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your brower')
  }

  $sendLocationButton.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    socket.emit('sendLocation', { latitude, longitude }, () => {
      console.log('Location shared')
      $sendLocationButton.removeAttribute('disabled')
    })
  })
})
