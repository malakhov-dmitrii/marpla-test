import React, {forwardRef} from 'react'
import {createPortal} from 'react-dom'

import Button from '../../../../components/Button'
import IconButton from '../../../../components/IconButton'

import FilterIcon from '../../../../icons/Filter'
import FileDownloadIcon from '../../../../icons/FileDownload'

const BaseButton = forwardRef((props, ref) => {
	const {filterButtonContainerEl, isFiltersActivated, ...rest} = props
	if (props.children === 'Фильтры') {
		if (filterButtonContainerEl.current) {
			return createPortal(
				<IconButton
					onBlur={props.onBlur}
					onClick={props.onClick}
					onFocus={props.onFocus}
					onMouseLeave={props.onMouseLeave}
					onMouseOver={props.onMouseOver}
					onTouchEnd={props.onTouchEnd}
					onTouchStart={props.onTouchStart}
					variant={isFiltersActivated ? 'blue' : 'secondary'}
					size="medium"
				>
					<FilterIcon />
				</IconButton>,
				filterButtonContainerEl.current
			)
		} else {
			return null
		}
	} else if (props.children === 'Экспорт') {
		return (
			<IconButton
				ref={ref}
				onBlur={props.onBlur}
				onClick={props.onClick}
				onFocus={props.onFocus}
				onMouseLeave={props.onMouseLeave}
				onMouseOver={props.onMouseOver}
				onTouchEnd={props.onTouchEnd}
				onTouchStart={props.onTouchStart}
				variant="secondary"
			>
				<FileDownloadIcon />
			</IconButton>
		)
	} else if (
		props.children === 'Remove all' ||
		props.children === 'Добавить фильтр' ||
		props.children === 'Показать все' ||
		props.children === 'Скрыть все'
	) {
		return (
			<Button ref={ref} {...rest} size="small">
				{props.children === 'Remove all' ? 'Очистить фильтры' : props.children}
			</Button>
		)
	} else {
		console.log(props.children)
		return <Button {...rest} ref={ref} />
	}
})

export default BaseButton
