
exports.AABB = class AABB{
	constructor(x, z, width, height){
		this.width = width;
		this.height = height;
		//this.bounds ={xPos:x, yPos:y, bWidth:width, bHeight: height} 
		this.bounds = {xMin: x-width , xMax: x + width, zMin: z - height , zMax: z+height };
	}
	updateBounds(x, z){
		this.bounds.xMin = x - this.width;
		this.bounds.zMin = z - this.height;
		this.bounds.xMax = x + this.width;
		this.bounds.zMax = z + this.height;
	}
	compareBounds(a, b ){

		if( (a.xMin <= b.xMax && a.xMax >= b.xMin) &&
		 	(a.zMin <= b.zMax && a.zMax >= b.zMin)){

			return true;
		}//End of massive if


		return false;//So if there isn't a collision return false

	}
}