import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<g style={{mixBlendMode: 'multiply'}}>
			<g style={{mixBlendMode: 'multiply'}}>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M0 4.21277C0 1.88612 1.79086 0 4 0H8.69113C10.4128 0 11.9414 1.16032 12.4859 2.88057L12.7863 3.82979H20C22.2091 3.82979 24 5.71591 24 8.04255V19.7872C24 22.1139 22.2091 24 20 24H4C1.79086 24 0 22.1139 0 19.7872V4.21277Z"
					fill="#F2F2F2"
				/>
			</g>
		</g>
	</Template>
))
