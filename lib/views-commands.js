var openViews = {};

function enable(app){


	var views = {
		count: 0,
		active: null,
        vendor: {}
	};

	return views;
}

module.exports = {
	enable: enable,
	_test: {
		openViews: openViews
	}
};