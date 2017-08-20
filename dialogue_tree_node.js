class DialogueNode {
    constructor(key, text='', terminating_action=undefined, aliases=[]) {
        this.key = key;
        this.text = text;
        this.aliases = aliases;
        this.terminatingAction = terminating_action;
        this.children = {};
    }

    registerChild(node) {
        this.children[node.key] = node;
        return this;
    }

    registerChildWithText(key, text, aliases=[]) {
        this.registerChild(new DialogueNode(key, text, undefined, aliases));
        return this;
    }

    registerChildWithAction(key, terminating_action, aliases=[]) {
        this.registerChild(new DialogueNode(key, '', terminating_action, aliases));
        return this;
    }

    getChildByKey(key) {
        return this.children[key];
    }

    getChildWithKeyOrAlias(key) {
        if (this.getChildByKey(key)) {
            return this.getChildByKey(key);
        } else {
            for (var child in this.children) {
                if (this.children[child].aliases.includes(key)) {
                    return this.children[child];
                }
            }
            return undefined;
        }
    }

    hasChildren() {
        for (var key in this.children) {
            if (this.children.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    }
}

module.exports = DialogueNode;
