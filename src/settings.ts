import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf, WorkspaceItem, MarkdownEditView } from 'obsidian';
import MyPlugin from './main';

export interface PluginSettings {
	folder: string;
	filenameDateTime: string;
}


export class MindMapSetting extends PluginSettingTab {
	plugin: MyPlugin;
	folder: 'Mindmap'
	filenameDateTime: 'YYYY-MM-DD HH.mm.ss'

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// new Setting(containerEl)
		// .setName(t("FOLDER_NAME"))
		// .setDesc(fragWithHTML(t("FOLDER_DESC")))
		// .addText((text) =>
		// 	text
		// 		.setPlaceholder("Excalidraw")
		// 		.setValue(this.plugin.settings.folder)
		// 		.onChange(async (value) => {
		// 			this.plugin.settings.folder = value;
		// 			this.applySettingsUpdate();
		// 		}),
		// );

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}