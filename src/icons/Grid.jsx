import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M4.5835 5.33325C4.5835 4.91904 4.91928 4.58325 5.3335 4.58325H10.3335C10.7477 4.58325 11.0835 4.91904 11.0835 5.33325V10.3333C11.0835 10.7475 10.7477 11.0833 10.3335 11.0833H5.3335C4.91928 11.0833 4.5835 10.7475 4.5835 10.3333V5.33325ZM6.0835 6.08325V9.58325H9.5835V6.08325H6.0835Z"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M4.5835 13.6667C4.5835 13.2525 4.91928 12.9167 5.3335 12.9167H10.3335C10.7477 12.9167 11.0835 13.2525 11.0835 13.6667V18.6667C11.0835 19.081 10.7477 19.4167 10.3335 19.4167H5.3335C4.91928 19.4167 4.5835 19.081 4.5835 18.6667V13.6667ZM6.0835 14.4167V17.9167H9.5835V14.4167H6.0835Z"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M12.9165 5.33325C12.9165 4.91904 13.2523 4.58325 13.6665 4.58325H18.6665C19.0807 4.58325 19.4165 4.91904 19.4165 5.33325V10.3333C19.4165 10.7475 19.0807 11.0833 18.6665 11.0833H13.6665C13.2523 11.0833 12.9165 10.7475 12.9165 10.3333V5.33325ZM14.4165 6.08325V9.58325H17.9165V6.08325H14.4165Z"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M12.9165 13.6667C12.9165 13.2525 13.2523 12.9167 13.6665 12.9167H18.6665C19.0807 12.9167 19.4165 13.2525 19.4165 13.6667V18.6667C19.4165 19.081 19.0807 19.4167 18.6665 19.4167H13.6665C13.2523 19.4167 12.9165 19.081 12.9165 18.6667V13.6667ZM14.4165 14.4167V17.9167H17.9165V14.4167H14.4165Z"
		/>
	</Template>
))
