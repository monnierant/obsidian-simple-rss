import SimpleRSSPlugin from "main";
import { App, SearchComponent, Setting } from "obsidian";
import { FolderSuggest } from "src/Library/FolderSuggestor";

export default class SimpleRSSFeedPanel {
	plugin: SimpleRSSPlugin;
	app: App;

	constructor(app: App, plugin: SimpleRSSPlugin) {
		this.app = app;
		this.plugin = plugin;
	}

	display(containerEl: any): void {
		containerEl.empty();

		containerEl.createEl("h1", { text: "Feeds" });

		// Add Feed button
		new Setting(containerEl).addButton((button) => {
			button
				.setIcon("plus")
				.setTooltip("Add feed")
				.onClick(async () => {
					console.log("Add Feed");
					this.plugin.settings.feeds.push({
						name: "",
						url: "",
						title: "{{item.title}}",
						path: undefined,
						feedTypeId: undefined,
					});
					await this.plugin.saveSettings();
					this.display(containerEl);
				});
		});

		// For each feed, create a new setting
		this.plugin.settings.feeds.forEach((feed, index) => {
			// Title for beautification
			containerEl.createEl("h2", {
				text: "Feed #" + index + ":" + feed.name,
			});

			// Feed Name text field
			new Setting(containerEl).setName("Name").addText((text) =>
				text
					.setPlaceholder("Name")
					.setValue(feed.name)
					.onChange(async (value) => {
						this.plugin.settings.feeds[index].name = value;
						await this.plugin.saveSettings();
					})
			);

			// Feed URL text field
			new Setting(containerEl).setName("URL").addText((text) =>
				text
					.setPlaceholder("URL")
					.setValue(feed.url)
					.onChange(async (value) => {
						this.plugin.settings.feeds[index].url = value;
						await this.plugin.saveSettings();
					})
			);

			// Feed Type dropdown
			new Setting(containerEl).setName("Type").addDropdown((dropdown) => {
				dropdown
					.addOption("", "~Generic~")
					.addOptions(
						this.plugin.settings.feedTypes
							.map((feedType) => {
								return {
									name: feedType.name,
									value: feedType.id.toString(),
								};
							})
							.reduce((acc, obj) => {
								acc[obj.value] = obj.name;
								return acc;
							}, {} as Record<string, string>)
					)
					.setValue(feed.feedTypeId?.toString() ?? "")
					.onChange(async (value) => {
						this.plugin.settings.feeds[index].feedTypeId =
							value as string;
						await this.plugin.saveSettings();
					});
			});

			// Feed Path text field
			new Setting(containerEl)
				.setName("Path")
				.addSearch(async (search: SearchComponent) => {
					new FolderSuggest(this.app, search.inputEl);
					search
						.setValue(feed.path ?? "")
						.setPlaceholder(this.plugin.settings.defaultPath)
						.onChange(async (value: string) => {
							this.plugin.settings.feeds[index].path = value;
							await this.plugin.saveSettings();
						});
				});

			// Feed Title text field
			new Setting(containerEl).setName("Title").addText((text) =>
				text
					.setPlaceholder("Title")
					.setValue(feed.title ?? "")
					.onChange(async (value) => {
						this.plugin.settings.feeds[index].title = value;
						await this.plugin.saveSettings();
					})
			);

			// Feed Template text field
			new Setting(containerEl).setName("Template").addTextArea((text) =>
				text
					.setPlaceholder("Template")
					.setValue(feed.template ?? "")
					.onChange(async (value) => {
						this.plugin.settings.feeds[index].template = value;
						await this.plugin.saveSettings();
					})
			);

			// Delete Feed button
			new Setting(containerEl)
				// .setName("Delete Feed")
				// .setDesc("Delete this feed.")
				.addButton((button) => {
					button
						.setIcon("trash")
						.setTooltip("Delete this feed")
						.onClick(async () => {
							console.log("Delete Feed");
							this.plugin.settings.feeds.splice(index, 1);
							await this.plugin.saveSettings();
							this.display(containerEl);
						});
				});
		});
	}
}
