export interface IResult {
	anilist?: number | object
	filename?: string
	from?: string
	to?: number
	similarity?: number
	video?: string
	image?: string
}


export interface ITracemoeResponseSuccess {
	frameCount: number
	error: string
	result: IResult[]
}

export interface ITracemoeResponseError {
	error: string
}


