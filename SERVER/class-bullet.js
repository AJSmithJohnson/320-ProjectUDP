const NetworkObject = require("./class-networkobject.js").NetworkObject;

exports.Bullet = class Bullet extends NetworkObject{
	constructor(){
		super();
		this.classID = "BLLT";
		//this.position.x = spawnX;
		//this.position.y = spawnY;
		this.speed = 20;

		//properties for aabb
		this.width  =1.5;
		this.height =1.5;
		//setting up aabb
		this.aabb.x = this.position.x;
		this.aabb.z = this.position.z;
		this.aabb.width = this.width;
		this.aabb.height = this.height;
		this.moving = true;
	}	
	update(game){
		//bullet logic here
		this.position.z += this.speed * game.dt;
		if(this.position.z > 50) this.shouldDelete = true;
		//this.aabb.updateBounds(this.position.x, this.position.z);
		//console.log(this + "THIS BULLET IS AT POSITION " + this.position.z);
	}

	checkCollision(otherGameObject){
		//if(this.aabb.compareBounds(this.aabb, otherGameObject.aabb)){
		//	return true;
		//}
		//return false;

		if(this.position.x < otherGameObject.position.x + otherGameObject.width &&
		   this.position.x + this.width > otherGameObject.position.x &&
		   this.position.z < otherGameObject.position.z + otherGameObject.height &&
		   this.position.z +this.height > otherGameObject.position.z  ){
		   	if(otherGameObject.classID == "OBCL" || otherGameObject.classID == "ENMY"){otherGameObject.shouldDelete = true;}
			
		}

		return false;
	}


	serialize(){
		const p = super.serialize();
		//add to packet
		return p;
	}
}