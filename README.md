# acg_search

本项目为 [Adachi-BOT][1] 的衍生插件，基于 [TraceMoe][2] 接口实现的qq机器人以图识番功能。

## 更新日志
- 暂无

## 安装插件

进入 `Adachi-BOT/src/plugins` 目录下，执行如下命令

```bash
git clone https://github.com/KallkaGo/acg_search.git
```

或通过本项目仓库左上角 `code -> Download.zip` 下载压缩包，解压至 `Adachi-BOT/src/plugins` 目录内

> 注意：若使用下载压缩包方式，请务必删除解压后目录名字中的 `-master`，否则插件无法启动

## 更新方法

进入 `Adachi-BOT/src/plugins/acg_search` 目录下，执行以下命令即可

```bash
git pull
```

当然你也可以直接 下载本项目压缩包 整包替换。

## 食用方法

初次运行会在 `Adachi-BOT/config` 目录下创建 `pic_search.yml` 配置文件，初始值如下

```yaml
tip: 以图识番插件配置文件
at: true 
multiple: true
similarity: 70
```

- tip: 没卵用的东西，删不删看你
- at: 是否开启 @用户 查询目标头像功能
- multiple: true（多图搜索，上限三张）false（单图搜索）
- similarity: 相似度，低于该值的结果将不会显示（注意：由于traceMoe搜索引擎的关系,请不要将该值设置过低，否则结果将会非常不准确(就算设置90以上也会出现牛头不对马嘴的情况)）

修改 `acg_search.yml` 后重启 bot 或执行 Adachi-BOT 的 `refresh` 重载配置文件指令生效

你可以选择自行创建该文件，或先启动一次 bot 自动创建该配置文件后再前去修改，修改后重载配置文件

## 食用方法

使用 `#acg_search` 跟随 **图片** 或 **@用户(将会把目标头像当作待搜索图片)** 发送，默认允许附带多张图片，最多三张

<div align="center">
    ![IMG_20220813_184653](https://user-images.githubusercontent.com/82202033/184493636-abc2bcbb-6ed5-496b-962b-690ace76818e.jpg)
    <br />
    <font color="#666">[搜索示例]</font>
</div>


基本是牛头不对马嘴的结果，可以忽略

> 注：前置符号 # 与指令关键字 acg_search 均可修改，详见 [Adachi-BOT 说明文档][3]  
> 查询到的图片相似度小于 similarity设定值 将会直接提示 “未找到类似图片”

## 其他说明

此项目是基于@[MarryDream][4]大佬的pic_search插件的基础上二次开发的，目前是先行版，并未对状态码4xx-5xx作出相应的提示信息，未来可能会完善，懒癌又犯了,随缘更新此插件


[1]: https://github.com/SilveryStar/Adachi-BOT

[2]: https://trace.moe/

[3]: https://docs.adachi.top/config/#commands-yml

[4]: https://github.com/MarryDream/pic_search

