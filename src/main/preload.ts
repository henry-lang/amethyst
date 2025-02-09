import type { IpcRendererEvent } from "electron";
import { contextBridge, ipcRenderer } from "electron";

export type Channels =
	"minimize" |
	"maximize" |
	"unmaximize" |
	"read-file" |
	"close" |
	"get-cover-pixelized" |
	"open-file-dialog" |
	"open-folder-dialog" |
	"get-cover" |
	"get-metadata" |
	"show-item" |
	"update-rich-presence" |
	"sync-window-state" |
	"drop-file" |
	"open-preferences" |
	"check-for-updates";

contextBridge.exposeInMainWorld("electron", {
	ipcRenderer: {
		invoke(channel: Channels, args?: string[]) {
			return ipcRenderer.invoke(channel, args);
		},
		send(channel: Channels, args: unknown[]) {
			ipcRenderer.send(channel, args);
		},
		on(channel: Channels, func: (...args: unknown[]) => void) {
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
				func(...args);
			ipcRenderer.on(channel, subscription);

			return () => ipcRenderer.removeListener(channel, subscription);
		},
		once(channel: Channels, func: (...args: unknown[]) => void) {
			ipcRenderer.once(channel, (_event, ...args) => func(...args));
		},
	},
});
