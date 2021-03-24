
const Obstacle = require("./class-obstacle.js").Obstacle;//This can be deleted later just using this for collision detection

exports.Game = class Game{

	static Singleton;

	constructor(server){
		Game.Singleton = this;
		this.frame = 0;
		this.time = 0;
		this.dt = .016; //this is deltaTime in seconds
		this.timeUntilNextStatePacket = 0;
		this.objs = [];//store Network Objects

		this.check = false;
		
		this.server = server;
		this.SetUpGameBoard();
		this.update();

		//this.spawnObject(new Pawn() );//should be in server when player joins
	}//end of constructor
	update(){
		//Server needs to be authoritative
		//The server is the only place where we should save the balls state
		//in unity we are going to have a ball and the server is going to move the ball back and forth
		this.time += this.dt;
		this.frame++;

		this.server.update(this);//check clients for disconnects, etc.\

		//this.ballPos.x = Math.sin(this.time) * 2;
		const player = this.server.getPlayer(0);//return nth client

		for(var i in this.objs){
			if(this.objs[i] == null) {
				this.objs.splice(i, 1);
				//break;
			}
			if(this.objs[i] != null) this.objs[i].update(this);//this is a reference to our game\
			//console.log(this.objs[i]);
			//HERE IS WHERE WE WOULD DO COLLISION DETECTION
			if(this.objs[i] == null){ 
				this.removeObject(this.objs[i]);
				this.objs.splice(i, 1);
			}
		    if(this.objs[i] != null &&  this.objs[i].classID == "BLLT" ){
		    	//console.log(this.objs[i].classID);
		    	for(var j in this.objs){
		    		if(this.objs[i] != this.objs[j] && this.objs[i] != null){
		    			
		    			if(this.objs[i].checkCollision(this.objs[j])){
		    				this.objs[j].shouldDelete = true;
		    				//console.log("We have a collision");
		    				//this.removeObject(this.objs[j]);
		    				//this.objs.splice(j, 1);
		    			}
		    		}
		    	}
		    	
		    }
			
		}//End of for loop


		for(var j in this.objs){
			if(this.objs[j].shouldDelete == true){
				this.removeObject(this.objs[j]);
			}
		}



		



		// update all the objects in the game and then

		if(this.timeUntilNextStatePacket > 0){//this is used to throttle packets sent so we don't overload the client
			//count down
			this.timeUntilNextStatePacket -= this.dt;
		} else {
			this.timeUntilNextStatePacket = -.1; //send 10% of the packets( ~ 1/6 frames)
			this.sendWorldState();
		}

		

		setTimeout(()=>this.update(),16); // setTimeout allows us to call a function after a certain amount of time 
		//^so after 16 milliseconds we call this.update() this is at the end so we kind of recourse into this
	}//end of update
	sendWorldState(){//A function to send the balls position to all clients
		const packet = this.makeREPL(true);
		this.server.sendPacketToAll(packet);
	}//end of sendWorldState()

	makeREPL(isUpdate = true){
		isUpdate = !!isUpdate; //forces this variable into a boolean


		let packet = Buffer.alloc(5);//we allocate 16 bytes of memory
		packet.write("REPL", 0);//write repl because this is a replication packet
		packet.writeUInt8(isUpdate ? 2: 1, 4);//2 because this is an update packet
		

		this.objs.forEach(o=>{
			//cuffer from the objects class ID and buffer returned from serialize
			const classID = Buffer.from(o.classID);
			const data = o.serialize();

			packet = Buffer.concat([packet, classID, data]);

			
		});

		return packet;
	}

	spawnObject(obj){//INSTANTIATE()
		this.objs.push(obj);
		
		let packet = Buffer.alloc(5);//we allocate 16 bytes of memory
		packet.write("REPL", 0);//write repl because this is a replication packet
		packet.writeUInt8(1, 4);//2 because this is an update packet
		
			//cuffer from the objects class ID and buffer returned from serialize
			const classID = Buffer.from(obj.classID);
			const data = obj.serialize();

			packet = Buffer.concat([packet, classID, data]);

			this.server.sendPacketToAll(packet);
		
	}//end of spawnObject
	removeObject(obj){//DESTROY()
		const index = this.objs.indexOf(obj);
		if(index < 0) return;
		const netID = this.objs[index].networkID; //get id of object
		this.objs.splice(index, 1);// remove object from array

		const packet = Buffer.alloc(6);
		packet.write("REPL", 0);
		packet.writeUInt8(3, 4);//writting 3 four bytes into the packet; 3 means delete
		packet.writeUInt8(netID, 5);

		this.server.sendPacketToAll(packet);
	}

	SetUpGameBoard(){
		for(var i = 0; i < 15; i++){
			for(var u = 0; u < 15; u++){
				if(Math.random() > .85){
					this.obstacle = new Obstacle();
					this.obstacle.position.x = i;
					this.obstacle.position.z = u;
					this.spawnObject(this.obstacle);
				}//End of Math.random
			}
		}//End of nested forloop
	}
	

}//End of game class
