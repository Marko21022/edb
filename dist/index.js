// src/context/Context.ts
var Context = class {
  client;
  source;
  user;
  guild;
  member;
  channel;
  message;
  interaction;
  args;
  constructor(options) {
    this.client = options.client;
    this.source = options.source;
    this.user = options.user;
    this.guild = options.guild ?? null;
    this.member = options.member ?? null;
    this.channel = options.channel ?? null;
    this.message = options.message ?? null;
    this.interaction = options.interaction ?? null;
    this.args = options.args ?? [];
  }
  async reply(content) {
    if (this.interaction) {
      if (this.interaction.replied || this.interaction.deferred) {
        return this.interaction.followUp(content);
      }
      return this.interaction.reply(content);
    }
    if (this.message) {
      return this.message.reply(content);
    }
    throw new Error("Cannot reply: context has no message or interaction.");
  }
};

// src/context/MessageContext.ts
var MessageContext = class extends Context {
  constructor(message, args) {
    super({
      client: message.client,
      source: "prefix",
      user: message.author,
      guild: message.guild,
      member: message.member,
      channel: message.channel,
      message,
      interaction: null,
      args
    });
  }
};

// src/context/InteractionContext.ts
var InteractionContext = class extends Context {
  constructor(interaction) {
    super({
      client: interaction.client,
      source: "slash",
      user: interaction.user,
      guild: interaction.guild,
      member: interaction.member,
      channel: interaction.channel,
      message: null,
      interaction,
      args: []
    });
  }
};
export {
  Context,
  InteractionContext,
  MessageContext
};
//# sourceMappingURL=index.js.map