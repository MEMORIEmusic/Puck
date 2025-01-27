require("dotenv").config();
const fs = require("fs");
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  Options,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const usecommand = new AttachmentBuilder("./resources/usecommands.gif");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Reaction, Partials.Message, Partials.User],
  makeCache: Options.cacheEverything(),
});

client.slashCommands = new Collection();
client.buttonCommands = new Collection();
client.selectCommands = new Collection();
client.modalCommands = new Collection();
client.autocompleteInteractions = new Collection();

try {
  const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(
        event.name,
        async (...args) => await event.execute(...args, client),
      );
    }
  }
  console.log("[CLIENT] All Events Loaded.");
} catch (error) {
  console.log(
    `[ERROR] Failed to Load Events: ${error.toString().substring(7)}`,
  );
}

try {
  const slashCommands = fs.readdirSync("./interactions/slash");

  for (const module of slashCommands) {
    const commandFiles = fs
      .readdirSync(`./interactions/slash/${module}`)
      .filter((file) => file.endsWith(".js"));

    for (const commandFile of commandFiles) {
      const command = require(`./interactions/slash/${module}/${commandFile}`);
      client.slashCommands.set(command.data.name, command);
    }
  }
  console.log("[CLIENT] All Slash Commands Loaded.");
} catch (error) {
  console.log(
    `[ERROR] Failed to Load Slash Commands: ${error.toString().substring(7)}`,
  );
}

try {
  const autocompleteInteractions = fs.readdirSync(
    "./interactions/autocomplete",
  );

  for (const module of autocompleteInteractions) {
    const files = fs
      .readdirSync(`./interactions/autocomplete/${module}`)
      .filter((file) => file.endsWith(".js"));

    for (const interactionFile of files) {
      const interaction = require(
        `./interactions/autocomplete/${module}/${interactionFile}`,
      );
      client.autocompleteInteractions.set(interaction.name, interaction);
    }
  }
  console.log("[CLIENT] All Autocomplete Interactions Loaded.");
} catch (error) {
  console.log(
    `[ERROR] Failed to Load Autocomplete Interactions: ${error.toString().substring(7)}`,
  );
}

try {
  const buttonCommands = fs.readdirSync("./interactions/buttons");

  for (const module of buttonCommands) {
    const commandFiles = fs
      .readdirSync(`./interactions/buttons/${module}`)
      .filter((file) => file.endsWith(".js"));

    for (const commandFile of commandFiles) {
      const command = require(
        `./interactions/buttons/${module}/${commandFile}`,
      );
      client.buttonCommands.set(command.id, command);
    }
  }

  console.log("[CLIENT] All Button Interactions Loaded.");
} catch (error) {
  console.log(
    `[ERROR] Failed to Load Button Interactions: ${error.toString().substring(7)}`,
  );
}

try {
  const modalCommands = fs.readdirSync("./interactions/modals");

  for (const module of modalCommands) {
    const commandFiles = fs
      .readdirSync(`./interactions/modals/${module}`)
      .filter((file) => file.endsWith(".js"));

    for (const commandFile of commandFiles) {
      const command = require(`./interactions/modals/${module}/${commandFile}`);
      client.modalCommands.set(command.id, command);
    }
  }
  console.log("[CLIENT] All Modal Interactions Loaded.");
} catch (error) {
  console.log(
    `[ERROR] Failed to Load Modal Interactions: ${error.toString().substring(7)}`,
  );
}

try {
  const selectMenus = fs.readdirSync("./interactions/select-menus");

  for (const module of selectMenus) {
    const commandFiles = fs
      .readdirSync(`./interactions/select-menus/${module}`)
      .filter((file) => file.endsWith(".js"));
    for (const commandFile of commandFiles) {
      const command = require(
        `./interactions/select-menus/${module}/${commandFile}`,
      );
      client.selectCommands.set(command.id, command);
    }
  }
  console.log("[CLIENT] All Select Menus Loaded.");
} catch (error) {
  console.log(
    `[ERROR] Failed to Load Select Menus Interactions: ${error.toString().substring(7)}`,
  );
}

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

(async () => {
  try {
    // await rest.put(Routes.applicationGuildCommands(process.env.CLIENT, process.env.GUILD), { body: [...Array.from(client.slashCommands.values()).map(c => c.data.toJSON())] });
    await rest.put(Routes.applicationCommands(process.env.CLIENT), {
      body: [
        ...Array.from(client.slashCommands.values()).map((c) =>
          c.data.toJSON(),
        ),
      ],
    });

    console.log("[CLIENT] All Slash Commands Registered.");
  } catch (error) {
    console.log(
      `[ERROR] Registering Slash Commands: ${error.toString().substring(7)}`,
    );
  }
})();

const prefix = ".";

client.on("messageCreate", (message) => {
  const args = message.content.trim().split(/ +/g);
  const cmd = args[0].slice(prefix.length).toLowerCase();

  if (cmd === "keymap" || cmd === "keymapping") {
    if (args[0]) {
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: "Invalid Command" })
            .setDescription(
              `The \`.keymap\` command has been deprecated in favour of slash commands! Please use \`/keymap\` command.`,
            )
            .setImage(
              "https://cdn.discordapp.com/attachments/818783506716557316/1213510301253767250/useKeymap.gif?ex=65f5bc89&is=65e34789&hm=3ecf97bf13691b0c554309e45f17c034b1999fd629e4db0991f2499cc99bd83e&",
            )
            .setTimestamp()
            .setColor("#cf3838")
            .setFooter({
              text: "An error occurred",
              iconURL: "https://i.imgur.com/fdzF9QP.png",
            }),
        ],
      });
    }

    // command code
  }
});
client.login(process.env.TOKEN);
