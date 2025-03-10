import { EmbedBlot } from 'parchment';
import TextBlot from './text';
const GUARD_TEXT = '\uFEFF';
class Embed extends EmbedBlot {
    constructor(scroll, node) {
        super(scroll, node);
        this.contentNode = document.createElement('span');
        this.contentNode.setAttribute('contenteditable', 'false');
        Array.from(this.domNode.childNodes).forEach((childNode) => {
            this.contentNode.appendChild(childNode);
        });
        this.leftGuard = document.createTextNode(GUARD_TEXT);
        this.rightGuard = document.createTextNode(GUARD_TEXT);
        this.domNode.appendChild(this.leftGuard);
        this.domNode.appendChild(this.contentNode);
        this.domNode.appendChild(this.rightGuard);
    }
    index(node, offset) {
        if (node === this.leftGuard)
            return 0;
        if (node === this.rightGuard)
            return 1;
        return super.index(node, offset);
    }
    restore(node) {
        let range = null;
        let textNode;
        const text = node.data.split(GUARD_TEXT).join('');
        if (node === this.leftGuard) {
            if (this.prev instanceof TextBlot) {
                const prevLength = this.prev.length();
                this.prev.insertAt(prevLength, text);
                range = {
                    startNode: this.prev.domNode,
                    startOffset: prevLength + text.length,
                };
            }
            else {
                textNode = document.createTextNode(text);
                this.parent.insertBefore(this.scroll.create(textNode), this);
                range = {
                    startNode: textNode,
                    startOffset: text.length,
                };
            }
        }
        else if (node === this.rightGuard) {
            if (this.next instanceof TextBlot) {
                this.next.insertAt(0, text);
                range = {
                    startNode: this.next.domNode,
                    startOffset: text.length,
                };
            }
            else {
                textNode = document.createTextNode(text);
                // @ts-expect-error Fix me later
                this.parent.insertBefore(this.scroll.create(textNode), this.next);
                range = {
                    startNode: textNode,
                    startOffset: text.length,
                };
            }
        }
        node.data = GUARD_TEXT;
        return range;
    }
    update(mutations, context) {
        mutations.forEach((mutation) => {
            if (mutation.type === 'characterData' &&
                (mutation.target === this.leftGuard ||
                    mutation.target === this.rightGuard)) {
                const range = this.restore(mutation.target);
                if (range)
                    context.range = range;
            }
        });
    }
}
export default Embed;
//# sourceMappingURL=embed.js.map