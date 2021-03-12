const NetworkObject = require("./class-networkobject.js").NetworkObject;

exports.Obstacle = class Obstacle extends NetworkObject{
	constructor(){
		super();
		this.classID = "OBCL";
		this.health = 1;
		this.width = 1;
		this.height = 1;
		this.aabb.x = this.position.x;
		this.aabb.z = this.position.z;
		this.aabb.width = this.width;
		this.aabb.height = this.height;
		this.aabb.updateBounds(this.aabb.x, this.aabb.z);
	}
	update(game){
		
	}
	checkCollision(otherGameObject){
		//console.log("OBJECT A AABB " + this.aabb.bounds);
			//console.log("          ");
			//console.log("OTHER OBJECT" + otherGameObject.aabb.bounds);
		this.aabb.up
		if(this.aabb.compareBounds(this.aabb.bounds, otherGameObject.aabb.bounds)){

			//console.log("WE'VE GOT A HIT");
			return true;
		}
		return false;
	}
}