const NetworkObject = require("./class-networkobject.js").NetworkObject;



exports.Pawn = class Pawn extends NetworkObject{
	constructor(){
		super();//calls the superclasses constructor//which in this case is the one on the class-networkObject
		this.classID = "PAWN";

		//properties for aabb
		this.width = 1;
		this.height = 1;
		//implementing AABB
		
		this.aabb.x = this.position.x;
		this.aabb.y = this.position.y;
		this.aabb.width = this.width;
		this.aabb.height = this.height;


		//implementing physics
		this.velocity = {x:0, y:0, z:0};
		
		this.input = {};//input set up to be empty object to avoid errors
	}
	accelerate(vel, accelerate, dt){
		if(accelerate != 0){
		vel += accelerate * dt;
		} else{
			//not pressing left or right
			//slow down object
			if(vel > 0){
				accelerate = -1;
				vel += accelerate * dt;
				if(vel < 0) vel = 0;
			}

			if(vel < 0){
				accelerate = 1;
				vel += accelerate * dt;
				if(vel >0) vel= 0;
			}
		}
		return vel ? vel : 0;



	}
	update(game){
		//12/1/2020
		//We marked this off because we are trying to do physics
		//this.position.x = Math.sin(game.time);
		//console.log(this.position.x);
		//console.log(this.aabb.bWidth);
		//console.log(this.aabb.bHeight);
		let moveX = this.input.axisH|0;// -1,0, or 1//bitwise or means if this is a number use it otherwise use 0

		this.velocity.x = this.accelerate(this.velocity.x, moveX, game.dt);
		


		//this is euler but verlet physics are more reliable if
		//developing a more traditional game should use verlet
		this.position.x += this.velocity.x * game.dt;
		this.aabb.updateBounds(this.position.x, this.position.y);
		//this.aabb.bounds.xPos = this.position.x;
		//this.aabb.bounds.yPos = this.position.y;
		//console.log("AABB bounds X is" + this.aabb.bounds.xPos);
		//console.log("AABB bounds Y is" + this.aabb.bounds.yPos);
	}
	checkCollision(otherGameObject){
		if(this.aabb.compareBounds(this.aabb.bounds, otherGameObject.aabb.bounds)){
			console.log("WE'VE GOT A HIT");
			return true;
		}
		return false;
	}
	serialize(){
		let b = super.serialize();


		//Here we would add additional bytes that are needed for our pawn
		return b;

		//\super.serialize();
	}
	deserialize(){
		//TODO
	}

}

