import React from 'react'

import Input from '../../../../components/Input'
import IconButton from '../../../../components/IconButton'

import MinusIcon from '../../../../icons/Minus'
import EqualIcon from '../../../../icons/Equal'
import ArrowDownIcon from '../../../../icons/ArrowDown'
import FilterIcon from '../../../../icons/Filter'

import styles from './index.module.scss'

export default function BaseTextField(props) {
	const {
		addToCurrentList,
		currentAction,
		isEqualsActivated,
		isLoadingAction,
		isMinusActivated,
		isFiltersButtonsDisabled,
		setIsEqualsActivated,
		setIsMinusActivated,
		setIsFiltersButtonsDisabled,
		inputValueRef,
		filterButtonContainerEl,
		isAddButtonDisabled,
	} = props

	if (props.type === 'search') {
		return (
			<Input
				{...props}
				onChange={e => {
					props?.onChange(e)
					inputValueRef.current = e.target.value.trim()
					if (inputValueRef.current === '') {
						setIsEqualsActivated(false)
						setIsMinusActivated(false)
						setIsFiltersButtonsDisabled(true)
					} else {
						setIsFiltersButtonsDisabled(false)
					}
					e.target.focus()
				}}
				type={'text'}
				className={styles.w600}
				placeholder={'Поиск'}
				startActions={
					<div
						ref={filterButtonContainerEl}
						className={styles.filterButtonContainer}
					>
						<IconButton variant="secondary" size="medium">
							<FilterIcon />
						</IconButton>
					</div>
				}
				endActions={
					<>
						<IconButton
							size="medium"
							variant={isMinusActivated ? 'blue' : 'secondary'}
							onClick={() => {
								setIsMinusActivated(prev => !prev)
								setIsEqualsActivated(false)
							}}
							disabled={isFiltersButtonsDisabled}
						>
							<MinusIcon />
						</IconButton>
						<IconButton
							size="medium"
							variant={isEqualsActivated ? 'blue' : 'secondary'}
							onClick={() => {
								setIsEqualsActivated(prev => !prev)
								setIsMinusActivated(false)
							}}
							disabled={isFiltersButtonsDisabled}
						>
							<EqualIcon />
						</IconButton>
						<IconButton
							size="medium"
							variant="secondary"
							disabled={isFiltersButtonsDisabled || isAddButtonDisabled}
							onClick={addToCurrentList}
							isLoading={isLoadingAction && currentAction.id === 'add'}
						>
							<ArrowDownIcon />
						</IconButton>
					</>
				}
			/>
		)
	} else {
		return <Input {...props} type={'text'} className={undefined} />
	}
}
