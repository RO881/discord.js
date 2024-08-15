import {
	ButtonStyle,
	ComponentType,
	type APIButtonComponent,
	type APIButtonComponentWithURL,
} from 'discord-api-types/v10';
import { Mixin } from 'ts-mixer';
import { ButtonBuilder } from './Button.js';
import { URLOrCustomIdButtonMixin } from './mixins/URLOrCustomIdButtonMixin.js';

/**
 * A builder that creates API-compatible JSON data for buttons with URLs.
 */
export class URLButtonBuilder extends Mixin(ButtonBuilder<APIButtonComponentWithURL>, URLOrCustomIdButtonMixin) {
	protected override readonly data: Partial<APIButtonComponentWithURL>;

	public constructor(data: Partial<APIButtonComponent> = {}) {
		super();
		this.data = { ...structuredClone(data), type: ComponentType.Button, style: ButtonStyle.Link };
	}

	/**
	 * Sets the URL for this button.
	 *
	 * @remarks
	 * This method is only available to buttons using the `Link` button style.
	 * Only three types of URL schemes are currently supported: `https://`, `http://`, and `discord://`.
	 * @param url - The URL to use
	 */
	public setURL(url: string) {
		this.data.url = url;
		return this;
	}
}
