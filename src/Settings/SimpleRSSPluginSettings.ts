import { v4 as randomUUID } from "uuid";
import SimpleRSSFeed from "src/models/SimpleRSSFeed";
import SimpleRSSFeedType from "src/models/SimpleRSSFeedType";

export interface SimpleRSSPluginSettings {
	defaultPath: string;
	defaultTemplate: string;
	autoPull: boolean;
	timeInterval: number;
	feeds: SimpleRSSFeed[];
	feedTypes: SimpleRSSFeedType[];
}

export const DEFAULT_SETTINGS: SimpleRSSPluginSettings = {
	defaultPath: "",
	defaultTemplate: "Source: {{item.link}}\n\n{{item.description}}",
	autoPull: false,
	timeInterval: 60,
	feeds: [],
	feedTypes: [
		{
			name: "Youtube",
			feed: ["yt:channelId"],
			item: ["yt:videoId", "yt:channelId", "media:group"],
			id: randomUUID(),
		},
	],
};
