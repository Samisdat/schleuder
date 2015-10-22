
var Image = function(imageUrl, actionParams){

    this.imageUrl = imageUrl;

    this.actionParams = actionParams;

	this.mimeType;

	this.ctx;

	this.orginalWidth;
	this.orginalHeight;

	this.width;
	this.height;

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

/*
var schleuderAction = function(request, response, imageUrl, actionName, actionParams){



	var getImageUrl = function(){
		return imageUrl;
	};
	var getActionName = function(){
		return actionName;
	};
	var getActionParams = function(){
		return actionParams;
	};

	var getMimeType = function(){
		return mimeType;
	};
	var setMimeType = function(_mimeType){
		if(undefined === mimeType){
			mimeType = _mimeType;
		}
	};
	var getFormat = function(){
		if(undefined === mimeType){
			return undefined;
		}
		if('image/png' === mimeType){
			return 'png';
		}
		else if('image/jpeg' === mimeType){
			return 'jpg';
		}
	};
	var getOrginalImage = function(){
		return orginalImage;
	};

	var setOrginalImage = function(_lwipImage){
		if(undefined === orginalImage){
			orginalImage = _lwipImage;
			actualImage = _lwipImage;
		}
	};
	var getActualImage = function(){
		return actualImage;
	};
	var setActualImage = function(_lwipImage){
		actualImage = _lwipImage;
	};
	var getOrginalWidth = function(){
		if(undefined === orginalImage){
			return undefined;
		}
		return orginalImage.width();
	};
	var getOrginalHeight = function(){
		if(undefined === orginalImage){
			return undefined;
		}
		return orginalImage.height();
	};
	var getActualWidth = function(){
		if(undefined === actualImage){
			return undefined;
		}
		return actualImage.width();
	};
	var getActualHeight = function(){
		if(undefined === actualImage){
			return undefined;
		}
		return actualImage.height();

	};
	var getRatio = function(){
		return getOrginalWidth() / getOrginalHeight() ;
	};


	return {
		getRequest: getRequest,
		getResponse: getResponse,
		getImageUrl:getImageUrl,
		getActionName: getActionName,
		getActionParams: getActionParams,
		getMimeType: getMimeType,
		setMimeType: setMimeType,
		getFormat: getFormat,
		setOrginalImage: setOrginalImage,
		getOrginalImage: getOrginalImage,
		getActualImage: getActualImage,
		setActualImage: setActualImage,
		getOrginalWidth: getOrginalWidth,
		getOrginalHeight: getOrginalHeight,
		getActualWidth: getActualWidth,
		getActualHeight: getActualHeight,
		getRatio: getRatio
	};
};

module.exports = schleuderAction;
*/
