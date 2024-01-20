import { Notice, Vault } from "obsidian";
import SimpleRSSFeed from "src/models/SimpleRSSFeed";

import SimpleRSSFeedType from "src/models/SimpleRSSFeedType";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import Parser from "rss-parser";

export default class Feeds {
	feeds: SimpleRSSFeed[] = [];
	feedTypes: SimpleRSSFeedType[] = [];
	defaultPath = "";
	defaultTemplate = "";
	Mustache = require("mustache");

	constructor() {
		this.feeds = [];
		this.feedTypes = [];
	}

	setFeeds(feeds: SimpleRSSFeed[]): Feeds {
		this.feeds = feeds;
		return this;
	}

	setFeedTypes(feedTypes: SimpleRSSFeedType[]): Feeds {
		this.feedTypes = feedTypes;
		return this;
	}

	setDefaultTemplate(defaultTemplate: string): Feeds {
		this.defaultTemplate = defaultTemplate;
		return this;
	}

	setDefaultPath(defaultPath: string): Feeds {
		this.defaultPath = defaultPath;
		return this;
	}

	syncFeeds(vault: Vault): void {
		this.feeds.forEach((feed) => {
			const feedType = this.feedTypes.find(
				(feedType) => feedType.id === feed.feedTypeId
			);
			this.syncOneFeed(vault, feed, feedType);
		});
	}

	async syncOneFeed(
		vault: Vault,
		feed: SimpleRSSFeed,
		feedType?: SimpleRSSFeedType
	) {
		new Notice("Sync Feed: " + feed.name);

		const content = await this.getUrlContent(feed.url, feedType);

		content.items.forEach((item: any) => {
			const path = feed.path ?? this.defaultPath;
			const title = feed.title
				? this.parseItem(feed.title, item, content)
				: item.title;
			const text = this.parseItem(
				feed.template ?? this.defaultTemplate,
				item,
				content
			);

			// sanitize title
			const sanitizedTitle = title.replace(/[*"\\<>/:|?#^]/gi, "");

			// Create a new file in the vault
			vault
				.create(path + "/" + sanitizedTitle + ".md", text)
				.then((file) => {
					console.log("Note created :" + path + "/" + title);
					new Notice("Note created :" + path + "/" + title);
				})
				.catch((error) => {
					if (!error.message.includes("File already exists")) {
						console.error(error);
						new Notice("Error creating note :" + error);
					}
				});
		});
	}

	getUrlContent(url: string, feedType?: SimpleRSSFeedType) {
		const myFeedType = feedType
			? {
					customFields: {
						feed: feedType.feed,
						item: feedType.item,
					},
			  }
			: undefined;
		const parser: Parser = new Parser(myFeedType);

		return parser.parseURL(url);
	}

	getValue(data: any, keys: string | string[]): any {
		// If plain string, split it to array
		if (typeof keys === "string") {
			keys = keys.split(".");
		}

		// Get key
		var key: string | undefined = keys.shift();

		// Get data for that key
		var keyData = data[key ?? ""];

		// Check if there is data
		if (!keyData) {
			return undefined;
		}

		// Check if we reached the end of query string
		if (keys.length === 0) {
			return keyData;
		}

		// recusrive call!
		return this.getValue(Object.assign({}, keyData), keys);
	}

	replaceField(template: string, kind: string, values: any): string {
		const regex = new RegExp("{{" + kind + "\\.[^}]+}}", "g");
		let result = template;
		let match;
		match = regex.exec(result);
		match?.forEach((m) => {
			const key = m.replace("{{" + kind + ".", "").replace("}}", "");
			result = result.replaceAll(m, this.getValue(values, key) ?? "");
		});
		return result;
	}

	replaceFieldsMustache(template: string, values: any): string {
		return this.Mustache.render(template, values);
	}

	parseItem(template: string, item: any, feed: any): string {
		let categories = "";
		if (item.categories) {
			item.categories.forEach((category: string) => {
				categories += "- " + category + "\n";
			});
		}
		let result = template.replaceAll("{{item.categories}}", categories);

		// find all {{item.*}} and replace them with the value
		// result = this.replaceField(result, "feed", feed);
		// result = this.replaceField(result, "item", item);
		result = this.replaceFieldsMustache(result, { feed, item });

		return result;
	}
}
