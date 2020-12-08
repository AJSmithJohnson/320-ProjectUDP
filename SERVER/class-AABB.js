
exports.AABB = class AABB{
	constructor(x, y, width, height){
		this.width = width;
		this.height = height;
		//this.bounds ={xPos:x, yPos:y, bWidth:width, bHeight: height} 
		this.bounds = {xMin: x-width , xMax: x + width, yMin: y - height , yMax: y+height };
	}
	updateBounds(x, y){
		this.bounds.xMin = x - this.width;
		this.bounds.yMin = y - this.height;
		this.bounds.xMax = x + this.width;
		this.bounds.yMax = y + this.height;
	}
	compareBounds(a, b ){

		if( (a.xMin <= b.xMax && a.xMax >= b.xMin) &&
		 	(a.yMin <= b.yMax && a.yMax >= b.yMin)){

			return true;
		}//End of massive if


		return false;//So if there isn't a collision return false

	}
}