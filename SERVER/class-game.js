


exports.Game = class Game{

	static Singleton;

	constructor(server){
		Game.Singleton = this;
		this.frame = 0;
		this.time = 0;
		this.dt = .016; //this is deltaTime in seconds
		this.timeUntilNextStatePacket = 0;
		this.objs = [];//store Network Objects

		

		this.server = server;
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
			this.objs[i].update(this);//this is a reference to our game\
		}//End of for loop

		//console.log(this.ballPos.x + "This is the ball position");
		if(player){//if we have at least one player
			//console.log(player.input.axisH);
			
		}

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

}//End of game class
