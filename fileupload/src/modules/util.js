
export async function loadSettings(settingsFile) {
	if(!settingsFile) {
		throw new Error('There are not any settingsFile specified.');
	}
	let settings;
	try {
		settings = await((await fetch(`${settingsFile}`)).json());
	}
	catch(error) {
			console.error(`An error happened while loading settings.` + error);
	}
	return settings;
}

export function optionList(raw, valueProperty, titleProperty) {
	return raw.map(o => { return { value: o[valueProperty], title: o[titleProperty] }; });
}

