export default {
	// send request and return array with two values [valid response, error response]
	$delete(resource, $this, ids) {
		// count how many items should be deleted
		let count = ids.length;
		// convert array to valid json string
		ids = JSON.stringify({ids});
		// send delete request
		resource.delete({}, ids).then(response => {
			// change pagination total to trigger table reload
			$this.$refs.pagination.decreaseTotal(count);
			return [response, null];
		}).catch(error => {
			$this.$utils.handleResponseError(error);
			// if error is 401 - unauthorized
			if (error.status === 401)
				// set error to null to stop next error handling
				error = null;
			return [null, error];
		});
	},
	// send request and return array with two values [valid response, error response]
	$deleteOne(resource, $this, id) {
		// send request with url params and empty body (body must be sent)
		resource.delete(id, '{}').then(response => {
			// change pagination total to trigger table reload
			$this.$refs.pagination.decreaseTotal(1);
			return [response, null];
		}).catch(error => {
			return [null, $this.$utils.handleResponseError(error)];
		});
	}
};
