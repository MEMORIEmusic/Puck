const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("solved")
    .setDescription("Close a post once it has been solved"),

  async execute(interaction) {
    const errorEmbed = new EmbedBuilder()
      .setColor("#cf3838")
      .setDescription("You can only delete your own posts.")
      .setFooter({
        text: "An error occurred",
        iconURL: "https://i.imgur.com/fdzF9QP.png",
      })
      .setTimestamp();

    interaction.channel.ownerId === interaction.user.id
      ? interaction.channel.delete()
      : interaction.reply(errorEmbed);
  },
};
