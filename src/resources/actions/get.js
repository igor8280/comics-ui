export default {
	// send request, transform response to json and/or handle response error
	// return array with two values [data, error]
	$get(resource, $this, params) {
		// send get request with given parameters
		return resource.get(params)
			// convert response to json
			.then(response => response.json())
			// return array [data, error = null]
			.then(data => [data, null])
			// catch, handle and return array [data = null, error]
			.catch(error => {
				return [null, $this.$utils.handleResponseError(error)];
			});
	}
};
