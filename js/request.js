/* Holds every possible request
 * To iterate through array, use for-loop on r
 * To get a specific request by its ID, use r.byId(id) (returns null if ID not found)
 */
var r = [];

/* Parse input string and put array of requests into r
 * Returns r if import successful (input has a .requests property)
 * Returns false otherwise
 */
var r_import = function (input) {
	var obj = JSON.parse(input);
	if (!obj.requests) return false;

	r = obj.requests;
	_r_init(r);

	// Make a hash map of requests by ID
	var byIdMap = r.byIdMap;
	obj.requests.forEach(function (request) {
		if (request.id || request.id === 0) {
			byIdMap[request.id] = request;
		}
	});

	return r;
};


/* PRIVATE! (DO NOT USE in other files than request.js)
 * Initialize hash map functionality for r.
 */
(window._r_init = function (r) {

	// Essentially, define r.byIdMap as {}
	if (!r.hasOwnProperty('byIdMap')) {
		Object.defineProperty(r, 'byIdMap', {enumerable: false, value: {}});
	}

	// r.byId(id) returns the request with specific ID, or null if not found
	if (!r.hasOwnProperty('byId')) {

		Object.defineProperty(r, 'byId', {
			enumerable: false,
			value: function (id) {
				return r.byIdMap[id] || null;
			},
		});

	}
})(r);