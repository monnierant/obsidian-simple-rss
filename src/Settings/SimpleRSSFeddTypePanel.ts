import { v4 as randomUUID } from "uuid";
import SimpleRSSPlugin from "main";
import { App, SearchComponent, Setting } from "obsidian";
import { FolderSuggest } from "src/Library/FolderSuggestor";

export default class SimpleRSSFeedTypePanel {
	plugin: SimpleRSSPlugin;
	app: App;

	constructor(app: App, plugin: SimpleRSSPlugin) {
		this.app = app;
		this.plugin = plugin;
	}

	display(containerEl: any): void {
		containerEl.empty();

		containerEl.createEl("h1", { text: "Feed Types" });

		// Add Feed button
		new Setting(containerEl).addButton((button) => {
			button
				.setIcon("plus")
				.setTooltip("Add feed type")
				.onClick(async () => {
					console.log("Add Feed type");
					this.plugin.settings.feedTypes.push({
						name: "",
						feed: [],
						item: [],
						id: randomUUID(),
					});
					await this.plugin.saveSettings();
					this.display(containerEl);
				});
		});

		// For each feed, create a new setting
		this.plugin.settings.feedTypes.forEach((feedType, index) => {
			// Title for beautification
			containerEl.createEl("h2", {
				text: "Feed Types #" + index + ":" + feedType.name,
			});

			// Feed Name text field
			new Setting(containerEl).setName("Name").addText((text) =>
				text
					.setPlaceholder("Name")
					.setValue(feedType.name)
					.onChange(async (value) => {
						this.plugin.settings.feedTypes[index].name = value;
						await this.plugin.saveSettings();
					})
			);

			// Feed new variable text field
			new Setting(containerEl).setName("Feed Field").addText((text) => {
				const feeds = feedType.feed.join(",");
				return text
					.setPlaceholder("Separator: ,")
					.setValue(feeds)
					.onChange(async (value) => {
						this.plugin.settings.feedTypes[index].feed =
							value.split(",");
						await this.plugin.saveSettings();
					});
			});

			// Item new variable text field
			new Setting(containerEl).setName("Item Field").addText((text) => {
				const items = feedType.item.join(",");
				return text
					.setPlaceholder("Separator: ,")
					.setValue(items)
					.onChange(async (value) => {
						this.plugin.settings.feedTypes[index].item =
							value.split(",");
						await this.plugin.saveSettings();
					});
			});

			// Delete Feed button
			new Setting(containerEl)
				// .setName("Delete Feed")
				// .setDesc("Delete this feed.")
				.addButton((button) => {
					button
						.setIcon("trash")
						.setTooltip("Delete this feed type")
						.onClick(async () => {
							console.log("Delete Feed");
							this.plugin.settings.feedTypes.splice(index, 1);
							this.plugin.settings.feeds =
								this.plugin.settings.feeds.map((feed) => {
									// Remove the feed type from the feed
									return {
										feedType:
											feed.feedTypeId !== feedType.id
												? feed.feedTypeId
												: undefined,
										...feed,
									};
								});
							await this.plugin.saveSettings();
							this.display(containerEl);
						});
				});
		});
	}
}
