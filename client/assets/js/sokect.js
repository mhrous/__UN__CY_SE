var socket = io("http://localhost:4000");
socket.on("connect", function() {});
socket.emit ('player move', {map: 4, coords: '0.0'});
socket.on("news", function(data) {
  console.log(data);
});
socket.on("disconnect", function() {});
