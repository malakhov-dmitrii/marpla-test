import React, {useCallback, useRef, useState} from 'react'
import {IMaskInput} from 'react-imask'
import classnames from 'classnames'

import TextField from '@mui/material/TextField'
import ShortTextRoundedIcon from '@mui/icons-material/ShortTextRounded'

import styles from './index.module.scss'

const TextField_ = props => {
	const {
		icon: Icon,
		maskProps,
		className,
		classes = {},
		children,
		...rest
	} = props

	const [isFocused, setIsFocused] = useState(false)

	const onFocus = useCallback(() => {
		setIsFocused(true)
	}, [])
	const onBlur = useCallback(() => {
		setIsFocused(false)
	}, [])

	const InputProps = useRef(
		(() => {
			const value = {classes: {root: styles.Input, input: styles.input}}
			if (maskProps) {
				value.inputComponent = props => {
					const {inputRef, ...other} = props
					return (
						<IMaskInput
							{...other}
							{...maskProps}
							inputRef={inputRef}
							//onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
						/>
					)
				}
			}
			return value
		})(),
		[maskProps]
	)

	return (
		<div
			className={classnames(
				styles.root,
				className,
				classes.root,
				isFocused && styles.focused
			)}
		>
			{Icon ? (
				<Icon className={styles.icon} />
			) : (
				<ShortTextRoundedIcon className={styles.icon} />
			)}
			<TextField
				fullWidth
				variant="filled"
				className={styles.input}
				onFocus={onFocus}
				onBlur={onBlur}
				InputProps={InputProps.current}
				InputLabelProps={{className: styles.label}}
				{...rest}
			/>
		</div>
	)
}

export default TextField_
