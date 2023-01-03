// const express = require("express");
// const app = express();
// const cors = require("cors");
// app.use(cors());
// app.use(express.json());

// const server = app.listen(4000, () => {
//   console.log("Server is up & running *4000");
// });

// io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//   },
// });

// let users = [];

// io.on("connection", (socket) => {
//   console.log("Connected & Socket Id is ", socket.id);

//   socket.emit("UData", "users");

//   users.push(socket.id);

//   io.emit("get-inbox-left-side", users);

//   io.emit("UData", users);

//   // disconnect
//   socket.on("disconnect", () => {
//     users.pop(socket.id);
//     io.emit("get-inbox-left-side", users);
//   });
// });

// let onlineUserArray = [];

// let userSenderInfoVer = "";

// let count = 1;

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    // origin: [
    //   "https://rony9843.github.io/Queenz-Zone-dashboard/",
    //   "https://rony9843.github.io/",
    //   "https://rony9843.github.io",
    //   "https://queenzzone.online/",
    // ],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
const port = process.env.PORT || 5550;

app.get("/", (req, res) => {
  res.send("this is queenzzone socket io  server vercel ");
});

// const io = require("socket.io")(process.env.PORT || 8800, {
//   cors: {
//     //  origin: ["http://localhost:3000", "http://localhost:3001"],
//     // origin: [
//     //   "https://queenzzone.online",
//     //   "https://rony9843.github.io/Queenz-Zone-dashboard",
//     // ],
//     origin: ["*"],
//   },
// });

let onlineUserArray = [];

let userSenderInfoVer = "";

let count = 1;

io.on("connection", (socket) => {
  // get new user
  socket.on("new-online-user", (onlineUser) => {
    // {
    //   onlineUser: {
    //     activeUserInfo: 'old',
    //     activeUserNumber: '417832347',
    //     oldUserInfo: {
    //       displayName: 'Roni Ahmed',
    //       email: 'rony136fff47@gmail.comf',
    //       password: 'ronironi',
    //       phoneNumber: '345345346546',
    //       time: '2022-08-31T00:55:22.953Z',
    //       address: 'Al Khalidiyyah'
    //     }
    //   },
    //   socket_id: 'J81NcJQKAHXIbp1tAACX'
    // }

    // ^ ======================= perfect

    if (onlineUser.activeUserInfo === "old") {
      console.log("this is old user block");

      onlineUserArray = onlineUserArray.filter(
        (dt) => dt.onlineUser.activeUserNumber !== onlineUser.activeUserNumber
      );

      newUserAc = {
        onlineUser: onlineUser,
        socket_id: socket.id,
      };
      console.log("1 -- > ", newUserAc);

      onlineUserArray.push(newUserAc);
    } else {
      onlineUserArray = onlineUserArray.filter(
        (dt) => dt.onlineUser.activeUserNumber !== onlineUser.activeUserNumber
      );

      // if new user
      newUserAc = {
        onlineUser: onlineUser,
        socket_id: socket.id,
      };
      console.log("2 ---- >  ", newUserAc);

      onlineUserArray.push(newUserAc);
    }

    // ! ======================================

    // ================
    // onlineUserArray.push(onlineUser);

    //post order
    io.emit("get-online-user", onlineUserArray); // alada call kole shobmoy response korbe na
  });

  //io.emit("get-all-online-user", onlineUserArray);

  socket.on("user-connected", (newOrder) => {
    console.log("8---------->  ", "hii");
    //post order
    io.emit("get-user-connected", onlineUserArray);
  });

  //post order
  //io.emit("get-online-user", onlineUserArray); // alada call kole shobmoy response korbe

  // remove old user in onlineUserArray
  // socket.on("remove-online-user-in-array", (onlineUserNumber) => {
  //   // onlineUserArray.map(uDt => uDt.)

  //   console.log(newUserAc);

  //   onlineUserArray.push(newUserAc);

  //   //post order
  //   io.emit("get-online-user", onlineUserArray); // alada call kole shobmoy response korbe
  // });

  // get order
  socket.on("new-order", (newOrder) => {
    console.log("4---------->  ", newOrder);
    //post order
    io.emit("get-order", "This is order");
  });

  // ========= inbox left side update
  socket.on("new-inbox-left-side", (userSenderInfo) => {
    // alada call korle shobmoy response korbe useEffect diya
    io.emit("get-inbox-left-side", "this is inbox left side");
  });

  // === inbox message ==========
  // get new user
  socket.on("new-message", (userSenderInfo) => {
    // alada call korle shobmoy response korbe useEffect diya
    userSenderInfoVer = userSenderInfo;
    console.log("5--->> ", userSenderInfo);
    io.emit("get-message", userSenderInfo);
  });

  // alada call korle shobmoy response korbe useEffect diya
  //io.emit("get-message", userSenderInfoVer);

  // disconnect
  socket.on("disconnect", () => {
    // filter for disconnect
    onlineUserArray = onlineUserArray.filter(
      (dt) => dt.socket_id !== socket.id
    );

    setTimeout(function () {
      // post user disconnect
      io.emit("get-online-user-disconnect", onlineUserArray);
    }, 1000);

    console.log("user disconnected ", onlineUserArray);

    // io.emit("get-user", "read data disconnect");
  });
});

http.listen(port, () => {
  console.log(`Socket.IO vercel server running at http://localhost:${port}/`);
});
