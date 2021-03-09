const NetworkObject = require("./class-networkobject.js").NetworkObject;
const Bullet = require("./class-bullet.js").Bullet;


exports.Pawn = class Pawn extends NetworkObject{
	constructor(){
		super();//calls the superclasses constructor//which in this case is the one on the class-networkObject
		this.classID = "PAWN";

		this.timer = 2;
		//properties for aabb
		this.width = 1;
		this.height = 1;
		//implementing AABB
		this.speed = 5;
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
		vel += accelerate * dt * this.speed;
		} else{
			//not pressing left or right
			//slow down object
			if(vel > 0){
				accelerate = -1;
				vel += accelerate * dt * this.speed;
				if(vel < 0) vel = 0;
			}

			if(vel < 0){
				accelerate = 1;
				vel += accelerate * dt * this.speed;
				if(vel >0) vel= 0;
			}
		}
		return vel ? vel : 0;



	}
	update(game){
		
		let moveX = this.input.axisH|0;// -1,0, or 1//bitwise or means if this is a number use it otherwise use 0

		this.velocity.x = this.accelerate(this.velocity.x, moveX, game.dt);
		
		//Firing bullets
		if(this.input.firing == 1){
			
			if(this.timer <= 0){
				this.bullet = new Bullet();
				this.bullet.position.x = this.position.x;
				this.bullet.position.z = this.position.z + 1;
				game.spawnObject(this.bullet);//spawn a new bullet if we are firing	
				this.timer = 5;
			}else{
				this.timer -=1;
			}
			
		}
		
		this.position.x += this.velocity.x * game.dt;
		//this.aabb.updateBounds(this.position.x, this.position.y);
		
	}
	checkCollision(otherGameObject){
		if(this.aabb.compareBounds(this.aabb.bounds, otherGameObject.aabb.bounds)){
			//console.log("WE'VE GOT A HIT");
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

