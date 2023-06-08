# Obsidian Simple RSS Plugin

## What is this ?

This is a plugin for [Obsidian](https://obsidian.md/) that allows you to pull RSS feeds to your vault.

## How do I use it ?

1. Install the plugin
2. Go to the plugin settings and add the RSS feeds you want to pull
3. Use the `Simple-RSS` button in the menu bar to pull the feeds

## How do I add a feed ?

1. Go to the plugin settings
2. Click on the `Add feed` button
3. Add a name for the feed
4. Enter the URL of the feed you want to add
5. You can specify a folder to put the new note into. If you don't, the plugin will use the default folder.
6. You can specify a title for the feed. If you don't, the plugin will use the item.title by default. (You can use [Handlebars](https://handlebarsjs.com/) to format the title)
7. You can specify a template for the feed. If you don't, the plugin will use the default template. (You can use [Handlebars](https://handlebarsjs.com/) to format the template)

## How do I enable automatic pull of notes ?

1. Go to the plugin settings
2. Use the `Automatic pull` setting to enable automatic pull of notes
3. Use the `Automatic pull interval` setting to change the interval between each pull (in minutes)
4. Restart Obsidian

## How can I change the default folder ?

1. Go to the plugin settings
2. Use the `Default folder` setting to change the default folder

## How can I change the default template ?

1. Go to the plugin settings
2. Use the `Default template` setting to change the default template
[Handlebars](https://handlebarsjs.com/) to format the template)

## Avaliable variables that can be used in title and templates

The plugin uses [Handlebars](https://handlebarsjs.com/) to format the feeds. You can use the following variables:

- `{{feed.feedUrl}}` - URL of the feed
- `{{feed.title}}` - Title of the feed
- `{{feed.description}}` - Description of the feed
- `{{feed.link}}` - Link to the feed
- `{{item.title}}` - Title of the item
- `{{item.description}}` - Description of the item
- `{{item.author}}` - Author of the item
- `{{item.link}}` - Link to the item
- `{{item.guid}}` - Item unique identifier
- `{{item.comments}}` - Item comments
- `{{item.categories}}` - Item categories
- `{{item.pubDate}}` - Item publication date
