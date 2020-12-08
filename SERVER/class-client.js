const Pawn = require("./class-pawn.js").Pawn;
const Game = require("./class-game.js").Game;
exports.Client = class Client{
	static TIMEOUT = 1;
	constructor(rinfo){
		this.rinfo = rinfo;//rinfo contains address and port information

		this.input = {
			axisH:0,//horizontalInput
			axisV:0,//verticalInput
			firing: 0,//is the player firing a projectile
		};//end of this.input

		this.pawn = null;//we are storing clients input in client class
		//every time we get input from client we push this input into the pawn object

		this.timeOfLastPacket = Game.Singleton.time;
	}//End of constructor

	spawnPawn(game){
		if(this.pawn) return; //if there is a pawn already spawned return out of function
		this.pawn = new Pawn(); //set up pawn variable and reference
		game.spawnObject( this.pawn );//Add pawn to game world

		
	}

	update(game){
		if(game.time > this.timeOfLastPacket + Client.TIMEOUT){
			//setting up a timout function
			//Remove pawn( and send REPL delete to all)

			//COMMENTED THIS OUT FOR NOW IN FINAL PROJECT SHOULD UNCOMMENT
			//game.server.disconnectClient(this);
			//Remove client

			//Adjust protocol to send a "KICK" packet
		}
	}

	onPacket(packet, game){
		if(packet.length < 4) return; //too short not enough info, ignore packets
		const packetID = packet.slice(0, 4).toString();

		//need access to game
		this.timeSinceLastPacket = game.time;


		switch(packetID){
			case "INPT":
				if(packet.length < 5) return;
				this.input.axisH = packet.readInt8(4);

				//if client exists send input to pawn
				if(this.pawn) this.pawn.input = this.input;
			break;
			case "SHOT":
				if(packet.length < 5) return;
				this.input.firing = packet.readInt8(4);
				console.log(this.input.firing);
				if(this.pawn) this.pawn.input.firing = this.input.firing;

			//TODO: Handle all the many wonderful packets
			break;
			default:
				console.log("OH NO, packet type not recognized");
			break;
		}//End of switch

	}//end of onPacket
}