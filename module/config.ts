import { RefreshCatch } from "@modules/management/refresh";


export interface ISearchConfig {
	tip: string
	at: boolean
	multiple: boolean
	similarity: number
	
}

export default class SearchConfig {
	public at: boolean;
	public multiple: boolean;
	public similarity: number;

	
	public static configName = "acg_search";
	
	public static init = {
		tip: "以图识番插件配置文件",
		at: true,
		multiple: true,
		similarity: 70,
		
	}
	
	constructor( config: ISearchConfig ) {
		this.at = config.at;
		this.multiple = config.multiple;
		this.similarity = config.similarity;
	}
	
	public async refresh( config: ISearchConfig ): Promise<string> {
		try {
			this.at = config.at;
			this.multiple = config.multiple;
			this.similarity = config.similarity;
			return `${ SearchConfig.configName }.yml 重新加载完毕`;
		} catch ( error ) {
			throw <RefreshCatch>{
				log: ( <Error>error ).stack,
				msg: `${ SearchConfig.configName }.yml 重新加载失败，请前往控制台查看日志`
			};
		}
	}
}