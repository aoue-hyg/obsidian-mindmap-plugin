import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, ViewState, WorkspaceLeaf } from 'obsidian';
import { MindMapSetting, PluginSettings } from './Settings';
import { DEFAULT_SETTINGS, FONT_MATTER_KEY, PLUGIN_VIEW_TYPE, RIBBON_ICON_NAME } from './constants';
import { MindmapView } from './MindMapView';
import { t } from './i18n';
import { checkOrCreateFolder } from './utils/fileUtils';
import { around } from 'monkey-around';

export default class MindmapPlugin extends Plugin {
	settings: PluginSettings;
	currentViewMode: typeof PLUGIN_VIEW_TYPE | 'markdown' = PLUGIN_VIEW_TYPE

	async onload() {
		console.clear();

		await this.loadSettings();
		this.addSettingTab(new MindMapSetting(this.app, this));

		this.registerView(PLUGIN_VIEW_TYPE, leaf => new MindmapView(leaf, this));
		this.registerAllEvent()
		this.registerCommands()
		this.registerMonkeyPatches()

		this.addRibbonIcon(RIBBON_ICON_NAME, t('CREATE_NEW'), () => this.newMindmap());

	}

	registerMonkeyPatches() {
		const self = this
		this.register(
			around(WorkspaceLeaf.prototype, {
				setViewState(oldSetViewState) {
					return function (state: ViewState, ...rest: any[]) {
						let newState = state
						if (
							state.type === 'markdown' &&
							state.state?.file &&
							self.currentViewMode === PLUGIN_VIEW_TYPE &&
							self.isMindmapFile(state.state?.file)
						) {
							newState = {
								...state,
								type: PLUGIN_VIEW_TYPE
							}
						}
						return oldSetViewState.apply(this, [newState, ...rest]);
					}
				},
			}));
	}

	onunload() {

	}

	registerAllEvent() {

		this.registerEvent(
			this.app.workspace.on('file-menu', (menu, file, source, leaf) => {
				if (
					source === 'more-options' &&
					leaf && 
					this.isMindmapFile(file.path)
				) {
					menu.addItem((item) => {
						item
							.setTitle(this.currentViewMode === PLUGIN_VIEW_TYPE ? t('OPEN_AS_MARKDOWN') : t('OPEN_AS_MINDMAP'))
							.setSection('pane')
							.setIcon(this.currentViewMode === PLUGIN_VIEW_TYPE ? 'heading' : 'brain-circuit')
							.onClick(() => {
								this.triggerCurrentViewMode()
								this.setCurrentViewMode(leaf)
							});
					});
					//@ts-ignore
					menu.items.unshift(menu.items.pop());
				}

				return;
			})
		);
	}

	registerCommands() {
		this.addCommand({
			id: 'new-mind-map',
			name: 'new mindmap',
			callback: () => {
				this.newMindmap()
			},
		})
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	triggerCurrentViewMode() {
		this.currentViewMode = this.currentViewMode === PLUGIN_VIEW_TYPE ? 'markdown' : PLUGIN_VIEW_TYPE
	}

	setCurrentViewMode(leaf: WorkspaceLeaf) {
		leaf.setViewState({
			type: this.currentViewMode,
			state: leaf.getViewState().state
		})
	}

	async newMindmap(fname: string = t('UNTITLED_NEW_FILE_NAME'), initData?: string) {
		const { workspace, vault } = this.app
		const targetFolder = (
			// 用户指定的目录
			this.settings.folder ||
			// todo 当前文件同级目录
			'/'
		)

		await checkOrCreateFolder(vault, targetFolder)
		const time = window.moment().format(this.settings.filenameDateTime)
		const mindmapFile = await vault.create(
			`${targetFolder}/${fname} ${time}.mindmap.md`,
			initData || this.getBlankData()
		)

		//wait for metadata cache
		let counter = 0;
		while (mindmapFile instanceof TFile && !this.isMindmapFile(mindmapFile) && counter++ < 10) {
			await sleep(50);
		}

		const leaf = await workspace.getLeaf('tab')
		await leaf.setViewState({
			type: PLUGIN_VIEW_TYPE,
			state: { file: mindmapFile.path },
			active: true
		}, {
			focus: true
		})

		this.isMindmapFile(mindmapFile)
	}

	isMindmapFile(f: TFile | string) {
		if (!f) return false;
		const fileCache = (
			f instanceof TFile ?
				this.app.metadataCache.getFileCache(f) :
				this.app.metadataCache.getCache(f)
		)
		return !!fileCache?.frontmatter && !!fileCache.frontmatter[FONT_MATTER_KEY];
	}

	getBlankData() {
		return [
			'---',
			'',
			`${FONT_MATTER_KEY}: plugin`,
			'',
			'---',
			'',
			'',
		].join('\n');
	}
}
