var socket = io(`http://${IP}:${PORT}`);

socket.on("connect", function() {
  const publicKey = localStorage.getItem("_PUBLIC_KEY_");
  socket.emit(THIS_IS_MY_PUBLIC_KEY, publicKey);
  socket.on(THIS_IS_MY_PUBLIC_KEY, data => {
    AsymmetricCryptography.setReceiverPublicKey(data);
    HybridCryptography.setReceiverPublicKey(data);
  });
});
