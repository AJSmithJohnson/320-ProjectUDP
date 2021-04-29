const NetworkObject = require("./class-networkobject.js").NetworkObject;

exports.Enemy = class Enemy extends NetworkObject{
	constructor(){
		super();
		this.classID = "ENMY";
		this.health = 1;
		this.width = 1.75;
		this.height = 1.75;
		this.speed = 5;
		this.scale.x = 1;
		this.scale.y = 1;
		this.scale.z = 1;
		this.scoreValue = 100;
	}

	update(game){
		this.position.z -= this.speed * game.dt;
		if(this.position.z < 0) this.shouldDelete = true;
		
	}

	checkCollision(otherGameObject){
		//First check for if we have collision
		if(this.position.x < otherGameObject.position.x + otherGameObject.width &&
		   this.position.x + this.width > otherGameObject.position.x &&
		   this.position.z < otherGameObject.position.z + otherGameObject.height &&
		   this.position.z +this.height > otherGameObject.position.z  ){
		   	//If other game object is OBCL we scale this object
		   	if(otherGameObject.classID == "PAWN"){
		   		//Call players damage function
		   		otherGameObject.damage(this.scaleX *2);
		   		this.shouldDelete = true;
		   		return true;
		   		
		   	}else if(otherGameObject.classID == "OBCL"){

		   		//NOTE CHANGED THESE FROM 1 to .2
		   		this.scale.x += .2;
		   		this.scale.y += .2;
		   		this.scale.z += .2;
		   		this.width += .2;
		   		this.height += .2;
		   		otherGameObject.shouldDelete = true;

		   		return true;
		   	}
		
			
		}

		return false;
		
	}//End Of Check Collision method
	serialize(){
		let b = super.serialize();

		if(b == null){
			this.shouldDelete = true;
		}else{
			return b;	
		}
		//Here we would add additional bytes that are needed for our pawn
		

		//\super.serialize();
	}
}