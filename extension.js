const vscode = require("vscode");
const { exec } = require("child_process");
const path = require("path");

let existingTerminal;

function activate(context) {
  let disposable_buildJava = vscode.commands.registerCommand("extension.buildJava", (uri) => {
    if (!uri) {
      vscode.window.showErrorMessage("No file path provided.");
      return;
    }

    const filePath = uri.path;

    const javaPath = vscode.workspace.getConfiguration("nevs-affogato").get("javaPath", "/opt/homebrew/opt/openjdk/bin");

    const fileBasenameNoExtension = path.basename(filePath, ".java");

    // Check if an existing terminal window is open
    let existingTerminal = vscode.window.terminals.find(
      (terminal) => terminal.name === "Affogato Java Build"
    );

    if (!existingTerminal) {
      // Create a new terminal with the correct working directory
      existingTerminal = vscode.window.createTerminal({
        name: "Affogato Java Build",
        cwd: path.dirname(filePath), // Set the working directory to the directory containing the Java file
      });
    }

    // Show the existing terminal
    existingTerminal.show();

    // Run the script in the existing terminal using the provided file path
    existingTerminal.sendText(`${javaPath}/javac ${fileBasenameNoExtension}.java && ${javaPath}/java ${fileBasenameNoExtension} && rm ${fileBasenameNoExtension}.class`);
  });
  // this will def get reworked if vscode gets dynamic submenus
  /*let disposable_buildJavaMenu = vscode.commands.registerCommand("extension.buildJavaMenu", () => {
    // Read and parse options from settings.json
    const options = vscode.workspace.getConfiguration("nevs-affogato").get("javaPaths", []);

    // Generate a list of options from settings
    const optionsList = options.map((option) => `${option.alias}: ${option.path}`).join("\n");

    // Show the options in a custom panel
    vscode.window.showInformationMessage(optionsList);
  });*/

  context.subscriptions.push(disposable_buildJava);
  //context.subscriptions.push(disposable_buildJavaMenu);
}

exports.activate = activate;
