export interface ITraceResult {
	frameCount:number
	error:string
	result: {
		anilist?: number | object
		filename?: string
		from?: string
		to?: number
		similarity?: number
		video?:	string
		image?:string
	}
}

export interface ITracemoeResponseSuccess {
	result: ITraceResult[]
}

export interface ITracemoeResponseError {
	error:string
}