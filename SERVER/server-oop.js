const Server = require("./class-server.js").Server;//gives us an exports module and looks for something called "Server" because of the .Server


//Following 3 lines are test code
//const obj = {};
//obj.x = "42";
//delete obj.x;

//const game = new Game();// we are creating the game object up above in ther server we don't a ctually need this

// we could user a singleton
//or we could just say server something or other
//we are going to just say
new Server();