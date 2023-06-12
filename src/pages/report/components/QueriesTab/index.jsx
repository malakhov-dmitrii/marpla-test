import React, {useCallback, useState, useEffect, useRef} from 'react'
import {
	countOccurrences,
	divideNumber, getRawData,
	getTodayAndYesterdayKeys,
	objectCountKeys,
} from "../../../../utils/utils.js"
import QueriesAndWordsTables from '../QueriesAndWordsTables'

import Card from '../../../../components/Card'
import Tabs from '../../../../components/Tabs'
import Tab from '../../../../components/Tab'
import CustomTab from '../../../../components/CustomTab'
import CardContent from '../../../../components/CardContent'
import FormControl from '@mui/material/FormControl'
import RadioGroup from '@mui/material/RadioGroup'
import RadioLabel from '../../../../components/RadioLabel'

import styles from './index.module.scss'

export default function QueriesTab(props) {
	const {
		radios,
		setQueriesCount,
		setQueriesTabData,
		chartData,
	} = props

	const [response, setResponse] = useState(null)
	const [rangeTab, setRangeTab] = useState('all')
	const [radioValue, setRadioValue] = useState('all')
	const editDialogPortalRef = useRef(null)
	const radiosRef = useRef(null)

	const loadData = useCallback(
		async () => {
			const _response = await getRawData("/mock/tables.json")
			const {todayKey} = getTodayAndYesterdayKeys(
				_response.tables_cols
			)
			const wordsInIndex = {}

			const tablesDataAll = {..._response.tables_data.all.all}
			_response.tables_data_id_to_row = {}
			_response.word_to_phrase_ids = {}
			_response.all_phrases = new Set()
			_response.chart_data = {}
			const radiosKeys = Object.keys(radios)
			const tabsKeys = Object.keys(_response.tabs)
			;['tables_data', 'word'].forEach(responseKey => {
				tabsKeys.forEach(tab => {
					if (!_response[responseKey][tab]) {
						_response[responseKey][tab] = {}
					}
					if (!_response.word_to_phrase_ids[tab]) {
						_response.word_to_phrase_ids[tab] = {}
					}
					radiosKeys.forEach(key => {
						if (!_response.word_to_phrase_ids[tab][key]) {
							_response.word_to_phrase_ids[tab][key] = {}
						}

						if (
							!_response[responseKey][tab][key] ||
							objectCountKeys(_response[responseKey][tab][key]) === 0
						) {
							_response[responseKey][tab][key] = []
						}
						const items = _response[responseKey][tab][key]

						if (responseKey === 'tables_data') {
							const _items = Array.isArray(items) ? items : Object.keys(items)
							_response[responseKey][tab][key] = _items.map(itemId => {
								itemId = Number(itemId)
								const rowValues = tablesDataAll[itemId]
								const rowEntries = _response.tables_cols.map(
									(columnTitle, columnIndex) => {
										return [columnTitle, rowValues[columnIndex] || null]
									}
								)
								rowEntries.push(['id', itemId])
								const rowObject = Object.fromEntries(rowEntries)
								if (rowObject['Частота WB'] === null) {
									rowObject['Частота WB'] = 0
								}
								const currentPhraseWords = rowObject['Запрос'].split(' ')
								rowObject.words = currentPhraseWords

								currentPhraseWords.forEach(word => {
									if (!_response.word_to_phrase_ids[tab][key][word]) {
										_response.word_to_phrase_ids[tab][key][word] = [itemId]
									} else if (
										!_response.word_to_phrase_ids[tab][key][word].includes(
											itemId
										)
									) {
										_response.word_to_phrase_ids[tab][key][word].push(itemId)
									}
								})

								if (typeof rowObject[todayKey] === 'number') {
									currentPhraseWords.forEach(
										wordInIndex => (wordsInIndex[wordInIndex] = true)
									)
								}
								_response.all_phrases.add(rowObject['Запрос'])
								_response.tables_data_id_to_row[itemId] = rowObject
								return rowObject
							})

							if (/top_\d+/.test(key)) {
								const top = Number(key.split('_')[1])
								const allWords = []
								_response[responseKey][tab][key] = _response[responseKey][
									tab
								].all.filter(r => {
									const condition =
										typeof r[todayKey] === 'number' && r[todayKey] <= top
									if (condition) {
										allWords.push(
											...Array.from(new Set(r['Запрос'].split(' ')))
										)
										return true
									}
								})
								const uniqueWords = Array.from(new Set(allWords))
								_response.word[tab][key] =
									uniqueWords.map(word => {
										const found = _response.word.all.all.find(
											r => r.word === word
										)
										const mentions = countOccurrences(allWords, word)
										return {
											...found,
											mention: mentions,
											unique_mentions: mentions,
										}
									}) || {}
							}
						} else if (responseKey === 'word') {
							_response.word[tab][key].forEach(row => {
								row.in_index = wordsInIndex[row.word] || false
							})
						}
					})
				})
			})
			console.log({_response})
			setResponse(_response)
			setQueriesCount(_response.tables_data.all.all.length)
		},
		[radios, setQueriesCount]
	)

	const onChangeRangeTab = useCallback((_, tab) => {
		setRangeTab(tab)
		setRadioValue('all')
	}, [])


	useEffect(() => {
		;(async () => {
			await loadData()
		})()
	}, [loadData])

	return (
		<>
			{response && (
				<Tabs value={rangeTab} onChange={onChangeRangeTab} divider>
					{Object.entries(response.tabs)
						.sort(a => (a[0] === 'all' ? -1 : 1))
						.map(([tabValue, tabName]) => {
							return (
								<Tab
									key={tabValue}
									label={

											<CustomTab
												label={tabName}
												count={`${divideNumber(
													response.tables_data[tabValue].found.length
												)} / ${divideNumber(
													response.tables_data[tabValue].all.length
												)}`}
											/>
									}
									value={tabValue}
								/>
							)
						})}
				</Tabs>
			)}
			<CardContent>
				{response && (
						<Card inner sx={{mb: 3}} ref={radiosRef}>
							<CardContent compact>
								<FormControl onChange={e => setRadioValue(e.target.value)}>
									<RadioGroup className={styles.radios}>
										{response.tables_data[rangeTab].all.length === 0 && (
											<RadioLabel
												checked={true}
												value={'all'}
												label="Все"
												count={0}
											/>
										)}
										{Object.entries(radios)
											.filter(([value]) => !/^top_/.test(value))
											.map(([value, {label, color}]) => {
												const count = response
													? response.tables_data[rangeTab][value].length
													: 0
												if (count === 0) return null
												return (
													<RadioLabel
														key={value}
														checked={value === radioValue}
														value={value}
														label={label}
														count={count}
														color={color}
													/>
												)
											})}
											{Object.entries(radios)
												.filter(([value]) => /^top_/.test(value))
												.map(([value, {label, color}]) => {
													const count = response
														? response.tables_data[rangeTab][value].length
														: 0
													if (count === 0) return null
													return (
														<RadioLabel
															key={value}
															checked={value === radioValue}
															value={value}
															label={label}
															count={count}
															color={color}
														/>
													)
												})}
									</RadioGroup>
								</FormControl>
							</CardContent>
						</Card>
				)}

				<QueriesAndWordsTables
					response={response}
					rangeTab={rangeTab}
					radioValue={radioValue}
					updateData={loadData}
					editDialogPortalRef={editDialogPortalRef}
					setQueriesTabData={setQueriesTabData}
					radiosRef={radiosRef}
				/>
			</CardContent>
		</>
	)
}
