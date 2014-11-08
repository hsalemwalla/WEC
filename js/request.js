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

/* Splits r into 'num_chunks' chunks
 * Returns arrays of arrays of requests, or false if error
 */
var r_chunk = function (num_chunks) {
	if (num_chunks < 1) return false;

	var i, total = r.length;
	var chunks = new Array(num_chunks);
	for (i = 0; i < num_chunks; ++i) {
		chunks[i] = [];
	}

	var index;
	for (i = 0; i < total; ++i) {
		index = i % num_chunks;
		chunks[index].push(r[i]);
	}

	return chunks;
};


/* PRIVATE! (DO NOT USE in other files than request.js)
 * Initialize hash map functionality for r.
 */
(window._r_init = function (r) {

	if (!r) r = [];

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

r_import('{"requests":[{"dropoff":{"y":3,"x":6},"pickup":{"y":6,"x":1},"deliveryFee":16.0,"id":1},{"dropoff":{"y":2,"x":3},"pickup":{"y":3,"x":2},"deliveryFee":4.0,"id":2}],"deliveryHeadquarter":{"y":5,"x":1}}');
