import React, {useState} from 'react'

import Card from '../../../../components/Card'
import CardTitle from '../../../../components/CardTitle'
import Tab from '../../../../components/Tab'
import Tabs from '../../../../components/Tabs'
import CustomTab from '../../../../components/CustomTab'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import TabPanel from '../../../../components/TabPanel/'

import QueriesTab from '../QueriesTab'
import CommonQueriesTab from '../CommonQueriesTab'

import CompareIcon from '../../../../icons/Compare'


const radios = {
	all: {
		label: 'Все',
	},
	found: {
		label: 'Найдено',
	},
	not_found: {
		label: 'Не найдено',
	},
	became: {
		label: 'Появились',
		color: '#7AC70C',
	},
	became_today: {
		label: 'Появились сегодня',
		color: '#7AC70C',
	},
	not_found_today: {
		label: 'Вылетели',
		color: '#FC4848',
	},
	out_today: {
		label: 'Вылетели сегодня',
		color: '#FC4848',
	},
	not_found_season: {
		label: 'Нет сезона',
		color: '#FEB82C',
	},
	not_found_sex: {
		label: 'Нет пола',
		color: '#FEB82C',
	},
	not_found_subject: {
		label: 'Нет предмета',
		color: '#FEB82C',
	},
	not_found_brand: {
		label: 'Бренды',
		color: '#FEB82C',
	},
	top_1: {
		label: 'ТОП-1',
		color: '#178AF1',
	},
	top_5: {
		label: 'ТОП-5',
		color: '#178AF1',
	},
	top_10: {
		label: 'ТОП-10',
		color: '#178AF1',
	},
	top_50: {
		label: 'ТОП-50',
		color: '#178AF1',
	},
	top_100: {
		label: 'ТОП-100',
		color: '#178AF1',
	},
}

export default function WorkWithQueries() {
	const [tab, setTab] = useState('queries')
	const [queriesCount, setQueriesCount] = useState(null)
	const [commonQueriesCount, setCommonQueriesCount] = useState(null)
	const [queriesTabData, setQueriesTabData] = useState(null)

	return (
		<Card>
			<CardTitle>Работа с запросами</CardTitle>

			<Box display="flex" justifyContent="space-between" width="100%">
				<Tabs value={tab} onChange={(_, tab) => setTab(tab)}>
					<Tab
						border
						label={
							<CustomTab
								label={'Фразы проекта'}
								icon={CompareIcon}
								count={queriesCount}
								isLoading={queriesCount === null}
							/>
						}
						value="queries"
					/>
					<Tab
						label={
							<CustomTab
								label={'Фразы предмета'}
								icon={CompareIcon}
								count={commonQueriesCount}
								isLoading={commonQueriesCount === null}
							/>
						}
						value='common_queries'
					/>
				</Tabs>
			</Box>
			<Divider />

			<TabPanel value={tab} index="queries">
				<QueriesTab
					data={[]}
					radios={radios}
					setQueriesCount={setQueriesCount}
					setQueriesTabData={setQueriesTabData}
				/>
			</TabPanel>

			<TabPanel value={tab} index="common_queries">
				<CommonQueriesTab
					data={[]}
					radios={radios}
					setCommonQueriesCount={setCommonQueriesCount}
					queriesTabData={queriesTabData}
				/>
			</TabPanel>
		</Card>
	)
}
