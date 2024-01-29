# Obsidian Simple RSS Plugin

![Contributors](https://img.shields.io/github/contributors/monnierant/obsidian-simple-rss?style=plastic)
![Forks](https://img.shields.io/github/forks/monnierant/obsidian-simple-rss)
![Stars](https://img.shields.io/github/stars/monnierant/obsidian-simple-rss)
![Licence](https://img.shields.io/github/license/monnierant/obsidian-simple-rss)
![Issues](https://img.shields.io/github/issues/monnierant/obsidian-simple-rss)

## What is this ?

This is a plugin for [Obsidian](https://obsidian.md/) that allows you to pull RSS feeds to your vault.

It allow template using [Mustache](https://mustache.github.io) to fill note title and body.

Custom RSS feed can be also collected

Tadam

## How do I use it ?

### Quick Start

1. Install the plugin
2. Go to the plugin settings and add the RSS feeds you want to pull
3. Use the `Simple-RSS` button in the menu bar to pull the feeds

### How do I add a feed ?

1. Go to the plugin settings
2. Click on the `Add feed` button (`+` button in `Feeds` section)
3. Add a name for the feed
4. Enter the URL of the feed you want to add
5. You can specify a folder to put the new note into. If you don't, the plugin will use the default folder.
6. You can specify a feedType for the feed. It allow you to collect more specific rss field.
7. You can specify a title for the feed. If you don't, the plugin will use the item.title by default. (You can use [Mustache](https://mustache.github.io) to format the title)
8. You can specify a template for the feed. If you don't, the plugin will use the default template. (You can use [Mustache](https://mustache.github.io) to format the template)

### How do I add a new feedType ?

If you want to collect some custom fields not present in the generic format you have to create a custom fieldType.

1. Go to the plugin settings
2. Click on the `Add feed type` button (`+` button in `Feed Types` section)
3. Add a name for the feed type
4. You can add as many top level `Feed Field` you want separated by a coma `,`. (Each field and his childs will be avaliable in template as [Mustache](https://mustache.github.io) variable ex: `{{&feed.my:customField}}` )
5. You can add as many top level `Item Field` you want separated by a coma `,`. (Each field and his childs will be avaliable in template as [Mustache](https://mustache.github.io) variable ex: `{{&item.my:customField}}` )

### How do I enable automatic pull of notes ?

1. Go to the plugin settings
2. Use the `Automatic pull` setting to enable automatic pull of notes
3. Use the `Automatic pull interval` setting to change the interval between each pull (in minutes)
4. Restart Obsidian

### How can I change the default folder ?

1. Go to the plugin settings
2. Use the `Default folder` setting to change the default folder

### How can I change the default template ?

1. Go to the plugin settings
2. Use the `Default template` setting to change the default template ([Mustache](https://mustache.github.io) to format the template)

## Mustache

### Parser

This project use the nodeJs implementation of [Mustache](https://mustache.github.io) of janl:

-   [Mustache Js](https://github.com/janl/mustache.js)

You can use all feature implemented in this module in your template

### Tips

#### HTML Characters

To prevent bad HTML interpretation character use the `{{&type.field}}` notation. The `&` will decode the HTML character and put them in the correct format in your notes.

#### Access attribute

In order to access an attribute of a field, you must add a `$`.

```js
{{&item.media:content.$.url}}
```

will match:

```xml
<item>
    <link>https://mastodon.social/@DrPen/111832201685713509</link>
    <pubDate>Sun, 28 Jan 2024 06:39:35 +0000</pubDate>
    <media:content url="https://files.mastodon.social/media_attachments/files/111/832/170/886/342/281/original/6cae376ed484e250.png" type="image/png" fileSize="165089" medium="image">
        <media:rating scheme="urn:simple">nonadult</media:rating>
        <media:description type="plain">Screenshot of academic opinion piece on Patterns, discussing ethics/privacy differences of data collection between Twitter and Mastodon/Fediverse</media:description>
    </media:content>
    <category>mastodon</category>
</item>
```

The `$` allow you to target attributes and not content of a field.

## Exemple

Here is a youtube chanel RSS Feed (of [@Grafana](https://www.youtube.com/@Grafana)): [https://www.youtube.com/feeds/videos.xml?channel_id=UCYCwgQAMm9sTJv0rgwQLCxw](https://www.youtube.com/feeds/videos.xml?channel_id=UCYCwgQAMm9sTJv0rgwQLCxw)

```xml
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns="http://www.w3.org/2005/Atom">
  <link rel="self" href="http://www.youtube.com/feeds/videos.xml?channel_id=UCYCwgQAMm9sTJv0rgwQLCxw"/>
  <id>yt:channel:YCwgQAMm9sTJv0rgwQLCxw</id>
  <yt:channelId>YCwgQAMm9sTJv0rgwQLCxw</yt:channelId>
  <title>Grafana</title>
  <link rel="alternate" href="https://www.youtube.com/channel/UCYCwgQAMm9sTJv0rgwQLCxw"/>
  <author>
    <name>Grafana</name>
    <uri>https://www.youtube.com/channel/UCYCwgQAMm9sTJv0rgwQLCxw</uri>
  </author>
  <published>2013-10-14T19:37:23+00:00</published>
  <entry>
    <id>yt:video:pzNRvMQzrJ0</id>
    <yt:videoId>pzNRvMQzrJ0</yt:videoId>
    <yt:channelId>UCYCwgQAMm9sTJv0rgwQLCxw</yt:channelId>
    <title>How to do continuous profiling right with Grafana Pyroscope's Ryan Perry (Grafana Office Hours #26)</title>
    <link rel="alternate" href="https://www.youtube.com/watch?v=pzNRvMQzrJ0"/>
    <author>
      <name>Grafana</name>
      <uri>https://www.youtube.com/channel/UCYCwgQAMm9sTJv0rgwQLCxw</uri>
    </author>
    <published>2024-01-20T05:10:58+00:00</published>
    <updated>2024-01-20T08:17:59+00:00</updated>
    <media:group>
      <media:title>How to do continuous profiling right with Grafana Pyroscope's Ryan Perry (Grafana Office Hours #26)</media:title>
      <media:content url="https://www.youtube.com/v/pzNRvMQzrJ0?version=3" type="application/x-shockwave-flash" width="640" height="390"/>
      <media:thumbnail url="https://i1.ytimg.com/vi/pzNRvMQzrJ0/hqdefault.jpg" width="480" height="360"/>
      <media:description>Ryan Perry, co-founder of Grafana Pyroscope, talks to us about how to do continuous profiling right. Ryan is also an Engineering Director at Grafana Labs, and he discusses the main concerns in continuous profiling and how to avoid those pitfalls. Pyroscope is an open-source project for aggregating continuous profiling data about your system's resources. He is joined by Developer Advocates Nicole van der Hoeven and Paul Balogh. Pyroscope docs: https://grafana.com/docs/pyroscope/ Pyroscope site: https://pyroscope.io/ Pyroscope repo: https://github.com/grafana/pyroscope Weigh in on the OpenTelemetry Profiling Data Model: https://github.com/open-telemetry/oteps/pull/239 // TIMESTAMPS 00:00:00 Intro to Ryan Perry and how he got into continuous profiling 00:04:00 Traditional vs. modern profiling 00:13:29 How Pyroscope joined Grafana Labs 00:18:29 Are continuous profiles metrics? 00:21:55 What's a flamegraph? 00:23:28 (Demo) How Pyroscope works 00:31:58 How Grafana does continuous profiling 00:34:29 How to instrument for continuous profiling 00:40:16 New feature: Execution-scope profiling 00:45:26 Best practices for sampling interval 00:54:36 OpenTelemetry profiling data model 00:58:58 Installation/configuration options for Pyroscope 01:02:09 Paul's announcement --- Contact Ryan: LinkedIn: https://www.linkedin.com/in/ryanaperry/ Site: http://ryanperry.io/ Contact Nicole: Mastodon: https://pkm.social/@nicole LinkedIn: https://www.linkedin.com/in/nvanderhoeven/ Site: https://nicolevanderhoeven.com Contact Paul: X: https://twitter.com/javaducky LinkedIn: https://www.linkedin.com/in/pabalogh/ Site: https://javaducky.com/ Learn more about Grafana Labs: Website: https://grafana.com Repo: https://github.com/grafana/grafana</media:description>
      <media:community>
        <media:starRating count="8" average="5.00" min="1" max="5"/>
        <media:statistics views="176"/>
      </media:community>
    </media:group>
  </entry>
  <entry>
    <id>yt:video:TTcdzeqwIms</id>
    <yt:videoId>TTcdzeqwIms</yt:videoId>
    <yt:channelId>UCYCwgQAMm9sTJv0rgwQLCxw</yt:channelId>
    <title>Grafana Agent Community call 2024-01-17</title>
    <link rel="alternate" href="https://www.youtube.com/watch?v=TTcdzeqwIms"/>
    <author>
      <name>Grafana</name>
      <uri>https://www.youtube.com/channel/UCYCwgQAMm9sTJv0rgwQLCxw</uri>
    </author>
    <published>2024-01-20T01:40:02+00:00</published>
    <updated>2024-01-20T08:42:10+00:00</updated>
    <media:group>
      <media:title>Grafana Agent Community call 2024-01-17</media:title>
      <media:content url="https://www.youtube.com/v/TTcdzeqwIms?version=3" type="application/x-shockwave-flash" width="640" height="390"/>
      <media:thumbnail url="https://i1.ytimg.com/vi/TTcdzeqwIms/hqdefault.jpg" width="480" height="360"/>
      <media:description>Highlights - Compatible Components Reference 0:17 - Metamonitoring the Agent 4:30 Join our next Agent community call: https://docs.google.com/document/d/1TqaZD1JPfNadZ4V81OCBPCG_TksDYGlNlGdMnTWUSpo ---------- 👍 Found this video useful? Be sure to give it a thumbs up and subscribe to our channel for more helpful Grafana tutorial videos. 📱 Follow us for the latest and greatest on all things Grafana and our other OSS projects. X: https://twitter.com/grafana LinkedIn: https://www.linkedin.com/company/grafana-labs/mycompany Facebook: https://www.facebook.com/grafana #Grafana #Observability</media:description>
      <media:community>
        <media:starRating count="1" average="5.00" min="1" max="5"/>
        <media:statistics views="12"/>
      </media:community>
    </media:group>
  </entry>
</feed>
```

Field Type configuration for this youtube RSS

-   name: Youtube
-   feed:
    -   yt:channelId
-   item:
    -   yt:videoId
    -   yt:channelId
    -   media:group

As you can see in this exemple we only need to setup the top level rss's field for `entry` or `feed` to collect all the info into them.

That's why we only setup `media:group` to be able to get the `media:description` with the following [Mustache](https://mustache.github.io) snipet `{{&item.media:group.media:description}}`

You can also access to an attribute like the video url with `{{&item.media:group.media:content.$.url}}`

## Avaliable variables that can be used in title and templates from the ~Generic~ format

The plugin uses [Mustache](https://mustache.github.io) to format the feeds. You can use the following variables:

-   `{{&feed.feedUrl}}` - URL of the feed
-   `{{&feed.title}}` - Title of the feed
-   `{{&feed.description}}` - Description of the feed
-   `{{&feed.link}}` - Link to the feed
-   `{{&item.title}}` - Title of the item
-   `{{&item.author}}` - Author of the item
-   `{{&item.link}}` - Link to the item
-   `{{&item.guid}}` - Item unique identifier
-   `{{&item.comments}}` - Item comments
-   `{{&item.categories}}` - Item categories
-   `{{&item.pubDate}}` - Item publication date
