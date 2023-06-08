import SimpleRSSFeed from "src/models/SimpleRSSFeed";

export interface SimpleRSSPluginSettings {
	defaultPath: string;
	defaultTemplate: string;
	autoPull: boolean;
	timeInterval: number;
	feeds: SimpleRSSFeed[];
}

export const DEFAULT_SETTINGS: SimpleRSSPluginSettings = {
	defaultPath: "",
	defaultTemplate: "Source: {{item.link}}\n\n{{item.description}}",
	autoPull: false,
	timeInterval: 60,
	feeds: [],
};
