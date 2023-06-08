import SimpleRSSFeed from "src/models/SimpleRSSFeed";

export interface SimpleRSSPluginSettings {
	defaultPath: string;
	defaultTemplate: string;
	feeds: SimpleRSSFeed[];
}

export const DEFAULT_SETTINGS: SimpleRSSPluginSettings = {
	defaultPath: "",
	defaultTemplate: "Source: {{item.link}}\n\n{{item.description}}",
	feeds: [],
};
