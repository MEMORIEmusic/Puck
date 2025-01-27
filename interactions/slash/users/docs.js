const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("docs")
    .setDescription("Get the link to the PlayCover Documentation (PlayBook)")
    .addStringOption((option) =>
      option
        .setName("page")
        .setDescription("Specify a Doc page")
        .setAutocomplete(true),
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("User to ping in reply"),
    ),

  async execute(interaction) {
    let specified = interaction.options.getString("page");
    let user = interaction.options.getUser("user");
    let embed = new EmbedBuilder();

    if (specified) {
      embed
        .setTitle(`${specified}`)
        .setDescription(
          `[Click here to open this page on PlayBook](https://${require("../../../resources/pages.json").find((page) => page.name == specified).url})`,
        )
        .setAuthor({ name: "PlayCover Documentation" })
        .setThumbnail(interaction.guild.iconURL());
    } else {
      embed
        .setTitle("Click here to open PlayBook")
        .setURL("https://docs.playcover.io/")
        .setAuthor({ name: "PlayCover Documentation" })
        .setThumbnail(interaction.guild.iconURL())
        .setColor("Random");
    }

    return interaction
      .reply({
        content: user
          ? `${user.toString()}, ${interaction.member.toString()} wanted you to see the documentation`
          : null,
        allowedMentions: { users: [user ? user.id : null] },
        embeds: [embed],
        ephemeral: user ? false : true,
      })
      .catch((error) => console.error(`[ERROR]: ${error}`));
  },
};
