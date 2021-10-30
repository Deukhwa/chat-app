const socket = io()

socket.on('message', (msg) => {
  console.log(msg)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault()

  const message = document.querySelector('.textMsg').value

  socket.emit('sendMessage', message, (error) => {
    if (error) {
      return console.log(error)
    }

    console.log('Message delivered')
  })
})

document.querySelector('#send-location').addEventListener('click', (e) => {
  e.preventDefault()
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your brower')
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    socket.emit('sendLocation', { latitude, longitude }, () => {
      console.log('Location shared')
    })
  })
})
