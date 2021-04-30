const NetworkObject = require("./class-networkobject.js").NetworkObject;
const Bullet = require("./class-bullet.js").Bullet;


exports.Pawn = class Pawn extends NetworkObject{
	constructor(){
		super();//calls the superclasses constructor//which in this case is the one on the class-networkObject
		
		this.classID = "PAWN";


		this.score = 0;

		this.timer = 1;
		this.timerDefault = 1;
		//properties for aabb
		this.width = 1;
		this.height = 1;
		//implementing AABB
		this.speed = 5;
		this.aabb.x = this.position.x;
		this.aabb.z = this.position.z;
		this.aabb.width = this.width;
		this.aabb.height = this.height;
		this.moving = true;
		this.shouldDelete = false;
		this.health = 10;
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
				this.bullet.pawnReference = this;
				this.bullet.position.x = this.position.x;
				this.bullet.position.z = this.position.z + 1;
				game.spawnObject(this.bullet);//spawn a new bullet if we are firing	
				this.timer = this.timerDefault;
			}else{
				
			}
			
		}
		this.timer -=1 * game.dt;
		
		
		
		if(this.position.x > 19){
			this.position.x = 18;
		}else if(this.position.x < -19){
			this.position.x = -18;
		}

		this.position.x += this.velocity.x * game.dt;	
		//this.aabb.x = this.position.x;
		//this.aabb.z = this.position.z;
		this.aabb.updateBounds(this.position.x, this.position.z);
		
	}
	checkCollision(otherGameObject){
		if(this.position.x < otherGameObject.position.x + otherGameObject.width &&
		   this.position.x + this.width > otherGameObject.position.x &&
		   this.position.z < otherGameObject.position.z + otherGameObject.height &&
		   this.position.z +this.height > otherGameObject.position.z  ){
		   	//If other game object is OBCL we scale this object
		   	if(otherGameObject.classID == "ENMY"){
		   		//Call players damage function
		   		otherGameObject.damage(this.scaleX *2);
		   		this.shouldDelete = true;
		   		return true;
		   		
		   	}
		
			
		}

		return false;
	}
	updateScore(scoreValue){
		this.score += scoreValue;
		console.log(this.score);
	}
	damage(damage){
		this.health -= damage;

		if(this.health <= 0){
			console.log("Game over");
			
		}
	}
	serialize(){
		let b = super.serialize();


		//Here we would add additional bytes that are needed for our pawn
		return b;

		//\super.serialize();
	}
	deserialize(){
		
	}

}

