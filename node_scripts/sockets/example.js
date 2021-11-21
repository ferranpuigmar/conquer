socket.on("addUserToRoom", ({ roomId, newPlayer }) => {
  socket.join(roomId);

  let rooms = utils.readFile(fileRooms);

  const currentRoom = rooms.find((room) => room.id === roomId);
  const restUsers = currentRoom.usersRoom.filter(
    (userRoom) => userRoom.id !== newPlayer.id
  );

  if (currentRoom.usersRoom.length === 0) {
    currentRoom.usersRoom.push(newPlayer);
  } else {
    currentRoom.usersRoom = [...restUsers, newPlayer];
  }

  rooms = rooms.map((room) => {
    if (room.id === roomId) {
      return currentRoom;
    }
    return room;
  });

  const addUSerToDB = utils.writeFile(fileRooms, rooms);
  console.log(`addUSerToDB from ${newPlayer.name} -> ${addUSerToDB} `);
  if (addUSerToDB) {
    io.to(roomId).emit("notifyNewUsertoRoom", {
      data: currentRoom.usersRoom,
      roomId,
    });
  }
});
