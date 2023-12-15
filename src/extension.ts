// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {QuickPickItem} from 'vscode';
import { config } from './config/themeVar';

let freeze = false;

// 弹出的选择框数据
const panelList: QuickPickItem[] = Object.entries(config).map(item=>{
	return {
		label: item[1].label + '-' + item[0],
		description: item[1].color,
		detail: item[0],
	};
});

// 弹出选择框
function openSelectPanel(){
	const activeTextEditor = vscode.window.activeTextEditor;
	vscode.window.showQuickPick(panelList).then((res)=>{
		if(!res?.label){
			return;
		}
		let str = `(${res?.detail},${res?.description});`;
		activeTextEditor?.edit((builder)=>{
			freeze = true;
			// 当前光标位置
			const selection = activeTextEditor?.selection;
			builder.replace(selection!,str);

			setTimeout(()=>{
				freeze = false;
			},100);
		});
	});
}




// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-plugin-demo" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-plugin-demo.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vscode-plugin-demo!');
	});

	// 监听文字编辑判断
	vscode.workspace.onDidChangeTextDocument(e => {
		if(freeze){
			return;
		}
		const activeTextEditor = vscode.window.activeTextEditor;

		const position = activeTextEditor?.selection.active;
		const document = activeTextEditor?.document;
		const range = document?.getWordRangeAtPosition(position!);
		const text = activeTextEditor?.document.getText(range);
		console.log("text---:" +text);
		if(!text){
			return;
		}
		const words = text?.split(/\s+/);
		const lastWords = words[words.length -1];

		if(lastWords === 'useThemeVar'){
			document && openSelectPanel();
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
