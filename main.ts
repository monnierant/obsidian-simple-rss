import { Plugin } from "obsidian";
import SimpleRSSSettingTab from "./src/Settings/SimpleRSSSettingTab";
import {
	DEFAULT_SETTINGS,
	SimpleRSSPluginSettings,
} from "./src/Settings/SimpleRSSPluginSettings";
import Feeds from "src/sources/Feeds";

// Remember to rename these classes and interfaces!

export default class SimpleRSSPlugin extends Plugin {
	settings: SimpleRSSPluginSettings;
	feeds: Feeds;

	async onload() {
		await this.loadSettings();

		// This creates an interval that will sync the feeds every timeInterval minutes.
		if (this.settings.autoPull) {
			this.registerInterval(
				window.setInterval(
					() => this.feeds.syncFeeds(this.app.vault),
					1000 * 60 * this.settings.timeInterval
				)
			);
		}

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"refresh-cw",
			"Simple RSS",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				this.feeds.syncFeeds(this.app.vault);
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("simple-rss-ribbon-class");

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SimpleRSSSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
		this.feeds = new Feeds()
			.setFeeds(this.settings.feeds)
			.setDefaultPath(this.settings.defaultPath)
			.setDefaultTemplate(this.settings.defaultTemplate);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
