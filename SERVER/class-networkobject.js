const AABB = require("./class-AABB.js").AABB;

exports.NetworkObject = class NetworkObject{
	
	static _idCount = 0;


	constructor(){

		this.classID = "NWOB";

		this.networkID = ++NetworkObject._idCount;//before we assign this individual objects network ID
		//we access the static property and increment it

		this.position = {x:0, y:0, z:0};
		this.rotation = {x:0, y:0, z:0};
		this.scale    = {x:1, y:1, z:1};
		this.moving = false;
		this.aabb = new AABB(this.position.x,this.position.z, 0, 0);
	}
	update(){

	}
	serialize(){
		const buffer = Buffer.alloc(37);
		buffer.writeUInt8(this.networkID, 0);
		buffer.writeFloatBE(this.position.x, 1);
		buffer.writeFloatBE(this.position.y, 5);
		buffer.writeFloatBE(this.position.z, 9);

		buffer.writeFloatBE(this.rotation.x, 13);
		buffer.writeFloatBE(this.rotation.y, 17);
		buffer.writeFloatBE(this.rotation.z, 21);

		buffer.writeFloatBE(this.scale.x, 25);
		buffer.writeFloatBE(this.scale.y, 29);
		buffer.writeFloatBE(this.scale.z, 33);

		return buffer;
	}
	deserialize(buffer){
		//this.position.x = buffer.readFloatBE(0)
		//this.position.y = buffer.readFloatBE(0)
		//this.position.z = buffer.readFloatBE(0)
		//this is pointless for what we are doing
		//our server will probably never haveto deserialize
	}
}

