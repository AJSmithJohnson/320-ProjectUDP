const NetworkObject = require("./class-networkobject.js").NetworkObject;

exports.Bullet = class Bullet extends NetworkObject{
	constructor(){
		super();
		this.classID = "BLLT";
	}	
	update(){
		//bullet logic here
	}
	serialize(){
		const p = super.serialize();
		//add to packet
		return p;
	}
}