import fetch from "node-fetch";
import { formatGetURL, IParams } from "./utils";
import { ITracemoeResponseSuccess, ITracemoeResponseError } from "#acg_search/types/Tracemoe";

const _api = {
	trace_moe_search: "https://api.trace.moe/search"
}

export function traceMoeSerach( params: IParams | undefined ): Promise<ITracemoeResponseSuccess | ITracemoeResponseError> {
	const url = formatGetURL( _api.trace_moe_search, {
		...params
	} );
	
	return new Promise( ( resolve, reject ) => {
		fetch( url ).then( async ( result: Response ) => {
			
			if ( result.ok ) {
				const res = await result.json();
				resolve( res );
			}
			reject( new Error( "ERROR" ) );
		} ).catch( ( err: Error ) => {
			reject( err );
		} )
	} )
}