//We create a variable called game require the exported object and inside of it look for an object called game
const Pawn = require("./class-pawn.js").Pawn;
const Client = require("./class-client.js").Client;//
const Game = require("./class-game.js").Game;
//exports keyword stores server object in this class and allows us to use it in other files
exports.Server = class Server {
	constructor(){

		this.clients = [];
		this.numberOfClients = 0;
		this.ready = 0;
		//create socket:
		this.sock = require("dgram").createSocket("udp4");

		//setup event-listeners:\
		this.sock.on("error", (e)=>this.onError(e));
		this.maxPlayers = 1;
		this.sock.on("listening", ()=>this.onStartListen());
		this.game = new Game(this);
		//this.game.spawnObject( new Pawn());
		this.sock.on("message", (msg, rinfo)=>this.onPacket(msg, rinfo));
		//start listening:
		this.port = 320;
		this.sock.bind(this.port);

	}//end of constructor
	onError(e){
		console.log("ERROR: "+ e);
	}//End of onError
	onStartListen(){
		console.log("Server Started");
	}//End of onStartListen
	
	onPacket(msg, rinfo){
		if(msg.length < 4) return;
		const packetID = msg.slice(0,4).toString();
		console.log(packetID);
        const c = this.lookupClient(rinfo);
        if(c){//If client exists then handle packet
        	c.onPacket(msg, this.game);
        }else {//We don't have a client CREATE THEM 
			if(packetID == "JOIN"){
				this.makeClient(rinfo);
			}//end of if(packetID)
			
        }//end of else{}

    	if(packetID == "REDY"){
				console.log("WE ARE READY");
				this.ready += 1;
				//To Control how many players are allowed raise or lower maxPlayers
				if(this.ready >= this.maxPlayers){
					this.startGame();	
				}
				
			}
			else if(packetID == "NRDY"){
				this.ready -= 1;
			}
		
		


		//console.log("MESSAGE received from " + rinfo.address+ " : " + rinfo.port);
	}//End of onPacket

	startGame(){
		//console.log(this.numberOfClients);
		//console.log(this.ready);
		const packet = Buffer.alloc(5)
		packet.write("STRT", 0);
		packet.writeUInt8(this.numberOfClients, 4);
		this.sendPacketToAll(packet);

		if((this.numberOfClients) == this.ready){
			this.game.start = true;
		}
	}

	getKeyFromRinfo(rinfo){
		return rinfo.address+":"+rinfo.port;
	}//end of getKeyFromRinfo
	lookupClient(rinfo){
		const key = this.getKeyFromRinfo(rinfo);
		return this.clients[key];
	}//End of lookupClient
	makeClient(rinfo){
		const key = this.getKeyFromRinfo(rinfo);
		const client = new Client(rinfo);
		this.clients[key] = client;
		//depending on scene (and other conditions) spawn Pawn:
		client.spawnPawn(this.game);
		this.numberOfClients += 1;
		//this.clients[key] = client;//I commented this out because the above thing is the same thing I think

		this.showClientList();

		const packet = this.game.makeREPL(false);
		this.sendPacketToClient(packet, client);//TODO: needs to acknowledge
		

		const packet2 = Buffer.alloc(5);
		packet2.write("PAWN", 0);
		packet2.writeUInt8(client.networkID, 4); 
		this.sendPacketToClient(packet2, client);
		// may or may not be appropriate place to trigger sending replication packets
		//TODO: send CREATE replication packets to client for every object....
		return client;
	}//End of makeClient
	disconnectClient(client){
		if(client.pawn)this.game.removeObject(client.pawn);
		const key = this.getKeyFromRinfo(client.rinfo);
		delete this.clients[key];
		
	}
	showClientList(){
		console.log(" =========="+Object.keys(this.clients).length+"clients connected ========== "); //associative arrays are tricky we need the 
		//Object.keys function to get the number of items in an associative array
		for(var key in this.clients){//FOR EACH LOOP that uses and gives us keys in each clients object
			console.log("Client key is " + key);
		}//end of forEachloop
	}//end of showClients List

	getPlayer(num = 0){

		num = parseInt(num);

		let i = 0;//used as a counter variable
		for(var key in this.clients){
			if(num == i) return this.clients[key];
			i++;
		}//end of for var key loop
	}//End of getPlayer

	sendPacketToAll(packet){//broadcast isn't a good name for this function, there is a networking concept called broadcasting
		
		//if you wanted to detect every game on a network you would use the broadcast IP and just ping every game on the network
		/*
		this.clients.forEach(c=>{
			this.sendPacketToClient(packet, c);
		});//End of forEachloop inside of broadcast
		*/  //the above doesn't work because we are using an associative array
		for(var key in this.clients){
			this.sendPacketToClient(packet, this.clients[key]);
		}

	}//End of broadcast


	updateClientScores(clientNum){
		
		const scorePacket = Buffer.alloc(6);
		scorePacket.write("SCRE", 0);
		scorePacket.writeUInt8(this.clients[clientNum], 4);
		
		scorePacket.writeUInt8(this.clients[clientNum].pawn.score, 5);
		this.sendPacketToAll(packet);
	}

	sendPacketToClient(packet, client){
		this.sock.send(packet, 0, packet.length, client.rinfo.port, client.rinfo.address, ()=>{} );
	} 
	update(game){
		// check clients for disconnects, etc.
		for(let key in this.clients){
			this.clients[key].update(game);
		}
	}
}//End of server class


