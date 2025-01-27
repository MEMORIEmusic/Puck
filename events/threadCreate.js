const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "threadCreate",
  async execute(channel) {
    if (channel.parentId != "1019859452352020540") return;

    try {
      const templateCheckFalse = new EmbedBuilder()
        .setDescription(
          `You have created a post without using the required template. Support to your issue might be delayed.`,
        )
        .setTimestamp()
        .setFooter({
          text: `Post template not used.`,
          iconURL: `https://i.imgur.com/ZdGKYWh.png`,
        })
        .setColor("#e6ce1c");

      const useSolveCommand = new EmbedBuilder()
        .setDescription(
          `Please use \`/solved\` to delete this post when your issue has been resolved.`,
        )
        .setTimestamp()
        .setColor("#78D7A3");

      let templateCheck = await channel.messages
        .fetch()
        .then((messages) =>
          messages.filter((message) => message.author.id === channel.ownerId),
        )
        .then((msg) => {
          return msg.first().content;
        });
      !templateCheck.includes(
        "I have read the documentation and searched for previously created posts about this",
      )
        ? channel.send({ embeds: [templateCheckFalse] })
        : null;
      channel.send({ embeds: [useSolveCommand] });
    } catch (e) {}
  },
};
