const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("keymap")
    .setDescription("Information about the keymapping system")
    .addStringOption((option) =>
      option
        .setName("keymap")
        .setDescription("Premade keymaps")
        .setAutocomplete(true),
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("User to ping in reply"),
    ),

  async execute(interaction) {
    let game = interaction.options.getString("keymap");
    let user = interaction.options.getUser("user");
    let embed = new EmbedBuilder();

    if (game) {
      embed
        .setThumbnail("https://playcover.io/PlayCover-Square.png")
        .setDescription(
          `## [Click here to download keymapping for ${game}](https://${
            require("../../../resources/keymaps.json").find(
              (keymap) => keymap.name == game,
            ).url
          })`,
        )
        .addFields(
          {
            name: "Encountering a problem?",
            value:
              "If you are facing keymapping issues, please make sure you are on macOS 13.1 or above. If so, please make a support post in <#1019859452352020540>",
            inline: true,
          },
          {
            name: "How to import keymapping",
            value: `1. In PlayCover, \`right click/control click\` ${game} \n2. Select \`Import Keymapping\` from the drop down menu\n3. Navigate the keymap you just downloaded and press \`Open\`.\nFor further information, please read the [docs](https://docs.playcover.io/keymapping/using_making_keymaps).`,
            inline: true,
          },
        )
        .addFields({
          name: "\u200B",
          value: "# Here's how to download the keymaps:",
        })
        .setImage("https://i.imgur.com/QsOX6gl.gif")
        .setFooter({
          text: `Keymap for ${game}`,
          iconURL: `https://i.imgur.com/TS5tXcv.png`,
        })
        .setTimestamp()
        .setColor(`#78D7A3`);
    } else {
      embed.setTitle("Keymapping FAQ").setDescription(`
                ➤ \`Command (CMD) + K\` — Toggle keymapping mode

                **Button Events:**
                ➤ \`Clicking on the screen\` — Opens a menu to add a button element.
                ➤ In this menu, the following prompts allow you to add specific buttons:

                > \`Clicking on 'LB'\` — Bind left mouse button.
                > \`Clicking on 'RB'\` — Bind right mouse button.
                > \`Clicking on\` ':mouse_three_button:' — Bind middle mouse button
                > \`Clicking on\` ':heavy_plus_sign:' — Adds a W/A/S/D Joystick
                > \`Clicking on\` ':arrows_counterclockwise:' — Adds a Mouse Area

                **Flow Control:**
                ➤ \`Command (CMD) + '↑'\` — Increase the selected buttons size
                ➤ \`Command (CMD) + '↓'\` — Decrease the selected buttons size
                ➤ \`Command (CMD) + Delete (Backspace)\` — Delete the selected keymapping
                ➤ \`Press option (⌥)\` — Toggle between show/hide cursor
            `);
    }

    return interaction
      .reply({
        content: user
          ? `${user.toString()}, ${interaction.member.toString()} wanted you to check out this keymap:`
          : null,
        allowedMentions: { users: [user ? user.id : null] },
        embeds: [embed],
        ephemeral: user ? false : true,
      })
      .catch((error) => console.error(`[ERROR]: ${error}`));
  },
};
