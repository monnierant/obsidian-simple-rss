import { Notice, Vault } from "obsidian";
import SimpleRSSFeed from "src/models/SimpleRSSFeed";
import Parser from "rss-parser";

export default class Feeds {
	feeds: SimpleRSSFeed[] = [];
	defaultPath = "";
	defaultTemplate = "";

	constructor() {
		this.feeds = [];
	}

	setFeeds(feeds: SimpleRSSFeed[]): Feeds {
		this.feeds = feeds;
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
			this.syncOneFeed(feed, vault);
		});
	}

	async syncOneFeed(feed: SimpleRSSFeed, vault: Vault) {
		new Notice("Sync Feed: " + feed.name);

		const content = await this.getUrlContent(feed.url);

		console.log(content);

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
			const sanitizedTitle = title
				.replace(/[*"\\<>/:|?]/gi, "");

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

	getUrlContent(url: string) {
		const parser: Parser = new Parser();
		return parser.parseURL(url);
	}

	parseItem(template: string, item: any, feed: any): string {
		let categories = "";
		if (item.categories) {
			item.categories.forEach((category: string) => {
				categories += "- " + category + "\n";
			});
		}
		return template
			.replaceAll("{{feed.feedUrl}}", feed.feedUrl ?? "")
			.replaceAll("{{feed.title}}", feed.title ?? "")
			.replaceAll("{{feed.description}}", feed.description ?? "")
			.replaceAll("{{feed.link}}", feed.link ?? "")
			.replaceAll("{{item.title}}", item.title ?? "")
			.replaceAll("{{item.description}}", item.description ?? "")
			.replaceAll("{{item.author}}", item.author ?? "")
			.replaceAll("{{item.link}}", item.link ?? "")
			.replaceAll("{{item.guid}}", item.guid ?? "")
			.replaceAll("{{item.comments}}", item.comments ?? "")
			.replaceAll("{{item.categories}}", categories)
			.replaceAll("{{item.pubDate}}", item.pubDate ?? "");
	}
}
