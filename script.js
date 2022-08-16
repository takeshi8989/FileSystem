class Node{
    constructor(name, parent, type){
        this.name = name;
        this.parent = parent;
        this.type = type;
        this.content = "empty";
        this.children = new LinkedList();
        this.next = null;
    }

    getName(){
        return this.name;
    }
    getContent(){
        return this.content;
    }
    setContent(newContentString){
        this.content = newContentString;
    }
    getParentName(){
        return this.parent.getName();
    }
    getParentNode(){
        return this.parent;
    }
    setParent(parentNode){
        this.parent = parentNode;
    }
    getType(){
        return this.type;
    }
    getChildrenString(){
        return this.children.toString();
    }
    getChildrenStringAll(){
        return this.children.toStringAll();
    }
    getChildrenStringReverse(){
        return this.children.toStringReverse();
    }
    getChildren(){
        return this.children;
    }
    addChild(childNode){
        this.children.add(childNode);
    }
    isChildExist(name){
        return this.children.getNode(name) != null;
    }
    getChild(name){
        if(!this.isChildExist(name)) return null;
        return this.children.getNode(name);
    }
}

class LinkedList{
    constructor(){
        this.head = null;
        this.tail = null;
    }
    add(node){
        if(this.head == null) this.head = node;
        else if(this.tail == null){
            this.tail = node;
            this.head.next = this.tail;
        }
        else{
            this.tail.next = node;
            this.tail = this.tail.next;
        }
    }
    remove(nodeName){
        if(this.head.getName() == nodeName){
            this.head = this.head.next;
            return nodeName;
        }
        let iterator = this.head;
        if(iterator.next == null) return "no file";
        while(iterator.next != null){
            if(iterator.next.getName() == nodeName){
                if(iterator.next == this.tail) this.tail = iterator;
                iterator.next = iterator.next.next;
                return nodeName;
            }
            iterator = iterator.next;
        }
        return "no file";
    }

    getNode(nodeName){
        let iterator = this.head;
        while(iterator != null){
            if(iterator.getName() == nodeName){
                return iterator;
            }
            iterator = iterator.next;
        }
        return null;
    }

    toString(){
        let string = "";
        let iterator = this.head;
        while(iterator != null){
            if(iterator.getName().charAt(0) != '.') string += iterator.getName() + " ";
            iterator = iterator.next;
        }
        return string;
    }
    toStringReverse(){
        let string = "";
        let iterator = this.head;
        while(iterator != null){
            if(iterator.getName().charAt(0) != '.') string = iterator.getName() + " " + string;
            iterator = iterator.next;
        }
        return string;
    }
    toStringAll(){
        let string = "";
        let iterator = this.head;
        while(iterator != null){
            string = iterator.getName() + " " + string;
            iterator = iterator.next;
        }
        return string;
    }
}

class FileSystemTree{
    constructor(){
        this.root = new Node("root", null, "directory");
        this.current = this.root;
    }

    findNode(filePath){
        let pathArr = filePath.substring(0, filePath.length - 1).substring(1).split('/');
        let iterator = this.root;
        if(pathArr[0] != "root") return null;
        for(let i = 1; i < pathArr.length; i++){
            if(iterator == null) return null;
            iterator = iterator.getChild(pathArr[i]);
        }
        return iterator;
    }

    touch(fileName){
        if(hashMap[fileName] != null){
            HelperFunctions.appendError("sameName");
            return;
        }
        this.current.addChild(new Node(fileName, this.current, "file"));
        hashMap[fileName] = fileName;
    }
    touchPath(path, fileName){
        let targetPath = this.findNode(path);
        if(targetPath == null) HelperFunctions.appendError("pathError");
        else{
            targetPath.addChild(new Node(fileName, targetPath, "file"));
        }
    }
    mkdir(dirName){
        if(hashMap[dirName] != null){
            HelperFunctions.appendError("sameName");
            return;
        }
        this.current.addChild(new Node(dirName, this.current, "directory"));
        hashMap[dirName] = dirName;
    }
    mkdirPath(path, dirName){
        let targetPath = this.findNode(path);
        if(targetPath == null) HelperFunctions.appendError("pathError");
        else{
            targetPath.addChild(new Node(dirName, targetPath, "directory"));
        }
    }

    ls(){
        return this.current.getChildrenString();
    }

    lsChild(nameOrPath){
        let child = this.current.getChild(nameOrPath);
        let targetPath = this.findNode(nameOrPath);

        if(child != null){
            return child.getChildrenString();
        }
        else if(targetPath != null){
            return targetPath.getChildrenString();
        }
        return `${nameOrPath} is not exist`;
    }

    lsAll(){
        return this.current.getChildrenStringAll();
    }
    lsReverse(){
        return this.current.getChildrenStringReverse();
    }

    cd(dirNameOrPath){
        let child = this.current.getChild(dirNameOrPath);
        let targetPath = this.findNode(dirNameOrPath);

        if(dirNameOrPath == ".." && this.current != this.root){
            this.current = this.current.getParentNode();
        }
        else if(child != null && child.getType() == "directory"){
            this.current = child;
        }
        else if(targetPath != null && targetPath.getType() == "directory"){
            this.current = targetPath;
        }
        return;
    }

    pwd(){
        let string = "";
        let iterator = this.current;
        while(iterator != null){
            string = iterator.getName() + "/" + string;
            if(iterator == this.root) return "/" + string;
            iterator = iterator.getParentNode();
        }
        return string;
    }

    print(fileNameOrPath){
        let child = this.current.getChild(fileNameOrPath);
        let targetPath = this.findNode(fileNameOrPath);

        if(child != null && child.getType() == "file"){
            return child.getContent();
        }
        else if(targetPath != null && targetPath.getType() == "file"){
            return targetPath.getContent();
        }
        else return "No file";
    }

    setContent(fileNameOrPath, content){
        let child = this.current.getChild(fileNameOrPath);
        let targetPath = this.findNode(fileNameOrPath);
        if(child != null && child.getType() == "file"){
            child.setContent(content);
        }
        else if(targetPath != null && targetPath.getType() == "file"){
            targetPath.setContent(content);
        }
    }

    rm(nameOrPath){
        let child = this.current.getChild(nameOrPath);
        let targetPath = this.findNode(nameOrPath);
        if(child != null){
            return this.current.children.remove(nameOrPath);
        }
        else if(targetPath != null){
            let name = nameOrPath.split('/');
            return targetPath.getParentNode().children.remove(name[name.length - 2]);
        }
        else{
            dataDiv.innerHTML += `<p class="text-danger">there is no ${nameOrPath}</p>`;
        }
    }

    move(targetPath, goalPath){
        console.log(1);
        let targetNode = this.findNode(targetPath);
        let goalNode = this.findNode(goalPath);
        console.log(targetNode.getName());
        console.log(goalNode.getName());
        if(targetNode == null || goalNode == null || goalNode.getType() == "file") return;
        if(this.rm(targetPath) != null){
            targetNode.setParent(goalNode);
            goalNode.addChild(targetNode);
        }
        return;
    }
}

const dataDiv = document.getElementById("dataDiv");
const commandInput = document.getElementById("commandInput");
let removeMode = false;
let removing = "";
let addRemovePathEvent = false;

let tree = new FileSystemTree();
let hashMap = {

}

commandInput.addEventListener("keydown", function(e){
    if(e.key == "Enter" && removeMode){
        let value = commandInput.value;
        commandInput.value = "";
        HelperFunctions.confirmRemove(value);
        dataDiv.scrollTop = dataDiv.scrollHeight;
    }
    else if(e.key == "Enter"){
        let value = commandInput.value;
        commandInput.value = "";
        HelperFunctions.appendInput(value);
        HelperFunctions.conductCommand(value);
        dataDiv.scrollTop = dataDiv.scrollHeight;
    }
})



class HelperFunctions{

    static appendInput(value){
        let html = `<p><span style="color:green">student</span> <span style="color:pink">@ </span><span style="color:blue">recursionist</span>: ${value}</p>`;

        dataDiv.innerHTML += html;
    }

    static appendError(errorType){
        let message = "";
        if(errorType == "command"){
            message = `invalid input. Commands are 'cd','print','rm', 'pwd', 'ls' 'mkdir', 'touch, move'`;
        }
        else if(errorType == "sameName"){
            message = `you already have the file or directory.`;
        }
        else if(errorType == "pathError"){
            message = `this path is not accessible`;
        }
        else if(errorType == "mkdir"){
            message = `mkdir [directoryName] or mkdir [path] [directoryName]`;
        }
        else if(errorType == "ls"){
            message = `ls or ls [path] or `;
            message += `ls "-a" to see all file and directory ls "-r" to get file and directory reversely`;
        }
        else if(errorType == "cd"){
            message = `cd ".." to go to the parent or cd [child'sName]or cd [childPath]`;
        }
        else if(errorType == "touch"){
            message = `touch [fileName] or touch [path] [fileName]`;
        }
        else if(errorType == "pwd"){
            message = `pwd command doesn't require any arguments`;
        }
        else if(errorType == "print"){
            message = `print [fileName] or print [path]`;
        }
        else if(errorType == "setContent"){
            message = `setContent [fileName] [content] or setContent [path] [content]`;
        }
        else if(errorType == "rm"){
            message = `rm [fileName/directoryName] or rm [path]`;
        }
        else if(errorType == "move"){
            message = `move [targetpath] [parentPath]`;
        }
        else{
            message = `invalid input. Commands are 'cd','print','rm', 'pwd', 'ls' 'mkdir', 'touch, move'`;
        }

        let html = `<p><span style="color:red">CLIError</span>: ${message}</p>`;
        dataDiv.innerHTML += html;
    }

    static appendResult(result){
        let html = `<p>: ${result}</p>`;
        dataDiv.innerHTML += html;
    }


    static conductCommand(value){
        let arr = value.split(' ');
        if(arr.length == 0) HelperFunctions.appendError("command");
        else if(arr[0] == "touch") HelperFunctions.touch(arr);
        else if(arr[0] == "mkdir") HelperFunctions.mkdir(arr);
        else if(arr[0] == "ls") HelperFunctions.ls(arr);
        else if(arr[0] == "cd") HelperFunctions.cd(arr);
        else if(arr[0] == "pwd") HelperFunctions.pwd(arr);
        else if(arr[0] == "print") HelperFunctions.print(arr);
        else if(arr[0] == "setContent") HelperFunctions.setContent(arr);
        else if(arr[0] == "rm") HelperFunctions.rm(arr);
        else if(arr[0] == "move") HelperFunctions.move(arr);
        else HelperFunctions.appendError("command");
    }


    static touch(arr){
        if(arr.length == 2) tree.touch(arr[1]);
        else if(arr.length == 3) tree.touchPath(arr[1], arr[2]);
        else HelperFunctions.appendError("touch");
    }

    static mkdir(arr){
        if(arr.length == 2) tree.mkdir(arr[1]);
        else if(arr.length == 3) tree.mkdirPath(arr[1], arr[2]);
        else  HelperFunctions.appendError("mkdir");
    }
    static ls(arr){
        if(arr.length == 1) HelperFunctions.appendResult(tree.ls());
        else if(arr.length == 2 && arr[1] == "-a") HelperFunctions.appendResult(tree.lsAll());
        else if(arr.length == 2 && arr[1] == "-r") HelperFunctions.appendResult(tree.lsReverse());
        else if(arr.length == 2) HelperFunctions.appendResult(tree.lsChild(arr[1]));
        else HelperFunctions.appendError("ls");
    }
    static cd(arr){
        if(arr.length != 2) HelperFunctions.appendError("cd");
        else tree.cd(arr[1]);
    }
    static pwd(arr){
        if(arr.length != 1) HelperFunctions.appendError("pwd");
        else HelperFunctions.appendResult(tree.pwd());
    }
    static print(arr){
        if(arr.length != 2) HelperFunctions.appendError("print");
        else HelperFunctions.appendResult(tree.print(arr[1]));
    }
    static setContent(arr){
        if(arr.length != 3) HelperFunctions.appendError("setContent");
        else tree.setContent(arr[1], arr[2]);
    }
    static rm(arr){
        if(arr.length != 2) HelperFunctions.appendError("rm");
        else{
            removing = arr[1];
            dataDiv.innerHTML += `<p>Are you sure? yes/no</p>`;
            removeMode = true;
        }
    }

    static confirmRemove(yesOrNo){
        if(yesOrNo == "yes"){
            removeMode = false;
            dataDiv.innerHTML += `<p>removed</p>`;
            dataDiv.scrollTop = dataDiv.scrollHeight;
            tree.rm(removing);
            return;
        }
        else if(yesOrNo == "no"){
            dataDiv.innerHTML += `<p>canceled</p>`;
            commandInput.value = "";
            removeMode = false;
            dataDiv.scrollTop = dataDiv.scrollHeight;
        }
        else{
            dataDiv.innerHTML += '<p>please type "yes" or "no"';
            commandInput.value = "";
            dataDiv.scrollTop = dataDiv.scrollHeight;
        }
    }
}
