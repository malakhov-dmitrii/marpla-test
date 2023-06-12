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
				<path
					d="M7 19H17C18.1046 19 19 18.1046 19 17V11C19 9.89543 18.1046 9 17 9H13.1487C12.4374 9 11.7751 8.61444 11.4167 8C11.0582 7.38556 10.3959 7 9.68459 7H7C5.89543 7 5 7.89543 5 9V17C5 18.1046 5.89543 19 7 19Z"
					fill={props.fill || '#32558F'}
				/>
			</g>
		</g>
	</Template>
))
