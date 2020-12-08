const NetworkObject = require("./class-networkobject.js").NetworkObject;

exports.Bullet = class Bullet extends NetworkObject{
	constructor(spawnX, spawnY){
		super();
		this.classID = "BLLT";
		this.position.x = spawnX;
		this.position.y = spawnY;
		this.speed = 2;

		//properties for aabb
		this.width  =1;
		this.height =1;
		//setting up aabb
		this.aabb.x = this.position.x;
		this.aabb.y = this.position.y;
		this.aabb.width = this.width;
		this.aabb.height = this.height;
	}	
	update(game){
		//bullet logic here
		this.position.y += this.speed * game.dt;
	}

	checkCollision(otherGameObject){
		if(this.aabb.compareBounds(this.aabb.bounds, otherGameObject.aabb.bounds)){
			return true;
		}
		return false;
	}


	serialize(){
		const p = super.serialize();
		//add to packet
		return p;
	}
}