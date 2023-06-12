import React, {
	forwardRef,
	useState,
	useCallback,
	useEffect,
	useRef,
	cloneElement,
} from 'react'
import classnames from 'classnames'

import Typography from '../Typography'
import Box from '@mui/material/Box'

import CrossIcon from '../../icons/Cross'
import IconButton from '../IconButton'

import styles from './index.module.scss'

export const Input = forwardRef(
	(
		{
			inputRef,
			placeholder = 'Введите текст',
			icon,
			fullWidth = false,
			startActions = null,
			endActions = null,
			inputProps,
			disabled = false,
			error = false,
			helperText,
			type = 'text',
			onChange,
			clearable = true,
			value,
			rootProps,
			multiline = false,
			className,
			classes = {},
		},
		ref
	) => {
		const Icon = icon
			? cloneElement(icon, {className: classnames(styles.icon, classes.icon)})
			: icon
		const innerRef = useRef(null)
		const [_value, _setValue] = useState(value)
		useEffect(() => {
			_setValue(value)
		}, [value])

		const _onChange = useCallback(
			e => {
				if (onChange) {
					_setValue(e.target.value)
					onChange(e)
				}
			},
			[onChange]
		)

		const clear = useCallback(() => {
			const elRef = inputRef || ref || innerRef
			_setValue('')
			onChange &&
				onChange({
					target: {
						value: '',
						focus: () => elRef?.current?.focus(),
					},
				}) //todo: this is unstable
			elRef?.current?.focus()
		}, [inputRef, onChange, ref])

		const InputComponent = multiline ? 'textarea' : 'input'

		return (
			<div
				className={classnames(
					styles.wrapper,
					fullWidth && styles.fullWidth,
					error && styles.error
				)}
			>
				<Box
					className={classnames(
						styles.root,
						className,
						classes.root,
						multiline && styles.multiline
					)}
					{...rootProps}
				>
					{startActions && (
						<div className={styles.startActions}>{startActions}</div>
					)}
					<div className={styles.inputArea}>
						{Icon}
						<InputComponent
							ref={inputRef || ref || innerRef}
							type={type}
							onChange={_onChange}
							disabled={disabled}
							value={_value}
							placeholder={placeholder}
							className={classnames(
								styles.input,
								classes.input,
								Icon && styles.pl,
								clearable && styles.pr
							)}
							{...inputProps}
						/>
						{clearable && typeof _value === 'string' && _value !== '' && (
							<IconButton
								size={'medium'}
								variant={'small'}
								onClick={clear}
								className={styles.clearIcon}
							>
								<CrossIcon />
							</IconButton>
						)}
					</div>
					{endActions && <div className={styles.endActions}>{endActions}</div>}
				</Box>
				{helperText && (
					<Typography
						variant={'caption'}
						className={classnames(styles.helperText)}
					>
						{helperText}
					</Typography>
				)}
			</div>
		)
	}
)

export default Input
