var socket = io(`http://${IP}:${PORT}`, {
  query: { type: "user" }
});

socket.on("connect", function() {
  const publicKey = localStorage.getItem("_PUBLIC_KEY_");
  socket.emit(THIS_IS_MY_PUBLIC_KEY, publicKey);
  socket.on(THIS_IS_MY_PUBLIC_KEY, data => {
    AsymmetricCryptography.setReceiverPublicKey(data);
    HybridCryptography.setReceiverPublicKey(data);
  });
  socket.on(SESSION_ERROR, () => {
    swal("error", "this session key is uesed befor", "error");
  });
  socket.on(SIGNATURE_ERROR, () => {
    swal("error", "this signatuer is error some one distroyd data", "error");
  });
});
