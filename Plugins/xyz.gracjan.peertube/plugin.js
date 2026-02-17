// xyz.gracjan.peertube

function load() {
	
	// Use the more specific endpoint for fetching videos for a channel
	sendRequest(site + "/api/v1/video-channels/" + channelIdentifier + "/videos?perPage=20&page=1&sort=-publishedAt")
	.then((text) => {
		const jsonObject = JSON.parse(text);
		
		const videos = jsonObject["data"];
		var results = [];
		
		for (const video of videos) {
			const url = video.url;
			const title = video.name;
			const date = new Date(video.publishedAt);
			const content = video.description;
			
			const displayName = video.channel.displayName;
			const channelURL = video.channel.url;
			
			const creatorAvatar = video.channel.avatars[1].path;

			var item = Item.createWithUriDate(url, date);
			item.title = title;
			item.body = content;
			
			// Add preview image as an attachment using MediaAttachment API
			const previewImageUrl = site + video.previewPath;
			const attachment = MediaAttachment.createWithUrl(previewImageUrl);
			attachment.text = video.name; // Use video title for accessibility description
			item.attachments = [attachment];

			const identity = Identity.createWithName(displayName);
			identity.uri = channelURL;
			identity.avatar = creatorAvatar;

			item.author = identity;
			
			results.push(item);
		}
		
		processResults(results);
	})
	.catch((requestError) => {
		processError(requestError);
	});
}

function verify() {

	sendRequest(site + "/api/v1/video-channels/" + channelIdentifier)
	.then((text) => {
		const jsonObject = JSON.parse(text);
		const channel = jsonObject;
		
		const verification = {
			displayName: channel.displayName,
			icon: "https://" + channel.host + channel.avatars[1].path,
			baseUrl: site
		};
		
		processVerification(verification);
	})
	.catch((requestError) => {
		processError(requestError);
	});
}
