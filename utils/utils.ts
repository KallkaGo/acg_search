export interface IParams {
	[fieldName: string]: string | number
}

export function formatGetURL( url: string, params: IParams | undefined ): string {
	if ( !params ) return url;
	let paramsStr = "https://images.weserv.nl/";
	for ( const key in params ) {
		paramsStr += `?${ key }=${ encodeURIComponent( params[key] ) }`;
	}
	
	return `${ url }?anilistInfo&url=${ paramsStr.substring( 0 ) }`
}

export function formatRowMessage( message: string[] ) {
	let rowMessage = "";
	for ( const m of message ) {
		rowMessage += `\n${ m }`;
	}
	return rowMessage.substring( 1 );
}