import React, {forwardRef} from 'react'

import Template from './utils/Template.jsx'

export default forwardRef((props, ref) => (
	<Template ref={ref} tags={['none']} {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M6.08301 6.5C6.08301 5.80964 6.64265 5.25 7.33301 5.25H11.2497V7.5C11.2497 9.01878 12.4809 10.25 13.9997 10.25H16.2497V12C16.2497 12.4142 16.5855 12.75 16.9997 12.75C17.4139 12.75 17.7497 12.4142 17.7497 12V9.5C17.7497 9.30109 17.6707 9.11032 17.53 8.96967L12.53 3.96967C12.3894 3.82902 12.1986 3.75 11.9997 3.75H7.33301C5.81423 3.75 4.58301 4.98122 4.58301 6.5V17.5C4.58301 19.0188 5.81422 20.25 7.33301 20.25H12.833C13.2472 20.25 13.583 19.9142 13.583 19.5C13.583 19.0858 13.2472 18.75 12.833 18.75H7.33301C6.64265 18.75 6.08301 18.1904 6.08301 17.5V6.5ZM15.189 8.75L12.7497 6.31066V7.5C12.7497 8.19036 13.3093 8.75 13.9997 8.75H15.189ZM8.66634 8.75C8.25213 8.75 7.91634 9.08579 7.91634 9.5C7.91634 9.91421 8.25213 10.25 8.66634 10.25H9.49967C9.91389 10.25 10.2497 9.91421 10.2497 9.5C10.2497 9.08579 9.91389 8.75 9.49967 8.75H8.66634ZM8.66634 12.0833C8.25213 12.0833 7.91634 12.4191 7.91634 12.8333C7.91634 13.2475 8.25213 13.5833 8.66634 13.5833H13.6663C14.0806 13.5833 14.4163 13.2475 14.4163 12.8333C14.4163 12.4191 14.0806 12.0833 13.6663 12.0833H8.66634ZM8.66634 15.4167C8.25213 15.4167 7.91634 15.7525 7.91634 16.1667C7.91634 16.5809 8.25213 16.9167 8.66634 16.9167H11.9997C12.4139 16.9167 12.7497 16.5809 12.7497 16.1667C12.7497 15.7525 12.4139 15.4167 11.9997 15.4167H8.66634ZM17.53 20.0303C17.3894 20.171 17.1986 20.25 16.9997 20.25C16.8008 20.25 16.61 20.171 16.4693 20.0303L14.8027 18.3637C14.5098 18.0708 14.5098 17.5959 14.8027 17.303C15.0956 17.0101 15.5704 17.0101 15.8633 17.303L16.2497 17.6893V15.3333C16.2497 14.9191 16.5855 14.5833 16.9997 14.5833C17.4139 14.5833 17.7497 14.9191 17.7497 15.3333V17.6893L18.136 17.303C18.4289 17.0101 18.9038 17.0101 19.1967 17.303C19.4896 17.5959 19.4896 18.0708 19.1967 18.3637L17.53 20.0303Z"
		/>
	</Template>
))