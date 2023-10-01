const vscode = require("vscode");
const { exec } = require("child_process");
const path = require("path");

let existingTerminal;

function activate(context) {
  let disposable = vscode.commands.registerCommand("extension.buildJava", () => {
    // Get the currently active text editor's file name
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active text editor found.");
      return;
    }

    const javaPath = vscode.workspace.getConfiguration("nev-vs-java-builder").get("javaPath", "/opt/homebrew/opt/openjdk/bin");
    
    const fileName = editor.document.fileName;
    const fileBasenameNoExtension = path.basename(fileName, ".java");

    // Check if an existing terminal window is open
    if (!existingTerminal) {
      // Create a new terminal with the correct working directory
      existingTerminal = vscode.window.createTerminal({
        name: "Nev Java Build",
        cwd: path.dirname(fileName) // Set the working directory to the directory containing the Java file
      });
    }

    // Show the existing terminal
    existingTerminal.show();
    
    // Run the script in the existing terminal
    existingTerminal.sendText(`${javaPath}/javac ${fileBasenameNoExtension}.java && ${javaPath}/java ${fileBasenameNoExtension} && rm ${fileBasenameNoExtension}.class`);
  });

  context.subscriptions.push(disposable);
}

exports.activate = activate;