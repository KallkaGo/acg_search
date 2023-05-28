export interface IParams {
	[fieldName: string]: string | number
}

export function formatGetURL(url: string, params: IParams | undefined): string {
	if (!params) return url;
	let paramsStr = "";
	for (const key in params) {
		paramsStr += `&${key}=${encodeURIComponent(params[key])}`;
	}

	return `${url}?anilistInfo${paramsStr.substring(0)}`
}

export function formatRowMessage(message: string[]) {
	let rowMessage = "";
	for (const m of message) {
		rowMessage += `\n${m}`;
	}
	return rowMessage.substring(1);
}



export function decideImageKey(key: string) {
	return (key !== '图片')
}

export function handleSendMessage(flag: boolean, sendMessage: string[], sliceIndex: number) {
	return flag
		? [formatRowMessage(sendMessage.slice(0, sliceIndex)), sendMessage[sendMessage.length - 1]]
		: formatRowMessage(sendMessage);
}