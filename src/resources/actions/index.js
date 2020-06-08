import getActions from './get';
import saveActions from './save';
import updateActions from './update';
import deleteActions from './delete';

export default {
	...getActions,
	...saveActions,
	...updateActions,
	...deleteActions
};
