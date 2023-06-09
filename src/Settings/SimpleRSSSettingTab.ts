import { App, PluginSettingTab, SearchComponent, Setting } from "obsidian";

import SimpleRSSPlugin from "main";
import { FolderSuggest } from "src/Library/FolderSuggestor";

export default class SimpleRSSSettingTab extends PluginSettingTab {
	plugin: SimpleRSSPlugin;

	constructor(app: App, plugin: SimpleRSSPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h1", { text: "Synchronisation" });

		// Pull toogle
		new Setting(containerEl)
			.setName("Pull")
			.setDesc("Pull the feeds on periodic basis. (Restart required)")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.autoPull)
					.onChange(async (value) => {
						this.plugin.settings.autoPull = value;
						await this.plugin.saveSettings();
					})
			);

		// Time Interval number field
		new Setting(containerEl)
			.setName("Time interval")
			.setDesc(
				"Time interval between each pull in minutes. (Restart required)"
			)
			.addText((text) =>
				text
					.setPlaceholder("Time Interval")
					.setValue(this.plugin.settings.timeInterval.toString())
					.onChange(async (value) => {
						this.plugin.settings.timeInterval = parseInt(value);
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("h1", { text: "Defaults" });

		// Default Path text field
		new Setting(containerEl)
			.setName("Default path")
			.setDesc("This is the default path for all feed.")
			.addSearch((search) =>
				search
					.setPlaceholder("/")
					.setValue(this.plugin.settings.defaultPath)
					.onChange(async (value) => {
						this.plugin.settings.defaultPath = value;
						await this.plugin.saveSettings();
					})
			);

		// Default Template text field
		new Setting(containerEl)

			.setName("Default template")
			.setDesc(
				"This is the default template for all feed.\n Here is a list of all avaliable variables:\n {{feed.feedUrl}}\n {{feed.title}}\n {{feed.description}}\n {{feed.link}}\n {{item.title}}\n {{item.link}}\n {{item.description}}\n {{item.author}}\n {{item.guid}}\n {{item.comments}}\n {{item.categories}}\n {{item.pubDate}}"
			)
			.addTextArea((text) =>
				text
					.setPlaceholder("{{item.title}}")
					.setValue(this.plugin.settings.defaultTemplate)
					.onChange(async (value) => {
						this.plugin.settings.defaultTemplate = value;
						await this.plugin.saveSettings();
					})
			);

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
					});
					await this.plugin.saveSettings();
					this.display();
				});
		});

		// For each feed, create a new setting
		this.plugin.settings.feeds.forEach((feed, index) => {
			// Title for beautification
			containerEl.createEl("h2", {
				text: "Feed #" + index + ":" + feed.title,
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
							this.display();
						});
				});
		});
	}
}
