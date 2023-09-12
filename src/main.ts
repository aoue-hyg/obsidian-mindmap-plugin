import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { PluginSettings } from './settings';
import { DEFAULT_SETTINGS } from './constants';

export default class MindmapPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
