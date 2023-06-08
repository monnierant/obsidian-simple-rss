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
				? this.parseItem(feed.title, item)
				: item.title;
			const content = this.parseItem(
				feed.template ?? this.defaultTemplate,
				item
			);
			// Create a new file in the vault
			vault
				.create(path + "/" + title + ".md", content)
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

	parseItem(template: string, item: any): string {
		let categories = "";
		if (item.categories) {
			item.categories.forEach((category: string) => {
				categories += "- " + category + "\n";
			});
		}
		return template
			.replace("{{title}}", item.title ?? "")
			.replace("{{description}}", item.description ?? "")
			.replace("{{author}}", item.author ?? "")
			.replace("{{link}}", item.link ?? "")
			.replace("{{guid}}", item.guid ?? "")
			.replace("{{comments}}", item.comments ?? "")
			.replace("{{categories}}", categories)
			.replace("{{pubDate}}", item.pubDate ?? "");
	}
}
