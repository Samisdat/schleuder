var schleuderAction = function(imageUrl, actionName, actionParams){

	var mimeType = undefined;

	/* @var lwip*/
	var orginalImage = undefined;

	/* @var lwip*/
	var actualImage = undefined;

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
