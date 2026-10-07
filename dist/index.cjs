"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Context: () => Context,
  InteractionContext: () => InteractionContext,
  MessageContext: () => MessageContext
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Context,
  InteractionContext,
  MessageContext
});
//# sourceMappingURL=index.cjs.map