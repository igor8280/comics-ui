export default {
	// send request and return array with two values [valid response, error response]
	$update(resource, $this, ...params) {
		resource.update(...params).then((response) => {
			// go one step back
			$this.$router.go(-1);
			return [response, null];
		}).catch(error => {
			return [null, $this.$utils.handleResponseError(error)];
		});
	}
};
