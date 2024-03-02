const { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const stableAndPre = new AttachmentBuilder('./resources/stable.png');
const nightly = new AttachmentBuilder('./resources/nightly.png');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('download')
		.setDescription('Get the download link for PlayCover')
		.addStringOption(option => option.setName('release').setDescription('The release of PlayCover you want to download').setRequired(true).addChoices({ name: 'Stable', value: 'stable' }, { name: 'Nightly', value: 'nightly' }))
		.addUserOption(option => option.setName('user').setDescription('User to ping in reply')),

	async execute(interaction) {
		var title, url, author, color, description;
		const release = interaction.options.getString('release');
		const user = interaction.options.getUser('user');
		const releaseData = await fetch('https://api.github.com/repos/playcover/playcover/releases').then(res => res.json());

		switch (release) {
			case 'stable':
				title = `**Click here to download**`;
				url = `${releaseData.filter(release => release.prerelease === false)[0].assets[0].browser_download_url}`;
				author = `PlayCover - Stable`;
				description = `**Common errors:**`
				color = `#78D7A3`
				break;

			case 'nightly':
				title = `**Click here to download**`;
				url = `https://nightly.link/playcover/playcover/workflows/2.nightly_release/develop`;
				author = `PlayCover - Nightly`;
				description = `**What is nightly build?**\nA build of PlayCover created every night(hence the word nightly). It is the most up-to-date version of PlayCover with the latest features, however it may have severe game-breaking bugs. It is recommended that you use nightly builds only if you know what you are doing.\n\n**Common errors:**`
				color = `#F0C44B`;
				break;
		}

		return interaction
			.reply({
				content: user ? `${user.toString()}, ${interaction.member.toString()} wanted you to see this command` : null,
				allowedMentions: { users: [user ? user.id : null] },
				embeds: [new EmbedBuilder().setTitle(title).setURL(url).setAuthor({name: author, iconURL: 'https://playcover.io/PlayCover-Square.png'}).setDescription(description).addFields(
						{ name: 'Apple can\'t check app for malicious software', 
						value: `
						This error occours because PlayCover is not signed. 
						To override this warning: 
						1. Open \`System Settings\` on your Mac\n2. Open \`Privacy & Secuirty\` tab in System Settings\n3. Scroll down and click \`Open Anyway\``, inline: true },
						{ name: 'PlayCover Damaged and Can\’t Be Opened',
						 value: `
						 To fix this error:
						 1. Press \`Command + Space\` on your keyboard\n2. Type \`Terminal\` and press return\n3. Type \`xattr -c /Applications/PlayCover.app\``
						 , inline: true },
					).setTimestamp().setColor(color)
				],
				ephemeral: user ? false : true,
			})
			.catch(error => console.error(`[ERROR]: ${error}`));
	}
};
