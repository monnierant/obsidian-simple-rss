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
			// Create a new file in the vault
			vault
				.create(path + "/" + title + ".md", text)
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
			.replace("{{feed.feedUrl}}", feed.feedUrl ?? "")
			.replace("{{feed.title}}", feed.title ?? "")
			.replace("{{feed.description}}", feed.description ?? "")
			.replace("{{feed.link}}", feed.link ?? "")
			.replace("{{item.title}}", item.title ?? "")
			.replace("{{item.description}}", item.description ?? "")
			.replace("{{item.author}}", item.author ?? "")
			.replace("{{item.link}}", item.link ?? "")
			.replace("{{item.guid}}", item.guid ?? "")
			.replace("{{item.comments}}", item.comments ?? "")
			.replace("{{item.categories}}", categories)
			.replace("{{item.pubDate}}", item.pubDate ?? "");
	}
}
