import React, {useEffect, useRef, useState} from "react"

import copy from "copy-to-clipboard"

import Box from "@material-ui/core/Box"
import Container from "@material-ui/core/Container"
import CssBaseline from "@material-ui/core/CssBaseline"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"

import "root/css/global.scss"

const importAll = r => {
	return r.keys().map(item => ({
		component: r(item).default,
		componentName: item.match(/\/(.+?)\.js$/)[1],
		tags: [],
	}))
}

const allIcons = importAll(require.context("../", false, /\.js$/))

const App = () => {
	const [query, setQuery] = useState("")
	const [icons, setIcons] = useState(allIcons)

	const tags = useRef([])

	const setTags = ({componentName, component, tags: componentTags}) => {
		if (tags.current && !tags.current.find(item => item.componentName === componentName)) {
			tags.current.push({
				componentName,
				component,
				tags: componentTags.concat(componentName),
			})
		}
	}

	const copyImport = name => {
		const importStr = `import ${name}Icon from "root/icons/${name}"`
		if (copy(importStr)) {
			alert(`Скопировано:\n${importStr}`)
		} else {
			alert("Ошибка!")
		}
	}

	useEffect(() => {
		const queryLowerCase = query.toLowerCase()
		setIcons(
			tags.current.filter(item =>
				item.tags.some(
					tag =>
						tag.toLowerCase().indexOf(queryLowerCase) !== -1 ||
						queryLowerCase.indexOf(tag.toLowerCase()) !== -1
				)
			)
		)
	}, [query])

	return (
		<>
			<CssBaseline />
			<Container maxWidth="md">
				<Box my={2}>
					<Grid
						container
						spacing={3}
					>
						<Grid
							item
							xs={12}
							sm={12}
							md={12}
							xl={12}
						>
							<TextField
								label="Название или теги"
								value={query}
								onChange={e => setQuery(e.target.value)}
								fullWidth
							/>
						</Grid>
						<Grid
							item
							xs={12}
							sm={12}
							md={12}
							xl={12}
						>
							<Typography variant="subtitle1">
								⚠ Нажмите на иконку, чтобы скопировать код импорта.
							</Typography>
						</Grid>
						<Grid
							item
							xs={12}
							sm={12}
							md={12}
							xl={12}
						>
							<Grid
								container
								spacing={3}
							>
								{icons.map(({componentName, component: Icon, tags}) => (
									<Grid
										key={componentName}
										item
										xs={4}
										sm={3}
										md={2}
										xl={2}
									>
										<Box
											display="flex"
											flexDirection="column"
											justifyContent="center"
											alignItems="center"
										>
											<Box
												flex="none"
												textAlign="center"
												mb={1}
											>
												<IconButton
													onClick={() => copyImport(componentName)}
												>
													<Icon
														getTags={tags =>
															setTags({
																componentName,
																component: Icon,
																tags,
															})
														}
													/>
												</IconButton>
											</Box>
											<Box
												textAlign="center"
												mb={1}
											>
												<Typography variant="body1">
													{componentName}
												</Typography>
											</Box>
											<Box
												textAlign="center"
												mb={1}
											>
												<Typography variant="subtitle1">
													{tags
														.map(tag => `#${tag.toLowerCase()}`)
														.join(" ")}
												</Typography>
											</Box>
										</Box>
									</Grid>
								))}
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</Container>
		</>
	)
}

export default App
