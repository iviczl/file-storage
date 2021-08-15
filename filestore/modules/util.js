import fs from 'fs'

export function loadSettings(settingsFile) {
	if(!settingsFile) {
		console.error('There are not any settingsFile specified.')
	}
	let settings
	try {
		let data = fs.readFileSync(fs.realpathSync(settingsFile), 'utf8')
		return JSON.parse(data)
		//settings = await((await fetch(`${settingsFile}`)).json())
	}
	catch(error) {
		console.error(`An error happened while loading settings.` + error)
	}
}

export function optionList(raw, valueProperty, titleProperty) {
	return raw.map(o => { return { value: o[valueProperty], title: o[titleProperty] } })
}

