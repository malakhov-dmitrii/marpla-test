import React from 'react'
import {arrayEnd, divideNumber} from '../../../utils/utils.js'
import CellValue from '../../../components/CellValue'
import shortNumber from 'short-number'
import format from 'date-fns/format'
import subDays from 'date-fns/subDays'
import parse from 'date-fns/parse'

const valueGetter = ({value}) => (value === null ? null : value)

const renderDateCell = (params, _options = {}) => {
	const options = Object.assign(
		{
			reverse: false,
			color: true,
			shorten: true,
			props: {},
		},
		_options
	)

	if (params.value === null) return <CellValue value="-" {...options.props} />

	if (typeof params.value !== 'number') return params.value

	const value = params.value

	if (value === 1 && options.reverse) {
		return <CellValue value={value} {...options.props} color="green" />
	}

	if (value > 99990 && value < 99998) {
		return (
			<CellValue
				value={`${arrayEnd(String(value).split(''))}K+`}
				{...options.props}
				color="blue"
			/>
		)
	}
	if (value === 99998) {
		return <CellValue value="10K+" {...options.props} color="blue" />
	}
	if (value === 99999) {
		return <CellValue value="18K+" {...options.props} color="blue" />
	}

	const todayDate = parse(params.field, 'dd.MM', new Date())
	const yesterdayKey = format(subDays(todayDate, 1), 'dd.MM')
	const prevColumnValue = params.row[yesterdayKey]
	const isTopValue = value === params.row.top

	const renderValue = options.shorten ? shortNumber(value) : divideNumber(value)

	if (isTopValue) {
		return <CellValue value={renderValue} {...options.props} color="green" />
	}

	if (typeof prevColumnValue !== 'number') {
		return (
			<CellValue value={renderValue} faded={!isTopValue} {...options.props} />
		)
	}

	if (!options.color) {
		return (
			<CellValue value={renderValue} faded={!isTopValue} {...options.props} />
		)
	}
	let color
	if (value < prevColumnValue) {
		color = options.reverse ? 'green' : 'red'
	} else if (value > prevColumnValue) {
		color = options.reverse ? 'red' : 'green'
	} else {
		color = options.color
	}
	return (
		<CellValue
			value={renderValue}
			faded={!isTopValue}
			{...options.props}
			color={color}
		/>
	)
}

const renderFixedCell = params => {
	if (params.value === null) return '-'
	if (params.value === true) return <CellValue status="success" noSpacing />
	if (typeof params.value !== 'number') return params.value
	const value = params.value
	if (value > 99990 && value < 99998) {
		return (
			<CellValue
				value={`${arrayEnd(String(value).split(''))}K+`}
				color="blue"
				noSpacing
			/>
		)
	}
	if (value === 99998) {
		return <CellValue value="10K+" color="blue" noSpacing />
	}
	if (value === 99999) {
		return <CellValue value="18K+" color="blue" noSpacing />
	}

	const renderValue = divideNumber(value)

	return params.field === 'top' ? (
		<CellValue
			value={renderValue}
			color="transparent"
			style={{color: '#519600'}}
			noSpacing
		/>
	) : (
		<CellValue value={renderValue} color="transparent" noSpacing />
	)
}

const renderReverseFixedCell = params =>
	renderFixedCell(params, {reverse: true})

const renderReverseDateCell = params => renderDateCell(params, {reverse: true})

export {
	valueGetter,
	renderDateCell,
	renderFixedCell,
	renderReverseFixedCell,
	renderReverseDateCell,
}
