import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M18.3107 7.92963C18.6036 8.22252 18.6036 8.69739 18.3107 8.99029L10.7804 16.46C10.4875 16.7529 10.0126 16.7529 9.71973 16.46L5.6894 12.4903C5.3965 12.1974 5.3965 11.7225 5.6894 11.4296C5.98229 11.1367 6.45716 11.1367 6.75006 11.4296L10.2501 14.869L17.25 7.92963C17.5429 7.63673 18.0178 7.63673 18.3107 7.92963Z"
		/>
	</Template>
))
