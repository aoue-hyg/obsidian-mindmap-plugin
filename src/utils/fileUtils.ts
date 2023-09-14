import { Notice, TFolder, Vault, normalizePath } from "obsidian"


export async function checkOrCreateFolder(vault: Vault, path: string) {
  const folderPath = normalizePath(path)
  const folder = vault.getAbstractFileByPath(folderPath)
  
  if (folder && folder instanceof TFolder) {
    return;
  }
  
  return await vault.createFolder(folderPath)

}