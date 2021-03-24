const NetworkObject = require("./class-networkobject.js").NetworkObject;

exports.Enemy = class Enemy extends NetworkObject{
	constructor(){
		super();
		this.classID = "ENMY";
		this.health = 1;
		this.width = 1.75;
		this.height = 1.75;
		this.speed = 8;
		this.scale.x = 1;
		this.scale.y = 1;
		this.scale.z = 1;
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
		   		this.scale.x += 1;
		   		this.scale.y += 1;
		   		this.scale.z += 1;
		   		this.width += 1;
		   		this.height += 1;
		   		otherGameObject.shouldDelete = true;

		   		return true;
		   	}
		//IF other game object is PLYR we flag for deletion and then \
			
		}

		return false;
		
	}//End Of Check Collision method
}