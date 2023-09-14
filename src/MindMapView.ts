import { TextFileView, WorkspaceLeaf } from "obsidian";
import MindmapPlugin from "./main";
import { PLUGIN_VIEW_TYPE } from "./constants";

export class MindmapView extends TextFileView {
  plugin: MindmapPlugin
  
  constructor(leaf: WorkspaceLeaf, plugin: MindmapPlugin) {
    super(leaf);
    this.plugin = plugin
    this.leaf = leaf
  }

  onload(): void {
    console.log(`mindmap view onload`);
  }

  clear(): void {

  }
  getViewData() {
    console.log(`call getViewData`);
    return this.data
  }

  setViewData(data: string): void {
    console.log(`call mindmap setViewData`);
    const state = this.leaf.view.getViewType();
    console.log(state);
  }

  getViewType(): string {
    return PLUGIN_VIEW_TYPE

  }

}