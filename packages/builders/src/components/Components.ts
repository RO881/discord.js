import type { APIButtonComponent, APIMessageComponent, APIModalComponent } from 'discord-api-types/v10';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { ActionRowBuilder } from './ActionRow.js';
import type { AnyAPIActionRowComponent } from './Component.js';
import { ComponentBuilder } from './Component.js';
import type { ButtonBuilder } from './button/Button.js';
import {
	DangerButtonBuilder,
	PrimaryButtonBuilder,
	SecondaryButtonBuilder,
	SuccessButtonBuilder,
} from './button/CustomIdButton.js';
import { SKUIdButtonBuilder } from './button/SKUIdButton.js';
import { URLButtonBuilder } from './button/URLButton.js';
import { ChannelSelectMenuBuilder } from './selectMenu/ChannelSelectMenu.js';
import { MentionableSelectMenuBuilder } from './selectMenu/MentionableSelectMenu.js';
import { RoleSelectMenuBuilder } from './selectMenu/RoleSelectMenu.js';
import { StringSelectMenuBuilder } from './selectMenu/StringSelectMenu.js';
import { UserSelectMenuBuilder } from './selectMenu/UserSelectMenu.js';
import { TextInputBuilder } from './textInput/TextInput.js';

/**
 * The builders that may be used for messages.
 */
export type MessageComponentBuilder = ActionRowBuilder | MessageActionRowComponentBuilder;

/**
 * The builders that may be used for modals.
 */
export type ModalComponentBuilder = ActionRowBuilder | ModalActionRowComponentBuilder;

/**
 * Any button builder
 */
export type AnyButtonBuilder =
	| DangerButtonBuilder
	| PrimaryButtonBuilder
	| SecondaryButtonBuilder
	| SKUIdButtonBuilder
	| SuccessButtonBuilder
	| URLButtonBuilder;

/**
 * The builders that may be used within an action row for messages.
 */
export type MessageActionRowComponentBuilder =
	| AnyButtonBuilder
	| ChannelSelectMenuBuilder
	| MentionableSelectMenuBuilder
	| RoleSelectMenuBuilder
	| StringSelectMenuBuilder
	| UserSelectMenuBuilder;

/**
 * The builders that may be used within an action row for modals.
 */
export type ModalActionRowComponentBuilder = TextInputBuilder;

/**
 * Any action row component builder.
 */
export type AnyActionRowComponentBuilder = MessageActionRowComponentBuilder | ModalActionRowComponentBuilder;

/**
 * Components here are mapped to their respective builder.
 */
export interface MappedComponentTypes {
	/**
	 * The action row component type is associated with an {@link ActionRowBuilder}.
	 */
	[ComponentType.ActionRow]: ActionRowBuilder;
	/**
	 * The button component type is associated with a {@link ButtonBuilder}.
	 */
	[ComponentType.Button]: AnyButtonBuilder;
	/**
	 * The string select component type is associated with a {@link StringSelectMenuBuilder}.
	 */
	[ComponentType.StringSelect]: StringSelectMenuBuilder;
	/**
	 * The text input component type is associated with a {@link TextInputBuilder}.
	 */
	[ComponentType.TextInput]: TextInputBuilder;
	/**
	 * The user select component type is associated with a {@link UserSelectMenuBuilder}.
	 */
	[ComponentType.UserSelect]: UserSelectMenuBuilder;
	/**
	 * The role select component type is associated with a {@link RoleSelectMenuBuilder}.
	 */
	[ComponentType.RoleSelect]: RoleSelectMenuBuilder;
	/**
	 * The mentionable select component type is associated with a {@link MentionableSelectMenuBuilder}.
	 */
	[ComponentType.MentionableSelect]: MentionableSelectMenuBuilder;
	/**
	 * The channel select component type is associated with a {@link ChannelSelectMenuBuilder}.
	 */
	[ComponentType.ChannelSelect]: ChannelSelectMenuBuilder;
}

/**
 * Factory for creating components from API data.
 *
 * @typeParam ComponentType - The type of component to use
 * @param data - The API data to transform to a component class
 */
export function createComponentBuilder<ComponentType extends keyof MappedComponentTypes>(
	// eslint-disable-next-line @typescript-eslint/sort-type-constituents
	data: (APIModalComponent | APIMessageComponent) & { type: ComponentType },
): MappedComponentTypes[ComponentType];

/**
 * Factory for creating components from API data.
 *
 * @typeParam ComponentBuilder - The type of component to use
 * @param data - The API data to transform to a component class
 */
export function createComponentBuilder<ComponentBuilder extends MessageComponentBuilder | ModalComponentBuilder>(
	data: ComponentBuilder,
): ComponentBuilder;

export function createComponentBuilder(
	data: APIMessageComponent | APIModalComponent | MessageComponentBuilder,
): ComponentBuilder<AnyAPIActionRowComponent> {
	if (data instanceof ComponentBuilder) {
		return data;
	}

	switch (data.type) {
		case ComponentType.ActionRow:
			return new ActionRowBuilder(data);
		case ComponentType.Button:
			return createButtonBuilder(data);
		case ComponentType.StringSelect:
			return new StringSelectMenuBuilder(data);
		case ComponentType.TextInput:
			return new TextInputBuilder(data);
		case ComponentType.UserSelect:
			return new UserSelectMenuBuilder(data);
		case ComponentType.RoleSelect:
			return new RoleSelectMenuBuilder(data);
		case ComponentType.MentionableSelect:
			return new MentionableSelectMenuBuilder(data);
		case ComponentType.ChannelSelect:
			return new ChannelSelectMenuBuilder(data);
		default:
			// @ts-expect-error This case can still occur if we get a newer unsupported component type
			throw new Error(`Cannot properly serialize component type: ${data.type}`);
	}
}

function createButtonBuilder(data: APIButtonComponent): AnyButtonBuilder {
	switch (data.style) {
		case ButtonStyle.Primary:
			return new PrimaryButtonBuilder(data);
		case ButtonStyle.Secondary:
			return new SecondaryButtonBuilder(data);
		case ButtonStyle.Success:
			return new SuccessButtonBuilder(data);
		case ButtonStyle.Danger:
			return new DangerButtonBuilder(data);
		case ButtonStyle.Link:
			return new URLButtonBuilder(data);
		case ButtonStyle.Premium:
			return new SKUIdButtonBuilder(data);
		default:
			// @ts-expect-error This case can still occur if we get a newer unsupported button style
			throw new Error(`Cannot properly serialize button with style: ${data.style}`);
	}
}
