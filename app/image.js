
var Image = function(imageUrl, actionParams){

    this.imageUrl = imageUrl;

    this.actionParams = actionParams;

	this.mimeType = undefined;

	this.ctx = undefined;

	this.orginalWidth = undefined;
	this.orginalHeight = undefined;

	this.width = undefined;
	this.height = undefined;

};

Image.prototype.getImageUrl = function(){
    return this.imageUrl;
};

Image.prototype.getActionParams = function(){
    return this.actionParams;
};

Image.prototype.getCtx = function(){
    return this.ctx;
};

Image.prototype.setCtx = function(ctx){
    this.ctx = ctx;
};

Image.prototype.getOrginalWidth = function(){
	return this.orginalWidth;
};

Image.prototype.setOrginalWidth = function(width){
	this.orginalWidth = width;
};

Image.prototype.getOrginalHeight = function(){
	return this.orginalHeight;
};

Image.prototype.setOrginalHeight = function(height){
	this.orginalHeight = height;
};

Image.prototype.getWidth = function(){
	return this.width;
};

Image.prototype.setWidth = function(width){
	this.width = width;
};

Image.prototype.getHeight = function(){
	return this.height;
};

Image.prototype.setHeight = function(height){
	this.height = height;
};

Image.prototype.getRatio = function(){
	return this.getOrginalWidth() / this.getOrginalHeight() ;
};

Image.prototype.getMimeType = function(){
	return this.mimeType;
};

Image.prototype.setMimeType = function(mimeType){
	if(undefined === this.mimeType){
		this.mimeType = mimeType;
	}
};

module.exports = Image;
