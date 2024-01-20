import { App, PluginSettingTab, SearchComponent, Setting } from "obsidian";

import SimpleRSSPlugin from "main";
import { FolderSuggest } from "src/Library/FolderSuggestor";
import SimpleRSSFeedPanel from "./SimpleRSSFeddPanel";
import SimpleRSSFeedTypePanel from "./SimpleRSSFeddTypePanel";

export default class SimpleRSSSettingTab extends PluginSettingTab {
	plugin: SimpleRSSPlugin;
	feedPanel: SimpleRSSFeedPanel;
	feedTypePanel: SimpleRSSFeedTypePanel;

	constructor(app: App, plugin: SimpleRSSPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.feedPanel = new SimpleRSSFeedPanel(app, plugin);
		this.feedTypePanel = new SimpleRSSFeedTypePanel(app, plugin);
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
			.setDesc("This is the default template for all feed.")
			.addTextArea((text) =>
				text
					.setPlaceholder("{{&item.title}}")
					.setValue(this.plugin.settings.defaultTemplate)
					.onChange(async (value) => {
						this.plugin.settings.defaultTemplate = value;
						await this.plugin.saveSettings();
					})
			);

		this.feedPanel.display(containerEl.createEl("div", { cls: "Feeds" }));

		this.feedTypePanel.display(
			containerEl.createEl("div", { cls: "FeedTypes" })
		);
	}
}
