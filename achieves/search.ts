import bot from "ROOT";
import { InputParameter } from "@modules/command";
import { formatRowMessage } from "#acg_search/utils/utils";
import { traceMoeSerach } from "#acg_search/utils/api";
import { config } from "#acg_search/init";
import { ImageElem, GroupMessage, PrivateMessage, User, Group, AtElem } from 'icqq';
import { ITracemoeResponseError, ITracemoeResponseSuccess, IResult } from "#acg_search/types/Tracemoe";
import { isPrivateMessage } from "@modules/message";


enum ErrorMsg {
	CANNOT_AT = "未开启 at 查询头像功能",
	NOT_FOUNT = "未找到类似图片",
	EMPTY = "请在指令后跟随图片",
	EMPTY_AT = "请在指令后跟随图片或@用户",
	OVERFLOW = "不得超过两张图片",
	ERROR_MESSAGE = "识图api请求出错",
	REPLY_ERROR = "获取回复消息失败",
	REPLY_GET_ERROR = "*回复消息获取失败,请重试或联系管理员",
	INCOMPLETE_RESULTS = "*服务端异常，结果可能不完全"
}

type IMessage = GroupMessage | PrivateMessage


const keyToDiy = {
	anilist: '番名',
	episode: "集数",
	similarity: "相似度",
	image: '图片'
}

export async function main({ sendMessage, messageData, logger, client }: InputParameter): Promise<void> {
	const { message, message_type, source } = messageData;
	const IsReply: boolean = !!source
	let ReplyImage: ImageElem[] = []
	let isError: boolean = false

	/* 回复查询功能 */
	if (source) {
		try {
			let replyData: GroupMessage[] | PrivateMessage[] = []

			if (isPrivateMessage(messageData)) {
				const { user_id, time } = source
				const user: User = client.pickUser(user_id)
				replyData = await user.getChatHistory(time, 1)
			} else {
				const { seq } = source
				const group: Group = client.pickGroup(messageData.group_id)
				replyData = await group.getChatHistory(seq, 1)

			}

			/* 边界判断 */
			if (!replyData.length) {
				throw new Error('未获取到回复的信息')
			}

			ReplyImage.push(...<ImageElem[]>replyData.map((perMsg: IMessage) => perMsg.message[0]).filter((item) => item.type === 'image'))

		} catch (error) {
			isError = true
			logger.error(`rrorMsg.REPLY_ERROR${(<Error>error)?.message ?? ''}`)
		}
	}

	const recImage = <Array<ImageElem>>message.filter(m => m.type === "image");
	const recAt = <Array<AtElem>>message.filter(m => m.type === "at");

	const recMessage: Array<ImageElem | AtElem> = [...ReplyImage, ...recImage];

	/* 开启at 未reply */
	if (config.at && !IsReply) recMessage.push(...recAt)

	if (!recMessage.length) {
		if (config.at && !IsReply) {
			await sendMessage(ErrorMsg.EMPTY_AT);
		} else {
			await sendMessage(recAt.length ? ErrorMsg.CANNOT_AT : ErrorMsg.EMPTY);
		}
		return;
	}



	if (recMessage.length > 2) {
		await sendMessage(ErrorMsg.OVERFLOW);
		return;
	}

	const rowMessageArr: string[] = [];

	/* 群聊@换行处理 */
	if (message_type === "group" && bot.config.atUser) {
		rowMessageArr.push(" ");
	}

	if (isError) rowMessageArr.push(ErrorMsg.REPLY_GET_ERROR);


	!config.multiple && (recMessage.length = 1);

	let imgIndex = 0;

	for (const rec of recMessage) {
		imgIndex++
		config.multiple && rowMessageArr.push(`---第${imgIndex}张搜索结果---`);
		let url: string;
		if (rec.type === "image") {
			url = `https://images.weserv.nl/?url=${rec.url}`;
		} else {
			url = `https://q1.qlogo.cn/g?b=qq&s=640&nk=${rec.qq}`;
		}


		let result: ITracemoeResponseSuccess | ITracemoeResponseError;
		try {
			result = await traceMoeSerach({ url });

		} catch (error) {
			logger.error(error);
			rowMessageArr.push(ErrorMsg.ERROR_MESSAGE);
			continue;
		}

		/* 获取前两个相似度匹配的数据 */
		const gottenResult = (<ITracemoeResponseSuccess>result).result.filter((r: IResult) => Number(r.similarity) * 100 >= config.similarity).slice(0, 2);

		if (!gottenResult.length) {
			rowMessageArr.push(ErrorMsg.NOT_FOUNT);
			continue;
		}

		const sendMessageObj: { [field: string]: any } = {};

		/* 生成返回数据对象方法 */
		const setMessageData = (data: IResult, key: string, diyKey: string) => {

			if (data[key] && !sendMessageObj[diyKey]) {
				if (data[key] instanceof Object) {
					data[key] = `${data[key].title.native} | ${data[key].title.english}`
				}
				if (key === 'image') {
					 sendMessageObj[diyKey] = {
						type: "image",
						file: data[key],
						origin: false
					}
					return
				}
				if (key === 'similarity') data[key] = Number(data[key]!.toFixed(2))
				sendMessageObj[diyKey] = data[key];
			}
		}

		/* 生成返回数据对象 */
		for (const data of gottenResult) {

			for (const k in keyToDiy) {
				setMessageData(data, k, keyToDiy[k]);
			}
		}

		/* 根据数据对象生成返回数据 */
		for (const sKey in sendMessageObj) {
			if (sKey !== '图片') {
				rowMessageArr.push(`${sKey}：${sendMessageObj[sKey]}`);
			} else {
				rowMessageArr.push(sendMessageObj[sKey])
			}

		}
	}
	const sliceIndex = rowMessageArr.length - 1
	await sendMessage([formatRowMessage(rowMessageArr.slice(0,sliceIndex)),rowMessageArr[rowMessageArr.length - 1]]);
}
