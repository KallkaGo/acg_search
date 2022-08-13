import bot from "ROOT";
import { BOT } from "@modules/bot";
import SearchConfig from "#acg_search/module/config";
import { PluginSetting } from "@modules/plugin";
import { OrderConfig } from "@modules/command";
import FileManagement from "@modules/file";

export let config: SearchConfig
// export let keys: SearchKey

const search: OrderConfig = {
	type: "order",
	cmdKey: "Kallka-go.acg-search",
	desc: [ "以图识番", "[图片]" ],
	headers: [ "acg_search" ],
	regexps: [ "[\\w\\W]+" ],
	main: "achieves/search",
	detail: "附带图片发送，使用trace.moe搜索\n"
		
};


function loadConfig( file: FileManagement ): SearchConfig {
	const initConfig = SearchConfig.init;
	
	const path = file.getFilePath( SearchConfig.configName + ".yml" );
	const isExit = file.isExist( path );
	
	if ( !isExit ) {
		file.createYAML( SearchConfig.configName, initConfig );
		return new SearchConfig( initConfig );
	}
	
	const config = file.loadYAML( SearchConfig.configName );
	
	const keysNum = ( o: any ) => Object.keys( o ).length;
	
	/* 自动填充当前配置缺少的字段 */
	if ( keysNum( initConfig ) !== keysNum( config ) ) {
		const c: any = {};
		for ( const cKey of Object.keys( initConfig ) ) {
			c[cKey] = config[cKey] || initConfig[cKey];
		}
		file.writeYAML( SearchConfig.configName, c );
		return new SearchConfig( c );
	}
	
	return new SearchConfig( config );
}


export async function init( { file }: BOT ): Promise<PluginSetting> {
	
	config = loadConfig( file );
	// keys = new SearchKey( config );
	
	bot.refresh.registerRefreshableFile( SearchConfig.configName, config );
	
	return {
		pluginName: "acg_search",
		cfgList: [ search ]
	};
}