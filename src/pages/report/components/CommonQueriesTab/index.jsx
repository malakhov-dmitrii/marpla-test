import React, {useCallback, useState, useEffect, useMemo} from 'react'
import {divideNumber, getRawData, isNumeric, mapObject} from "../../../../utils/utils.js"
import {phraseValidate} from '../../../../utils/regExps.js'

import Card from '../../../../components/Card'
import Tabs from '../../../../components/Tabs'
import Tab from '../../../../components/Tab'
import CustomTab from '../../../../components/CustomTab'
import CardContent from '../../../../components/CardContent'
import FormControl from '@mui/material/FormControl'
import RadioGroup from '@mui/material/RadioGroup'
import RadioLabel from '../../../../components/RadioLabel'
import CommonQueriesTables from '../CommonQueriesTables'

import styles from './index.module.scss'

const allListTemplate = {
	0: {
		name: 'Все запросы',
		id: '0',
		phrases: {all: []},
		words: {all: []},
		allWords: [],
	},
}

const tops = [
	{min: 1, max: 1, value: 'top_1_1', label: 'МЕСТО 1', color: '#178AF1'},
	{min: 2, max: 5, value: 'top_2_5', label: 'МЕСТО 2-5', color: '#178AF1'},
	{min: 6, max: 10, value: 'top_6_10', label: 'МЕСТО 6-10', color: '#178AF1'},
	{
		min: 11,
		max: 50,
		value: 'top_11_50',
		label: 'МЕСТО 11-50',
		color: '#178AF1'
	},
	{
		min: 51,
		max: 100,
		value: 'top_51_100',
		label: 'МЕСТО 51-100',
		color: '#178AF1'
	},
	{
		min: 101,
		max: 500,
		value: 'top_101_500',
		label: 'МЕСТО 101-500',
		color: '#178AF1'
	},
]

export default function CommonQueriesTab(props) {
	const {
		radios: _radios,
		setCommonQueriesCount,
		queriesTabData,
	} = props

	const radios = useMemo(
		() => ({
			..._radios,
			...Object.fromEntries(
				[200, 300, 400, 500].map(amount => [
					`top_${amount}`,
					{
						label: `ТОП-${amount}`,
						color: '#178AF1',
					},
				])
			),
		}),
		[_radios]
	)

	const [rangeTab, setRangeTab] = useState('0')
	const [radioValue, setRadioValue] = useState('all')
	const [existenceInProjectRadioValue, setExistenceInProjectRadioValue] =
		useState('all')
	const [lists, setLists] = useState({...allListTemplate})

	const onChangeRangeTab = useCallback((_, tab) => {
		setRangeTab(tab)
		setRadioValue('all')
	}, [])

	const loadData = useCallback(async () => {
		const {items} = await getRawData("/mock/fas-initial.json")
		const allPhrases = new Set()
		const allWordsObj = {}
		const allWordsArr = []
		items.forEach(item => {
			const {q, popular_wb} = item
			allPhrases.add(q)
			const words = q.split(' ').filter(w => phraseValidate(w))
			item.words = words
			allWordsArr.push(...Array.from(new Set(words)))
			words.forEach(word => {
				if (allWordsObj[word]) {
					allWordsObj[word].popular_wb += isNumeric(popular_wb)
						? Number(popular_wb)
						: 0
					if (!allWordsObj[word].phrases.includes(q)) {
						allWordsObj[word].phrases.push(q)
					}
				} else {
					allWordsObj[word] = {
						popular_wb: isNumeric(popular_wb) ? Number(popular_wb) : 0,
						phrases: [q],
					}
				}
			})
		})
		const allWordsRows = Object.entries(allWordsObj).map(
			([word, {popular_wb, phrases /*, mentions*/}]) => ({
				word,
				popular_wb,
				phrases,
				mentions: null,
			})
		)

		const _lists = {}

		const topLists = {phrases: {}, words: {}, allWords: {}}
		const excludePhrasesSet = new Set()
		await Promise.all(
			tops.map(
				({min, max, value}) =>
					new Promise(resolve => {
						;(async () => {
							const {items} = await getRawData(`/mock/fas-${min}-${max}.json`)
							const allWordsToPhrases = {}
							const allWords = []
							const phrases = []
							items.forEach(({q, popular_wb}) => {
								if (!excludePhrasesSet.has(q)) {
									allPhrases.add(q)
									excludePhrasesSet.add(q)
									const currentPhraseWords = Array.from(
										new Set(q.split(' ').filter(w => phraseValidate(w)))
									)
									currentPhraseWords.forEach(word => {
										allWords.push(word)
										if (allWordsToPhrases[word]) {
											allWordsToPhrases[word].push(q)
										} else {
											allWordsToPhrases[word] = [q]
										}
									})
									phrases.push({
										q,
										words: currentPhraseWords,
										popular_wb: isNumeric(popular_wb)
											? Number(popular_wb)
											: null,
									})
								}
							})
							const words = Object.entries(allWordsToPhrases).map(
								([word, phrases]) => ({
									word,
									popular_wb: allWordsObj?.[word]?.popular_wb || null,
									phrases,
									mentions: null,
								})
							)
							topLists.phrases[value] = phrases
							topLists.words[value] = words
							topLists.allWords[value] = allWords
							resolve()
						})()
					})
			)
		)

		setLists(() => ({
			[allListTemplate[0].id]: {
				...allListTemplate[0],
				phrases: {
					all: items,
					...topLists.phrases,
				},
				words: {
					all: allWordsRows,
					...topLists.words,
				},
				allWords: {
					all: allWordsArr,
					...topLists.allWords,
				},
			},
			...mapObject(_lists, (_, {name, id, phrases}) => {
				const wordsToPhrases = {}
				const allWords = []
				const _phrases = Object.values(phrases).map(([phrase, popular_wb]) => {
					allPhrases.add(phrase)
					const currentPhraseWords = Array.from(
						new Set(phrase.split(' ').filter(w => phraseValidate(w)))
					)
					currentPhraseWords.forEach(word => {
						allWords.push(word)
						if (wordsToPhrases[word]) {
							wordsToPhrases[word].push(phrase)
						} else {
							wordsToPhrases[word] = [phrase]
						}
					})
					return {
						q: phrase,
						words: currentPhraseWords,
						popular_wb,
					}
				})

				return [
					id,
					{
						name,
						id: String(id),
						phrases: {all: _phrases},
						words: {
							all: Object.entries(wordsToPhrases).map(([word, phrases]) => ({
								word,
								phrases,
								popular_wb:
									typeof allWordsObj[word]?.popular_wb === 'number'
										? allWordsObj[word].popular_wb
										: 0,
								mentions: null,
							})),
						},
						allWords: {all: allWords},
					},
				]
			}),
		}))

		setCommonQueriesCount(allPhrases.size)
	}, [setCommonQueriesCount])

	useEffect(() => {
		;(async () => {
			await loadData()
		})()
	}, [loadData])

	return (
		<>
			{lists && (
				<Tabs value={rangeTab} onChange={onChangeRangeTab} divider>
					{Object.values(lists)
						.map(({name, phrases, id}) => {
							return (
								<Tab
									key={id}
									label={
										<CustomTab
											label={name}
											count={divideNumber(phrases.all.length)}
										/>
									}
									value={id}
								/>
							)
						})}
				</Tabs>
			)}
			<CardContent>
				<Card inner sx={{mb: 3}}>
					<CardContent compact>
						<FormControl onChange={e => setRadioValue(e.target.value)}>
							<RadioGroup className={styles.radios}>
								{lists[rangeTab].phrases.all.length === 0 && (
									<RadioLabel
										checked={true}
										value="all"
										label="Все"
										count={0}
									/>
								)}
								{Object.entries(radios)
									.filter(([value]) => !/^top_/.test(value))
									.map(([value, {label, color}]) => {
										const count = lists[rangeTab].phrases?.[value]?.length || 0
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
								<div className={styles.topRadios}>
									{tops.map(({value, label, color}) => {
										const count = lists[rangeTab].phrases?.[value]?.length || 0
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
								</div>
							</RadioGroup>
						</FormControl>
					</CardContent>
				</Card>

				<Card inner sx={{mb: 3}}>
					<CardContent compact>
						<FormControl>
							<RadioGroup
								className={styles.radios}
								onChange={e => setExistenceInProjectRadioValue(e.target.value)}
								value={existenceInProjectRadioValue}
							>
								<RadioLabel
									value="all"
									label="Все"
									//count={0}
								/>
								<RadioLabel
									value="added"
									label="Добавлено в проект"
									//count={0}
								/>
								<RadioLabel
									value="not_added"
									label="Не добавлено в проект"
									//count={0}
								/>
							</RadioGroup>
						</FormControl>
					</CardContent>
				</Card>

				<CommonQueriesTables
					lists={lists}
					rangeTab={rangeTab}
					radioValue={radioValue}
					queriesTabData={queriesTabData}
					existenceInProjectRadioValue={existenceInProjectRadioValue}
				/>
			</CardContent>
		</>
	)
}
